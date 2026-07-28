package com.yintrack.backend.seguridad;

import com.yintrack.backend.modelo.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey clavePrivada;
    private final long expiracionMs;

    public JwtService(
        @Value("${app.jwt.secret}") String secreto,
        @Value("${app.jwt.expiration-ms}") long expiracionMs
    ) {
        this.clavePrivada = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.expiracionMs = expiracionMs;
    }

    public String generarToken(Usuario usuario) {
        Instant ahora = Instant.now();
        return Jwts.builder()
            .subject(usuario.getCorreo())
            .claim("rol", usuario.getRol().getNombre().name())
            .claim("nombre", usuario.getNombre())
            .id(UUID.randomUUID().toString())
            .issuedAt(Date.from(ahora))
            .expiration(Date.from(ahora.plusMillis(expiracionMs)))
            .signWith(clavePrivada)
            .compact();
    }

    public Claims extraerClaims(String token) {
        return Jwts.parser()
            .verifyWith(clavePrivada)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    public String extraerJti(String token) {
        return extraerClaims(token).getId();
    }

    public Date extraerExpiracion(String token) {
        return extraerClaims(token).getExpiration();
    }

    public boolean esValido(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token JWT invalido: {}", e.toString());
            return false;
        }
    }
}
