package com.yintrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EquipoRegistroRequest(
    Long clienteId,

    @NotBlank @Size(max = 100) String tipo,

    @Size(max = 100) String marca,

    @Size(max = 100) String modelo,

    @Size(max = 100) String numeroSerie,

    @Size(max = 1000) String descripcion,

    @NotBlank @Size(max = 1000) String descripcionProblema
) {}
