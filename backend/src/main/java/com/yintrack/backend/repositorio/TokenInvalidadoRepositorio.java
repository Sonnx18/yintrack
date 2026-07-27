package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.TokenInvalidado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenInvalidadoRepositorio extends JpaRepository<TokenInvalidado, Long> {
    boolean existsByJti(String jti);
}
