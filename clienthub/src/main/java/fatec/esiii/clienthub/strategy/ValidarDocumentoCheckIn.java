package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.dao.ReservaRepository;
import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Reserva;
import fatec.esiii.clienthub.model.StatusReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ValidarDocumentoCheckIn implements IStrategy {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reservaNova = (Reserva) entidade;
            
            // Verifica se a reserva já existe para saber se o status está mudando para CHECK_IN
            if (reservaNova.getId() != null) {
                Optional<Reserva> resOpt = reservaRepository.findById(reservaNova.getId());
                if (resOpt.isPresent()) {
                    Reserva reservaAntiga = resOpt.get();
                    
                    if (reservaAntiga.getStatus() != StatusReserva.CHECK_IN && reservaNova.getStatus() == StatusReserva.CHECK_IN) {
                        // Está mudando para check-in. Validar se o hóspede tem documento (CPF)
                        if (reservaNova.getHospede() == null || reservaNova.getHospede().getCpf() == null || reservaNova.getHospede().getCpf().trim().isEmpty()) {
                            return "Documento de identificação (CPF) é obrigatório para realizar o Check-in.";
                        }
                    }
                }
            }
        }
        return null;
    }
}
