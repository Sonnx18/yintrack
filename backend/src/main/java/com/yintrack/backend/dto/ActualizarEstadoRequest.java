package com.yintrack.backend.dto;

import com.yintrack.backend.modelo.enums.EstadoTicket;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ActualizarEstadoRequest(
    @NotNull EstadoTicket estado,

    @Size(max = 255) String comentario
) {}
