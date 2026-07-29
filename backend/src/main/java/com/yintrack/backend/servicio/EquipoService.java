package com.yintrack.backend.servicio;

import com.yintrack.backend.dto.EquipoRegistroRequest;
import com.yintrack.backend.dto.EquipoRespuestaDto;
import com.yintrack.backend.excepcion.RecursoNoEncontradoException;
import com.yintrack.backend.modelo.Equipo;
import com.yintrack.backend.modelo.HistorialEstado;
import com.yintrack.backend.modelo.TecnicoTicket;
import com.yintrack.backend.modelo.TecnicoTicketId;
import com.yintrack.backend.modelo.Ticket;
import com.yintrack.backend.modelo.Usuario;
import com.yintrack.backend.modelo.enums.EstadoTicket;
import com.yintrack.backend.modelo.enums.NombreRol;
import com.yintrack.backend.repositorio.EquipoRepositorio;
import com.yintrack.backend.repositorio.HistorialEstadoRepositorio;
import com.yintrack.backend.repositorio.TecnicoTicketRepositorio;
import com.yintrack.backend.repositorio.TicketRepositorio;
import com.yintrack.backend.repositorio.UsuarioRepositorio;
import com.yintrack.backend.seguridad.UsuarioPrincipal;
import java.time.Year;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EquipoService {

    private static final Logger log = LoggerFactory.getLogger(EquipoService.class);

    private final EquipoRepositorio equipoRepositorio;
    private final TicketRepositorio ticketRepositorio;
    private final HistorialEstadoRepositorio historialEstadoRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final TecnicoTicketRepositorio tecnicoTicketRepositorio;

    @Transactional
    public EquipoRespuestaDto registrar(EquipoRegistroRequest peticion, UsuarioPrincipal solicitante) {
        Usuario solicitanteUsuario = solicitante.getUsuario();
        NombreRol rolSolicitante = solicitanteUsuario.getRol().getNombre();

        Long clienteId;
        if (rolSolicitante == NombreRol.CLIENTE) {
            clienteId = solicitanteUsuario.getId();
        } else {
            if (peticion.clienteId() == null) {
                throw new IllegalArgumentException("Debes indicar el cliente dueno del equipo");
            }
            clienteId = peticion.clienteId();
        }

        Usuario cliente = usuarioRepositorio.findById(clienteId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado"));

        Equipo equipo = Equipo.builder()
            .folio(generarFolio())
            .cliente(cliente)
            .tipo(peticion.tipo())
            .marca(peticion.marca())
            .modelo(peticion.modelo())
            .numeroSerie(peticion.numeroSerie())
            .descripcion(peticion.descripcion())
            .build();
        equipo = equipoRepositorio.save(equipo);

        Ticket ticket = Ticket.builder()
            .equipo(equipo)
            .estado(EstadoTicket.RECIBIDO)
            .descripcionProblema(peticion.descripcionProblema())
            .build();
        ticket = ticketRepositorio.save(ticket);

        Usuario registradoPor = rolSolicitante == NombreRol.CLIENTE ? null : solicitanteUsuario;
        HistorialEstado historial = HistorialEstado.builder()
            .ticket(ticket)
            .estado(EstadoTicket.RECIBIDO)
            .comentario("Equipo recibido en el taller")
            .registradoPor(registradoPor)
            .build();
        historialEstadoRepositorio.save(historial);

        asignarTecnicoConMenosCarga(ticket);

        return new EquipoRespuestaDto(
            equipo.getFolio(),
            equipo.getTipo(),
            equipo.getMarca(),
            equipo.getModelo(),
            equipo.getNumeroSerie(),
            equipo.getDescripcion(),
            ticket.getEstado().name()
        );
    }

    private String generarFolio() {
        long siguiente = equipoRepositorio.count() + 1;
        return String.format("YIN-%d-%06d", Year.now().getValue(), siguiente);
    }

    private void asignarTecnicoConMenosCarga(Ticket ticket) {
        List<Usuario> tecnicosActivos = usuarioRepositorio.findByRol_NombreAndActivoTrue(NombreRol.TECNICO);
        if (tecnicosActivos.isEmpty()) {
            log.warn("No hay tecnicos activos, el ticket {} quedo sin asignar", ticket.getId());
            return;
        }

        Usuario tecnicoConMenosCarga = tecnicosActivos.stream()
            .min(Comparator
                .comparingLong((Usuario tecnico) ->
                    tecnicoTicketRepositorio.countByTecnico_IdAndTicket_EstadoNot(tecnico.getId(), EstadoTicket.ENTREGADO)
                )
                .thenComparing(Usuario::getId)
            )
            .orElseThrow();

        TecnicoTicket asignacion = TecnicoTicket.builder()
            .id(new TecnicoTicketId(tecnicoConMenosCarga.getId(), ticket.getId()))
            .tecnico(tecnicoConMenosCarga)
            .ticket(ticket)
            .build();
        tecnicoTicketRepositorio.save(asignacion);
    }
}
