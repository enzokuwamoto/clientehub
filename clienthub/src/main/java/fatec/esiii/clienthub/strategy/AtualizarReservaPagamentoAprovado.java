package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.dao.ReservaRepository;
import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Pagamento;
import fatec.esiii.clienthub.model.Reserva;
import fatec.esiii.clienthub.model.StatusPagamento;
import fatec.esiii.clienthub.model.StatusReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AtualizarReservaPagamentoAprovado implements IStrategy {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Pagamento) {
            Pagamento pagamento = (Pagamento) entidade;
            
            if (pagamento.getStatus() == StatusPagamento.APROVADO && pagamento.getReserva() != null && pagamento.getReserva().getId() != null) {
                Optional<Reserva> rOpt = reservaRepository.findById(pagamento.getReserva().getId());
                if (rOpt.isPresent()) {
                    Reserva reserva = rOpt.get();
                    if (reserva.getStatus() == StatusReserva.PROPOSTA) {
                        reserva.setStatus(StatusReserva.CONFIRMADA);
                        reservaRepository.save(reserva);
                    }
                }
            }
        }
        return null;
    }
}
