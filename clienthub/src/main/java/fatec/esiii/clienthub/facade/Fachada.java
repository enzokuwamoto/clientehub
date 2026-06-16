package fatec.esiii.clienthub.facade;

import fatec.esiii.clienthub.dao.*;
import fatec.esiii.clienthub.model.*;
import fatec.esiii.clienthub.strategy.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class Fachada implements IFachada {

    @Autowired private HospedeRepository hospedeRepository;
    @Autowired private QuartoRepository quartoRepository;
    @Autowired private PromocaoRepository promocaoRepository;
    @Autowired private PoliticaCancelamentoRepository politicaCancelamentoRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private PagamentoRepository pagamentoRepository;

    @Autowired private ValidarCPF validarCPF;
    @Autowired private ValidarCapacidadeQuarto validarCapacidadeQuarto;
    @Autowired private CalcularValorReserva calcularValorReserva;
    @Autowired private ValidarConfirmacaoCondicionadaPgto validarConfirmacaoCondicionadaPgto;
    @Autowired private CalcularMultaCancelamento calcularMultaCancelamento;
    @Autowired private DispararNotificacoes dispararNotificacoes;
    @Autowired private ValidarLimitePadraoQuarto validarLimitePadraoQuarto;
    @Autowired private ValidarRegrasDiaria validarRegrasDiaria;
    @Autowired private ValidarDocumentoCheckIn validarDocumentoCheckIn;
    @Autowired private AtualizarReservaPagamentoAprovado atualizarReservaPagamentoAprovado;
    @Autowired private ValidarValorPagamentoIgualReserva validarValorPagamentoIgualReserva;
    @Autowired private ValidarDataCheckIn validarDataCheckIn;

    private Map<String, Map<String, List<IStrategy>>> rns;

    @PostConstruct
    public void init() {
        rns = new HashMap<>();

        GerarLog gerarLog = new GerarLog();

        ValidarDadosHospede validarDadosHospede = new ValidarDadosHospede();
        ValidarEmail validarEmail = new ValidarEmail();

        List<IStrategy> rnsSalvarHospede = List.of(validarDadosHospede, validarCPF, validarEmail, gerarLog);
        List<IStrategy> rnsAlterarHospede = List.of(validarDadosHospede, validarCPF, validarEmail, gerarLog);

        rns.put(Hospede.class.getName(), Map.of(
            "SALVAR", rnsSalvarHospede,
            "ALTERAR", rnsAlterarHospede,
            "EXCLUIR", List.of(gerarLog),
            "CONSULTAR", List.of(gerarLog)
        ));

        ValidarDadosQuarto validarDadosQuarto = new ValidarDadosQuarto();
        rns.put(Quarto.class.getName(), Map.of(
            "SALVAR", List.of(validarDadosQuarto, gerarLog),
            "ALTERAR", List.of(validarDadosQuarto, gerarLog),
            "EXCLUIR", List.of(gerarLog),
            "CONSULTAR", List.of(gerarLog)
        ));

        ValidarDatasPromocao validarDatasPromocao = new ValidarDatasPromocao();
        
        rns.put(Promocao.class.getName(), Map.of(
            "SALVAR", List.of(validarDatasPromocao, gerarLog),
            "ALTERAR", List.of(validarDatasPromocao, gerarLog),
            "EXCLUIR", List.of(gerarLog),
            "CONSULTAR", List.of(gerarLog)
        ));

        rns.put(PoliticaCancelamento.class.getName(), Map.of(
            "SALVAR", List.of(gerarLog),
            "ALTERAR", List.of(gerarLog),
            "EXCLUIR", List.of(gerarLog),
            "CONSULTAR", List.of(gerarLog)
        ));

        ValidarDadosReserva validarDadosReserva = new ValidarDadosReserva();
        ValidarJanelaDatas validarJanelaDatas = new ValidarJanelaDatas();
        ValidarMinimoDiariasFeriado validarMinimoDiarias = new ValidarMinimoDiariasFeriado();

        List<IStrategy> rnsSalvarReserva = List.of(
            validarDadosReserva, validarJanelaDatas, validarCapacidadeQuarto, 
            validarLimitePadraoQuarto, validarRegrasDiaria,
            validarMinimoDiarias, calcularValorReserva, validarConfirmacaoCondicionadaPgto, dispararNotificacoes, gerarLog
        );
        List<IStrategy> rnsAlterarReserva = List.of(
            validarDadosReserva, validarJanelaDatas, validarCapacidadeQuarto, 
            validarLimitePadraoQuarto, validarRegrasDiaria,
            validarMinimoDiarias, calcularValorReserva, validarConfirmacaoCondicionadaPgto, validarDataCheckIn, validarDocumentoCheckIn, dispararNotificacoes, gerarLog
        );

        rns.put(Reserva.class.getName(), Map.of(
            "SALVAR", rnsSalvarReserva,
            "ALTERAR", rnsAlterarReserva,
            "EXCLUIR", List.of(calcularMultaCancelamento, dispararNotificacoes, gerarLog), // Exclusão = cancelamento neste escopo
            "CONSULTAR", List.of(gerarLog)
        ));

        ValidarDadosPagamento validarDadosPagamento = new ValidarDadosPagamento();
        CalcularEstorno calcularEstorno = new CalcularEstorno();

        rns.put(Pagamento.class.getName(), Map.of(
            "SALVAR", List.of(validarDadosPagamento, validarValorPagamentoIgualReserva, atualizarReservaPagamentoAprovado, gerarLog),
            "ALTERAR", List.of(validarDadosPagamento, validarValorPagamentoIgualReserva, atualizarReservaPagamentoAprovado, gerarLog),
            "EXCLUIR", List.of(calcularEstorno, gerarLog), // Excluir pagamento = estorno
            "CONSULTAR", List.of(gerarLog)
        ));
    }

    private String executarRegras(EntidadeDominio entidade, String operacao) {
        String nmClasse = entidade.getClass().getName();
        StringBuilder msg = new StringBuilder();

        Map<String, List<IStrategy>> regrasOperacao = rns.get(nmClasse);
        if (regrasOperacao != null) {
            List<IStrategy> regras = regrasOperacao.get(operacao);
            if (regras != null) {
                for (IStrategy s : regras) {
                    String m = s.processar(entidade);
                    if (m != null) {
                        msg.append(m).append("\n");
                    }
                }
            }
        }

        return msg.length() > 0 ? msg.toString() : null;
    }

    @Override
    public String salvar(EntidadeDominio entidade) {
        String msg = executarRegras(entidade, "SALVAR");
        if (msg == null) {
            if (entidade instanceof Hospede) hospedeRepository.save((Hospede) entidade);
            else if (entidade instanceof Quarto) quartoRepository.save((Quarto) entidade);
            else if (entidade instanceof Promocao) promocaoRepository.save((Promocao) entidade);
            else if (entidade instanceof PoliticaCancelamento) politicaCancelamentoRepository.save((PoliticaCancelamento) entidade);
            else if (entidade instanceof Reserva) reservaRepository.save((Reserva) entidade);
            else if (entidade instanceof Pagamento) pagamentoRepository.save((Pagamento) entidade);
        }
        return msg;
    }

    @Override
    public String alterar(EntidadeDominio entidade) {
        String msg = executarRegras(entidade, "ALTERAR");
        if (msg == null) {
            if (entidade instanceof Hospede) hospedeRepository.save((Hospede) entidade);
            else if (entidade instanceof Quarto) quartoRepository.save((Quarto) entidade);
            else if (entidade instanceof Promocao) promocaoRepository.save((Promocao) entidade);
            else if (entidade instanceof PoliticaCancelamento) politicaCancelamentoRepository.save((PoliticaCancelamento) entidade);
            else if (entidade instanceof Reserva) reservaRepository.save((Reserva) entidade);
            else if (entidade instanceof Pagamento) pagamentoRepository.save((Pagamento) entidade);
        }
        return msg;
    }

    @Override
    public String excluir(EntidadeDominio entidade) {
        String msg = executarRegras(entidade, "EXCLUIR");
        if (msg == null) {
            // Logica simplificada de soft delete ou inativacao para todos os dominios principais
            if (entidade instanceof Hospede) {
                Hospede h = (Hospede) entidade;
                hospedeRepository.findById(h.getId()).ifPresent(fromDb -> {
                    fromDb.setAtivo(false);
                    hospedeRepository.save(fromDb);
                });
            } else if (entidade instanceof Quarto) {
                Quarto q = (Quarto) entidade;
                quartoRepository.findById(q.getId()).ifPresent(fromDb -> {
                    fromDb.setStatus(StatusQuarto.MANUTENCAO); // inativar quarto
                    quartoRepository.save(fromDb);
                });
            } else if (entidade instanceof Promocao) {
                promocaoRepository.deleteById(entidade.getId());
            } else if (entidade instanceof PoliticaCancelamento) {
                politicaCancelamentoRepository.deleteById(entidade.getId());
            } else if (entidade instanceof Reserva) {
                Reserva r = (Reserva) entidade;
                reservaRepository.findById(r.getId()).ifPresent(fromDb -> {
                    fromDb.setStatus(StatusReserva.CANCELADA);
                    reservaRepository.save(fromDb);
                });
            } else if (entidade instanceof Pagamento) {
                Pagamento p = (Pagamento) entidade;
                pagamentoRepository.findById(p.getId()).ifPresent(fromDb -> {
                    fromDb.setStatus(StatusPagamento.ESTORNADO);
                    pagamentoRepository.save(fromDb);
                });
            }
        }
        return msg;
    }

    @Override
    public List<EntidadeDominio> consultar(EntidadeDominio entidade) {
        String msg = executarRegras(entidade, "CONSULTAR");
        if (msg == null) {
            if (entidade instanceof Hospede) {
                Hospede h = (Hospede) entidade;
                if (h.getId() != null) return hospedeRepository.findById(h.getId()).map(List::<EntidadeDominio>of).orElseGet(ArrayList::new);
                else if (h.getCpf() != null && !h.getCpf().isEmpty()) return hospedeRepository.findByCpf(h.getCpf().replaceAll("[^0-9]", "")).map(List::<EntidadeDominio>of).orElseGet(ArrayList::new);
                else if (h.getNome() != null && !h.getNome().isEmpty()) return new ArrayList<>(hospedeRepository.findByNomeContainingIgnoreCase(h.getNome()));
                else return new ArrayList<>(hospedeRepository.findAll());
            }
            else if (entidade instanceof Quarto) return new ArrayList<>(quartoRepository.findAll());
            else if (entidade instanceof Promocao) return new ArrayList<>(promocaoRepository.findAll());
            else if (entidade instanceof PoliticaCancelamento) return new ArrayList<>(politicaCancelamentoRepository.findAll());
            else if (entidade instanceof Reserva) return new ArrayList<>(reservaRepository.findAll());
            else if (entidade instanceof Pagamento) return new ArrayList<>(pagamentoRepository.findAll());
        }
        return new ArrayList<>();
    }
}
