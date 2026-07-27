CREATE TABLE tokens_invalidados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jti VARCHAR(36) NOT NULL UNIQUE,
    usuario_id BIGINT NOT NULL,
    expira_en TIMESTAMP NOT NULL,
    invalidado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tokeninvalidado_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
