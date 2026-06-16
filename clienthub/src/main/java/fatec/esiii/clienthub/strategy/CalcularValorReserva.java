package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.dao.QuartoRepository;
import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Quarto;
import fatec.esiii.clienthub.model.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Component
public class CalcularValorReserva implements IStrategy {

    @Autowired
    private QuartoRepository quartoRepository;
    
    @Autowired
    private fatec.esiii.clienthub.dao.PromocaoRepository promocaoRepository;

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Reserva) {
            Reserva reserva = (Reserva) entidade;
            
            if (reserva.getQuarto() != null && reserva.getQuarto().getId() != null) {
                Optional<Quarto> qOpt = quartoRepository.findById(reserva.getQuarto().getId());
                if (qOpt.isPresent()) {
                    Quarto quarto = qOpt.get();
                    
                    long diarias = ChronoUnit.DAYS.between(reserva.getDataEntrada(), reserva.getDataSaida());
                    if (diarias < 1) diarias = 1;
                    
                    BigDecimal precoBase = quarto.getPrecoBaseDiaria();
                    BigDecimal valorBaseTotal = precoBase.multiply(new BigDecimal(diarias));
                    
                    if (reserva.getQtdeCriancasAte5A() > 0) {
                        BigDecimal descontoCrianca = new BigDecimal("50.00")
                            .multiply(new BigDecimal(reserva.getQtdeCriancasAte5A()))
                            .multiply(new BigDecimal(diarias));
                        valorBaseTotal = valorBaseTotal.subtract(descontoCrianca);
                    }
                    
                    if (valorBaseTotal.compareTo(BigDecimal.ZERO) < 0) {
                        valorBaseTotal = BigDecimal.ZERO;
                    }
                    
                    if (reserva.getCodigoPromocional() != null && !reserva.getCodigoPromocional().trim().isEmpty()) {
                        Optional<fatec.esiii.clienthub.model.Promocao> promoOpt = promocaoRepository.findByNome(reserva.getCodigoPromocional().trim());
                        if (promoOpt.isPresent()) {
                            BigDecimal percentual = promoOpt.get().getDescontoPercentual();
                            if (percentual != null && percentual.compareTo(BigDecimal.ZERO) > 0) {
                                BigDecimal multiplicador = percentual.divide(new BigDecimal("100.00"), 4, java.math.RoundingMode.HALF_UP);
                                BigDecimal desconto = valorBaseTotal.multiply(multiplicador);
                                valorBaseTotal = valorBaseTotal.subtract(desconto);
                            }
                        }
                    }
                    
                    reserva.setValorTotal(valorBaseTotal);
                }
            }
        }
        return null;
    }
}
