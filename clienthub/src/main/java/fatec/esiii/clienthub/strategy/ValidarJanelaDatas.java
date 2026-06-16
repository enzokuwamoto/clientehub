package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Reserva;

public class ValidarJanelaDatas implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reserva = (Reserva) entidade;
            
            if (reserva.getDataEntrada() != null && reserva.getDataSaida() != null) {
                if (reserva.getDataEntrada().isBefore(java.time.LocalDate.now())) {
                    return "A data de check-in não pode ser no passado.";
                }
                if (!reserva.getDataSaida().isAfter(reserva.getDataEntrada())) {
                    return "RN0212: A data de saída deve ser posterior à data de entrada.";
                }
            }
        }
        return null;
    }
}
