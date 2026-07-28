package com.yintrack.backend.servicio;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.yintrack.backend.modelo.Notificacion;
import com.yintrack.backend.modelo.Ticket;
import com.yintrack.backend.modelo.Usuario;
import com.yintrack.backend.modelo.enums.CanalNotificacion;
import com.yintrack.backend.modelo.enums.EstadoEnvio;
import com.yintrack.backend.repositorio.NotificacionRepositorio;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepositorio notificacionRepositorio;

    @Value("${app.twilio.whatsapp-from}")
    private String numeroWhatsappOrigen;

    @Transactional
    public void enviarWhatsapp(Usuario destinatario, Ticket ticket, String mensaje) {
        Notificacion notificacion = Notificacion.builder()
            .usuario(destinatario)
            .ticket(ticket)
            .canal(CanalNotificacion.WHATSAPP)
            .mensaje(mensaje)
            .build();

        try {
            Message.creator(
                new PhoneNumber("whatsapp:" + normalizarTelefono(destinatario.getTelefono())),
                new PhoneNumber("whatsapp:" + numeroWhatsappOrigen),
                mensaje
            ).create();
            notificacion.setEstadoEnvio(EstadoEnvio.ENVIADO);
            notificacion.setEnviadoEn(LocalDateTime.now());
        } catch (Exception ex) {
            notificacion.setEstadoEnvio(EstadoEnvio.FALLIDO);
        }

        notificacionRepositorio.save(notificacion);
    }

    private String normalizarTelefono(String telefono) {
        return telefono.startsWith("+") ? telefono : "+52" + telefono;
    }
}
