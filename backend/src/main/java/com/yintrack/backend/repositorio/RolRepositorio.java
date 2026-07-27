package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.Rol;
import com.yintrack.backend.modelo.enums.NombreRol;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepositorio extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(NombreRol nombre);
}
