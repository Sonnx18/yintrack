package com.yintrack.backend.controlador;

import com.yintrack.backend.dto.EquipoRegistroRequest;
import com.yintrack.backend.dto.EquipoRespuestaDto;
import com.yintrack.backend.seguridad.UsuarioPrincipal;
import com.yintrack.backend.servicio.EquipoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/equipos")
@RequiredArgsConstructor
public class EquipoController {

    private final EquipoService equipoService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO','CLIENTE')")
    public ResponseEntity<EquipoRespuestaDto> registrar(
        @Valid @RequestBody EquipoRegistroRequest peticion,
        @AuthenticationPrincipal UsuarioPrincipal solicitante
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipoService.registrar(peticion, solicitante));
    }
}
