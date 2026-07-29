package com.yintrack.backend.dto;

import java.time.LocalDateTime;

public record TicketResumenDto(
    Long id,
    String folio,
    String estado,
    String tipo,
    String marca,
    String modelo,
    String descripcionProblema,
    String cliente,
    LocalDateTime creadoEn
) {}
