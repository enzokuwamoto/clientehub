package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.dao.ReservaRepository;
import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Pagamento;
import fatec.esiii.clienthub.model.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ValidarValorPagamentoIgualReserva implements IStrategy {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento) {
            Pagamento p = (Pagamento) entidade;
            
            if (p.getReserva() != null && p.getReserva().getId() != null && p.getValor() != null) {
                Optional<Reserva> rOpt = reservaRepository.findById(p.getReserva().getId());
                if (rOpt.isPresent()) {
                    Reserva reserva = rOpt.get();
                    if (reserva.getValorTotal() != null) {
                        // Compara se o valor enviado é exatamente igual ao valor da reserva (usando compareTo para ignorar zeros à direita em BigDecimals)
                        if (p.getValor().compareTo(reserva.getValorTotal()) != 0) {
                            return "O valor do pagamento deve ser exatamente igual ao valor total da reserva (R$ " + reserva.getValorTotal() + ").";
                        }
                    }
                }
            }
        }
        return null;
    }
}
