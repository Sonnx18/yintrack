package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.Equipo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipoRepositorio extends JpaRepository<Equipo, Long> {
    Optional<Equipo> findByFolio(String folio);
}
