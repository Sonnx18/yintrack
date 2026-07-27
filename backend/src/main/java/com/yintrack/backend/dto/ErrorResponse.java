package com.yintrack.backend.dto;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
    int status,
    String message,
    Map<String, String> errores,
    Instant timestamp
) {
    public static ErrorResponse de(int status, String message) {
        return new ErrorResponse(status, message, null, Instant.now());
    }

    public static ErrorResponse deValidacion(int status, String message, Map<String, String> errores) {
        return new ErrorResponse(status, message, errores, Instant.now());
    }
}
