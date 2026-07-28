package com.yintrack.backend.dto;

public record TicketResumenDto(
    String folio,
    String estado,
    String tipo,
    String marca,
    String modelo,
    String descripcionProblema
) {}
