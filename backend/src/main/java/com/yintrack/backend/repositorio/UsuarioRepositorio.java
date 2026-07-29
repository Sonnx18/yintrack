package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.Usuario;
import com.yintrack.backend.modelo.enums.NombreRol;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u JOIN FETCH u.rol WHERE u.correo = :correo")
    Optional<Usuario> findByCorreo(@Param("correo") String correo);

    boolean existsByCorreo(String correo);

    List<Usuario> findByRol_NombreAndActivoTrue(NombreRol nombreRol);

    @Query("SELECT u FROM Usuario u JOIN FETCH u.rol WHERE "
        + "(:nombre IS NULL OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND "
        + "(:rol IS NULL OR u.rol.nombre = :rol)")
    Page<Usuario> buscar(@Param("nombre") String nombre, @Param("rol") NombreRol rol, Pageable pageable);
}
