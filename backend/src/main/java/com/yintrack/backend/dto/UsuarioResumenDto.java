package com.yintrack.backend.dto;

public record UsuarioResumenDto(
    Long id,
    String nombre,
    String correo,
    String telefono,
    String rol,
    boolean activo
) {}
