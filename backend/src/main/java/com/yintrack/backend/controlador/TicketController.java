package com.yintrack.backend.controlador;

import com.yintrack.backend.dto.TicketResumenDto;
import com.yintrack.backend.seguridad.UsuarioPrincipal;
import com.yintrack.backend.servicio.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/mios")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Page<TicketResumenDto>> misTickets(
        @AuthenticationPrincipal UsuarioPrincipal solicitante,
        @RequestParam(required = false) String estado,
        @PageableDefault(size = 5, sort = "creadoEn", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(
            ticketService.obtenerMisTickets(solicitante.getUsuario().getId(), estado, pageable)
        );
    }

    @GetMapping("/{folio}")
    public ResponseEntity<TicketResumenDto> obtenerPorFolio(@PathVariable String folio) {
        return ResponseEntity.ok(ticketService.obtenerPorFolio(folio));
    }
}
