package com.yintrack.backend.excepcion;

public class CorreoYaRegistradoException extends RuntimeException {
    public CorreoYaRegistradoException(String mensaje) {
        super(mensaje);
    }
}
