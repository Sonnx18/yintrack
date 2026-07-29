package com.yintrack.backend.dto;

import com.yintrack.backend.modelo.enums.NombreRol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioActualizarRequest(
    @NotBlank @Size(max = 150) String nombre,

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$", message = "El telefono debe tener 10 digitos")
    String telefono,

    @NotNull NombreRol rol,

    boolean activo,

    @Pattern(
        regexp = "^$|^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$",
        message = "La contrasena debe tener minimo 8 caracteres, una mayuscula, un numero y un caracter especial"
    )
    String contrasena
) {}
