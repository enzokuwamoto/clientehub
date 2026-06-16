package fatec.esiii.clienthub.controller;

import fatec.esiii.clienthub.dao.ReservaRepository;
import fatec.esiii.clienthub.model.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private fatec.esiii.clienthub.dao.PromocaoRepository promocaoRepository;

    @GetMapping("/ocupacao")
    public ResponseEntity<?> relatorioOcupacao() {
        List<Reserva> reservas = reservaRepository.findAll();
        Map<String, Long> ocupacao = new HashMap<>();
        
        long total = reservas.stream()
            .filter(r -> r.getStatus().name().equals("CONFIRMADA") || r.getStatus().name().equals("CHECK_IN"))
            .count();
            
        ocupacao.put("reservasAtivas", total);
        return ResponseEntity.ok(ocupacao);
    }

    @GetMapping("/financeiro")
    public ResponseEntity<?> relatorioFinanceiro() {
        List<Reserva> reservas = reservaRepository.findAll();
        double receitaTotal = reservas.stream()
            .filter(r -> r.getValorTotal() != null)
            .mapToDouble(r -> r.getValorTotal().doubleValue())
            .sum();
            
        Map<String, Double> financeiro = new HashMap<>();
        financeiro.put("receitaBrutaTotal Estimada", receitaTotal);
        return ResponseEntity.ok(financeiro);
    }

    @GetMapping("/origem")
    public ResponseEntity<?> relatorioOrigem() {
        List<Reserva> reservas = reservaRepository.findAll();
        Map<String, Long> origens = new HashMap<>();
        
        long site = reservas.stream().filter(r -> "SITE".equalsIgnoreCase(r.getOrigem())).count();
        long balcao = reservas.stream().filter(r -> "BALCAO".equalsIgnoreCase(r.getOrigem())).count();
        long agencia = reservas.stream().filter(r -> "AGENCIA".equalsIgnoreCase(r.getOrigem())).count();
        long outros = reservas.size() - site - balcao - agencia;
        
        origens.put("Site", site);
        origens.put("Balcao", balcao);
        origens.put("Agencia", agencia);
        origens.put("Outros", outros);
        
        return ResponseEntity.ok(origens);
    }

    @GetMapping("/promocoes")
    public ResponseEntity<?> relatorioPromocoes() {
        List<fatec.esiii.clienthub.model.Promocao> promocoes = promocaoRepository.findAll();
        Map<String, Long> desempenho = new HashMap<>();
        
        // Simulação de uso das promoções
        for (fatec.esiii.clienthub.model.Promocao promo : promocoes) {
            desempenho.put(promo.getNome(), (long) (Math.random() * 50));
        }
        
        return ResponseEntity.ok(desempenho);
    }
}
