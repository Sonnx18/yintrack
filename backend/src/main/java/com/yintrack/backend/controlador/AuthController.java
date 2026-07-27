package com.yintrack.backend.controlador;

import com.yintrack.backend.dto.LoginRequest;
import com.yintrack.backend.dto.LoginResponse;
import com.yintrack.backend.dto.RegistroRequest;
import com.yintrack.backend.servicio.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest peticion) {
        return ResponseEntity.ok(authService.login(peticion));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registrar(@Valid @RequestBody RegistroRequest peticion) {
        authService.registrar(peticion);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String encabezadoAutorizacion) {
        authService.logout(encabezadoAutorizacion.replace("Bearer ", ""));
        return ResponseEntity.noContent().build();
    }
}
