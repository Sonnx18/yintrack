package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacionRepositorio extends JpaRepository<Notificacion, Long> {
}
