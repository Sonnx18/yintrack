package com.yintrack.backend.servicio;

import com.yintrack.backend.dto.LoginRequest;
import com.yintrack.backend.dto.LoginResponse;
import com.yintrack.backend.dto.RegistroRequest;
import com.yintrack.backend.excepcion.CorreoYaRegistradoException;
import com.yintrack.backend.excepcion.RecursoNoEncontradoException;
import com.yintrack.backend.modelo.Rol;
import com.yintrack.backend.modelo.TokenInvalidado;
import com.yintrack.backend.modelo.Usuario;
import com.yintrack.backend.modelo.enums.NombreRol;
import com.yintrack.backend.repositorio.RolRepositorio;
import com.yintrack.backend.repositorio.TokenInvalidadoRepositorio;
import com.yintrack.backend.repositorio.UsuarioRepositorio;
import com.yintrack.backend.seguridad.JwtService;
import java.time.LocalDateTime;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepositorio usuarioRepositorio;
    private final RolRepositorio rolRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenInvalidadoRepositorio tokenInvalidadoRepositorio;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest peticion) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(peticion.correo(), peticion.contrasena())
        );
        Usuario usuario = usuarioRepositorio.findByCorreo(peticion.correo())
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        return new LoginResponse(jwtService.generarToken(usuario));
    }

    @Transactional
    public void registrar(RegistroRequest peticion) {
        if (usuarioRepositorio.existsByCorreo(peticion.correo())) {
            throw new CorreoYaRegistradoException("Ya existe una cuenta con ese correo");
        }

        Rol rolCliente = rolRepositorio.findByNombre(NombreRol.CLIENTE)
            .orElseThrow(() -> new RecursoNoEncontradoException("Rol CLIENTE no configurado"));

        String nombre = (peticion.nombre() == null || peticion.nombre().isBlank())
            ? peticion.correo().substring(0, peticion.correo().indexOf('@'))
            : peticion.nombre();

        Usuario usuario = Usuario.builder()
            .nombre(nombre)
            .correo(peticion.correo())
            .contrasenaHash(passwordEncoder.encode(peticion.contrasena()))
            .telefono(peticion.telefono())
            .rol(rolCliente)
            .activo(true)
            .build();

        usuarioRepositorio.save(usuario);
    }

    @Transactional
    public void logout(String token) {
        String correo = jwtService.extraerCorreo(token);
        Usuario usuario = usuarioRepositorio.findByCorreo(correo)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        TokenInvalidado tokenInvalidado = TokenInvalidado.builder()
            .jti(jwtService.extraerJti(token))
            .usuario(usuario)
            .expiraEn(LocalDateTime.ofInstant(jwtService.extraerExpiracion(token).toInstant(), ZoneId.systemDefault()))
            .build();

        tokenInvalidadoRepositorio.save(tokenInvalidado);
    }
}
