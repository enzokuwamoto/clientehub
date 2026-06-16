package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Reserva;
import fatec.esiii.clienthub.model.StatusReserva;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ValidarDataCheckIn implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reserva = (Reserva) entidade;
            
            // Só validamos a data se o status estiver mudando para CHECK_IN
            if (reserva.getStatus() == StatusReserva.CHECK_IN) {
                if (reserva.getDataEntrada() != null) {
                    LocalDate hoje = LocalDate.now();
                    if (!hoje.isEqual(reserva.getDataEntrada())) {
                        return "O Check-in só pode ser realizado exatamente no dia agendado para a entrada (" + 
                               reserva.getDataEntrada().toString() + ").";
                    }
                }
            }
        }
        return null;
    }
}
