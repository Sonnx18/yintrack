package com.yintrack.backend.modelo;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TecnicoTicketId implements Serializable {

    private Long tecnicoId;
    private Long ticketId;

    @Override
    public boolean equals(Object otro) {
        if (this == otro) return true;
        if (!(otro instanceof TecnicoTicketId that)) return false;
        return Objects.equals(tecnicoId, that.tecnicoId) && Objects.equals(ticketId, that.ticketId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tecnicoId, ticketId);
    }
}
