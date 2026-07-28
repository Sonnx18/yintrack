package com.yintrack.backend.seguridad;

import com.yintrack.backend.repositorio.TokenInvalidadoRepositorio;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UsuarioDetallesService usuarioDetallesService;
    private final TokenInvalidadoRepositorio tokenInvalidadoRepositorio;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String encabezado = request.getHeader("Authorization");
        log.info("JWT filter -> {} {} | header presente: {}", request.getMethod(), request.getRequestURI(), encabezado != null);

        if (encabezado == null || !encabezado.startsWith("Bearer ")) {
            log.info("JWT filter -> sin header Authorization con formato Bearer, se deja pasar sin autenticar");
            filterChain.doFilter(request, response);
            return;
        }

        String token = encabezado.substring(7);
        boolean valido = jwtService.esValido(token);
        log.info("JWT filter -> token valido: {}", valido);

        if (!valido || tokenInvalidadoRepositorio.existsByJti(jwtService.extraerJti(token))) {
            log.info("JWT filter -> token invalido o revocado, se deja pasar sin autenticar");
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String correo = jwtService.extraerCorreo(token);
            log.info("JWT filter -> autenticando correo: {}", correo);
            UserDetails detalles = usuarioDetallesService.loadUserByUsername(correo);
            UsernamePasswordAuthenticationToken autenticacion =
                new UsernamePasswordAuthenticationToken(detalles, null, detalles.getAuthorities());
            autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(autenticacion);
            log.info("JWT filter -> autenticacion establecida con autoridades: {}", detalles.getAuthorities());
        }

        filterChain.doFilter(request, response);
    }
}
