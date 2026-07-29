package com.yintrack.backend.controlador;

import com.yintrack.backend.dto.UsuarioActualizarRequest;
import com.yintrack.backend.dto.UsuarioRegistroRequest;
import com.yintrack.backend.dto.UsuarioResumenDto;
import com.yintrack.backend.modelo.enums.NombreRol;
import com.yintrack.backend.servicio.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECNICO')")
    public ResponseEntity<Page<UsuarioResumenDto>> listar(
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) NombreRol rol,
        @PageableDefault(size = 5, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(usuarioService.listar(nombre, rol, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResumenDto> crear(@Valid @RequestBody UsuarioRegistroRequest peticion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(peticion));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResumenDto> actualizar(
        @PathVariable Long id,
        @Valid @RequestBody UsuarioActualizarRequest peticion
    ) {
        return ResponseEntity.ok(usuarioService.actualizar(id, peticion));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
