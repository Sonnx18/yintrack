package com.yintrack.backend.servicio;

import com.yintrack.backend.dto.UsuarioActualizarRequest;
import com.yintrack.backend.dto.UsuarioRegistroRequest;
import com.yintrack.backend.dto.UsuarioResumenDto;
import com.yintrack.backend.excepcion.CorreoYaRegistradoException;
import com.yintrack.backend.excepcion.RecursoNoEncontradoException;
import com.yintrack.backend.modelo.Rol;
import com.yintrack.backend.modelo.Usuario;
import com.yintrack.backend.modelo.enums.NombreRol;
import com.yintrack.backend.repositorio.RolRepositorio;
import com.yintrack.backend.repositorio.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepositorio usuarioRepositorio;
    private final RolRepositorio rolRepositorio;
    private final PasswordEncoder passwordEncoder;

    public Page<UsuarioResumenDto> listar(String nombre, NombreRol rol, Pageable pageable) {
        String nombreFiltro = (nombre == null || nombre.isBlank()) ? null : nombre.trim();
        return usuarioRepositorio.buscar(nombreFiltro, rol, pageable).map(this::aDto);
    }

    @Transactional
    public UsuarioResumenDto crear(UsuarioRegistroRequest peticion) {
        if (usuarioRepositorio.existsByCorreo(peticion.correo())) {
            throw new CorreoYaRegistradoException("Ya existe una cuenta con ese correo");
        }

        Rol rol = rolRepositorio.findByNombre(peticion.rol())
            .orElseThrow(() -> new RecursoNoEncontradoException("Rol no configurado"));

        Usuario usuario = Usuario.builder()
            .nombre(peticion.nombre())
            .correo(peticion.correo())
            .contrasenaHash(passwordEncoder.encode(peticion.contrasena()))
            .telefono(peticion.telefono())
            .rol(rol)
            .activo(true)
            .build();

        return aDto(usuarioRepositorio.save(usuario));
    }

    @Transactional
    public UsuarioResumenDto actualizar(Long id, UsuarioActualizarRequest peticion) {
        Usuario usuario = usuarioRepositorio.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        Rol rol = rolRepositorio.findByNombre(peticion.rol())
            .orElseThrow(() -> new RecursoNoEncontradoException("Rol no configurado"));

        usuario.setNombre(peticion.nombre());
        usuario.setTelefono(peticion.telefono());
        usuario.setRol(rol);
        usuario.setActivo(peticion.activo());

        if (peticion.contrasena() != null && !peticion.contrasena().isBlank()) {
            usuario.setContrasenaHash(passwordEncoder.encode(peticion.contrasena()));
        }

        return aDto(usuarioRepositorio.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepositorio.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        usuarioRepositorio.delete(usuario);
    }

    private UsuarioResumenDto aDto(Usuario usuario) {
        return new UsuarioResumenDto(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getCorreo(),
            usuario.getTelefono(),
            usuario.getRol().getNombre().name(),
            usuario.isActivo()
        );
    }
}
