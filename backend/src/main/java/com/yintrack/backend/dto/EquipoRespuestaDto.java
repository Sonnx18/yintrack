package com.yintrack.backend.dto;

public record EquipoRespuestaDto(
    String folio,
    String tipo,
    String marca,
    String modelo,
    String numeroSerie,
    String descripcion,
    String estado
) {}
