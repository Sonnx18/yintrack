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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);

    private final NotificacionRepositorio notificacionRepositorio;
    private final JavaMailSender mailSender;

    @Value("${app.twilio.whatsapp-from}")
    private String numeroWhatsappOrigen;

    @Value("${app.mail.from}")
    private String correoOrigen;

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

    @Transactional
    public void enviarEmail(Usuario destinatario, Ticket ticket, String asunto, String mensaje) {
        Notificacion notificacion = Notificacion.builder()
            .usuario(destinatario)
            .ticket(ticket)
            .canal(CanalNotificacion.EMAIL)
            .asunto(asunto)
            .mensaje(mensaje)
            .build();

        try {
            SimpleMailMessage correo = new SimpleMailMessage();
            correo.setFrom(correoOrigen);
            correo.setTo(destinatario.getCorreo());
            correo.setSubject(asunto);
            correo.setText(mensaje);
            mailSender.send(correo);
            notificacion.setEstadoEnvio(EstadoEnvio.ENVIADO);
            notificacion.setEnviadoEn(LocalDateTime.now());
        } catch (Exception ex) {
            log.warn("No se pudo enviar el correo a {}: {}", destinatario.getCorreo(), ex.toString());
            notificacion.setEstadoEnvio(EstadoEnvio.FALLIDO);
        }

        notificacionRepositorio.save(notificacion);
    }

    private String normalizarTelefono(String telefono) {
        return telefono.startsWith("+") ? telefono : "+52" + telefono;
    }
}
