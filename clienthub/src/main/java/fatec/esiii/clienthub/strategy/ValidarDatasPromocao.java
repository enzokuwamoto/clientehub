package fatec.esiii.clienthub.strategy;

import fatec.esiii.clienthub.model.EntidadeDominio;
import fatec.esiii.clienthub.model.Promocao;

public class ValidarDatasPromocao implements IStrategy {

    @Override
    public String processar(EntidadeDominio entidade) {
        if (entidade instanceof Promocao) {
            Promocao promocao = (Promocao) entidade;
            
            if (promocao.getDataInicio() != null && promocao.getDataFim() != null) {
                if (promocao.getDataInicio().isBefore(java.time.LocalDate.now())) {
                    return "A data de início da promoção não pode ser no passado.";
                }
                if (!promocao.getDataFim().isAfter(promocao.getDataInicio())) {
                    return "A data de fim da promoção deve ser estritamente posterior à data de início.";
                }
            } else {
                return "As datas de início e fim da promoção são obrigatórias.";
            }
        }
        return null;
    }
}
