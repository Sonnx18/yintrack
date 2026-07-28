package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.Ticket;
import com.yintrack.backend.modelo.enums.EstadoTicket;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepositorio extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByEquipo_Folio(String folio);

    Page<Ticket> findByEquipo_Cliente_Id(Long clienteId, Pageable pageable);

    Page<Ticket> findByEquipo_Cliente_IdAndEstado(Long clienteId, EstadoTicket estado, Pageable pageable);
}
