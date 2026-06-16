package fatec.esiii.clienthub.dao;

import fatec.esiii.clienthub.model.Promocao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromocaoRepository extends JpaRepository<Promocao, Long> {
    java.util.Optional<Promocao> findByNome(String nome);
}
