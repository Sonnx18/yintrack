package com.yintrack.backend.repositorio;

import com.yintrack.backend.modelo.TecnicoTicket;
import com.yintrack.backend.modelo.TecnicoTicketId;
import com.yintrack.backend.modelo.enums.EstadoTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TecnicoTicketRepositorio extends JpaRepository<TecnicoTicket, TecnicoTicketId> {

    long countByTecnico_IdAndTicket_EstadoNot(Long tecnicoId, EstadoTicket estado);

    Page<TecnicoTicket> findByTecnico_Id(Long tecnicoId, Pageable pageable);
}
