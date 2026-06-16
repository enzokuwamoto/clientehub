package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Reserva;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class ValidarRegrasDiaria implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reserva = (Reserva) entidade;
            
            if (reserva.getDataEntrada() != null && reserva.getDataSaida() != null) {
                long diarias = ChronoUnit.DAYS.between(reserva.getDataEntrada(), reserva.getDataSaida());
                
                // RN: Limite padrão de 30 dias de estadia
                if (diarias > 30) {
                    return "O limite máximo por reserva é de 30 diárias. Por favor, divida sua estadia em múltiplas reservas.";
                }
            }
        }
        return null;
    }
}
