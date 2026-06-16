package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Reserva;
import fatec.esiii.clienthub.model.StatusReserva;
import fatec.esiii.clienthub.service.NotificadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DispararNotificacoes implements IStrategy {

    @Autowired
    private NotificadorService notificadorService;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reserva = (Reserva) entidade;

            if (reserva.getStatus() == StatusReserva.CONFIRMADA) {
                notificadorService.enviarConfirmacaoReserva(reserva);
                notificadorService.enviarLembreteEstadia(reserva); // Simula o agendamento
            } else if (reserva.getStatus() == StatusReserva.CANCELADA) {
                // Multa já foi calculada e cobrada por outra strategy/pagamento, enviamos apenas o e-mail genérico
                notificadorService.enviarConfirmacaoCancelamento(reserva, 0.0);
            } else if (reserva.getStatus() == StatusReserva.CHECK_OUT) {
                notificadorService.enviarMensagemPosEstadia(reserva);
            }
        }
        return null;
    }
}
