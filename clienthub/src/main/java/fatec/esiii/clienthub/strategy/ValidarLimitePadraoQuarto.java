package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.dao.QuartoRepository;
import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Quarto;
import fatec.esiii.clienthub.model.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ValidarLimitePadraoQuarto implements IStrategy {

    @Autowired
    private QuartoRepository quartoRepository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reserva = (Reserva) entidade;
            
            if (reserva.getQuarto() != null && reserva.getQuarto().getId() != null) {
                Optional<Quarto> quartoOpt = quartoRepository.findById(reserva.getQuarto().getId());
                if (quartoOpt.isPresent()) {
                    Quarto quarto = quartoOpt.get();
                    
                    // RN: Limite padrão por quarto (Se for quarto Padrão, max 2 adultos e 2 crianças)
                    if (quarto.getTipo() != null && 
                       ("PADRAO".equalsIgnoreCase(quarto.getTipo().name()) || "Padrão".equalsIgnoreCase(quarto.getTipo().name()))) {
                        if (reserva.getQtdeAdultos() > 2) {
                            return "Em quartos do tipo Padrão, o limite máximo é de 2 adultos.";
                        }
                        if (reserva.getQtdeCriancas() > 2) {
                            return "Em quartos do tipo Padrão, o limite máximo é de 2 crianças.";
                        }
                    }
                }
            }
        }
        return null;
    }
}
