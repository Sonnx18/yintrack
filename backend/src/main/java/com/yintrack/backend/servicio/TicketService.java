package com.yintrack.backend.servicio;

import com.yintrack.backend.dto.ActualizarEstadoRequest;
import com.yintrack.backend.dto.TicketResumenDto;
import com.yintrack.backend.excepcion.RecursoNoEncontradoException;
import com.yintrack.backend.modelo.Equipo;
import com.yintrack.backend.modelo.HistorialEstado;
import com.yintrack.backend.modelo.Ticket;
import com.yintrack.backend.modelo.Usuario;
import com.yintrack.backend.modelo.enums.EstadoTicket;
import com.yintrack.backend.repositorio.HistorialEstadoRepositorio;
import com.yintrack.backend.repositorio.TicketRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepositorio ticketRepositorio;
    private final HistorialEstadoRepositorio historialEstadoRepositorio;
    private final NotificacionService notificacionService;

    public TicketResumenDto obtenerPorFolio(String folio) {
        Ticket ticket = ticketRepositorio.findByEquipo_Folio(folio)
            .orElseThrow(() -> new RecursoNoEncontradoException("No se encontro ningun ticket con ese folio"));
        return aDto(ticket);
    }

    public Page<TicketResumenDto> obtenerMisTickets(Long clienteId, String estadoTexto, Pageable pageable) {
        Page<Ticket> pagina;

        if (estadoTexto != null && !estadoTexto.isBlank()) {
            EstadoTicket estado;
            try {
                estado = EstadoTicket.valueOf(estadoTexto.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Estado invalido: " + estadoTexto);
            }
            pagina = ticketRepositorio.findByEquipo_Cliente_IdAndEstado(clienteId, estado, pageable);
        } else {
            pagina = ticketRepositorio.findByEquipo_Cliente_Id(clienteId, pageable);
        }

        return pagina.map(this::aDto);
    }

    @Transactional
    public TicketResumenDto actualizarEstado(Long ticketId, ActualizarEstadoRequest peticion, Usuario staff) {
        Ticket ticket = ticketRepositorio.findById(ticketId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Ticket no encontrado"));

        ticket.setEstado(peticion.estado());
        ticket = ticketRepositorio.save(ticket);

        HistorialEstado historial = HistorialEstado.builder()
            .ticket(ticket)
            .estado(peticion.estado())
            .comentario(peticion.comentario())
            .registradoPor(staff)
            .build();
        historialEstadoRepositorio.save(historial);

        Equipo equipo = ticket.getEquipo();
        Usuario cliente = equipo.getCliente();
        String mensaje = "Tu equipo con folio " + equipo.getFolio() + " ahora esta en estado "
            + peticion.estado().name() + ".";
        notificacionService.enviarWhatsapp(cliente, ticket, mensaje);

        return aDto(ticket);
    }

    private TicketResumenDto aDto(Ticket ticket) {
        Equipo equipo = ticket.getEquipo();
        return new TicketResumenDto(
            equipo.getFolio(),
            ticket.getEstado().name(),
            equipo.getTipo(),
            equipo.getMarca(),
            equipo.getModelo(),
            ticket.getDescripcionProblema()
        );
    }
}
