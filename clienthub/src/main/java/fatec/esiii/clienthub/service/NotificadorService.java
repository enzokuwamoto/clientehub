package fatec.esiii.clienthub.service;

import fatec.esiii.clienthub.model.Reserva;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class NotificadorService {

    private static final Logger logger = LoggerFactory.getLogger(NotificadorService.class);

    public void enviarConfirmacaoReserva(Reserva reserva) {
        String email = reserva.getHospede() != null ? reserva.getHospede().getEmail() : "desconhecido@exemplo.com";
        String nome = reserva.getHospede() != null ? reserva.getHospede().getNome() : "Hóspede";
        String quartoIdentidade = reserva.getQuarto() != null ? reserva.getQuarto().getNumero() : "N/A";
        logger.info("\n=========================================\n" +
                    "[MOCK DE EMAIL] - ENVIANDO CONFIRMAÇÃO\n" +
                    "Para: {}\n" +
                    "Assunto: Sua reserva no Kaizen Inn está Confirmada!\n" +
                    "Reserva ID: {}\n" +
                    "Hóspede: {}\n" +
                    "Quarto: {}\n" +
                    "Check-in: {} a partir das 14h\n" +
                    "Check-out: {} até as 12h\n" +
                    "Valor Total: R$ {}\n" +
                    "Política de Cancelamento: Cancelamento gratuito até 7 dias antes. Após, multa de 50%.\n" +
                    "Instruções: Apresente documento com foto na recepção.\n" +
                    "=========================================", 
                    email, reserva.getId(), nome, quartoIdentidade, reserva.getDataEntrada(), reserva.getDataSaida(), reserva.getValorTotal());
    }

    public void enviarConfirmacaoCancelamento(Reserva reserva, double multa) {
        String email = reserva.getHospede() != null ? reserva.getHospede().getEmail() : "desconhecido@exemplo.com";
        logger.info("\n=========================================\n" +
                    "[MOCK DE EMAIL] - ENVIANDO CANCELAMENTO\n" +
                    "Para: {}\n" +
                    "Assunto: Cancelamento de Reserva no Kaizen Inn\n" +
                    "Reserva ID: {}\n" +
                    "Política Aplicada: Cancelamento com multa conforme prazo.\n" +
                    "Valor Cobrado (Multa): R$ {}\n" +
                    "Valor Estornado: R$ {}\n" +
                    "=========================================", 
                    email, reserva.getId(), multa, reserva.getValorTotal().doubleValue() - multa);
    }

    public void enviarLembreteEstadia(Reserva reserva) {
        String email = reserva.getHospede() != null ? reserva.getHospede().getEmail() : "desconhecido@exemplo.com";
        logger.info("\n=========================================\n" +
                    "[MOCK DE EMAIL] - ENVIANDO LEMBRETE\n" +
                    "Para: {}\n" +
                    "Assunto: Falta pouco para sua estadia no Kaizen Inn!\n" +
                    "Reserva ID: {}\n" +
                    "Data e Hora de Check-in: {} às 14:00\n" +
                    "Endereço: Rua da Fatec, 123 - Centro\n" +
                    "Contatos: (11) 9999-9999 | contato@kaizeninn.com\n" +
                    "=========================================", 
                    email, reserva.getId(), reserva.getDataEntrada());
    }

    public void enviarMensagemPosEstadia(Reserva reserva) {
        String email = reserva.getHospede() != null ? reserva.getHospede().getEmail() : "desconhecido@exemplo.com";
        logger.info("\n=========================================\n" +
                    "[MOCK DE EMAIL] - ENVIANDO PÓS-ESTADIA\n" +
                    "Para: {}\n" +
                    "Assunto: Como foi sua experiência no Kaizen Inn?\n" +
                    "Reserva ID: {}\n" +
                    "Agradecemos a sua preferência!\n" +
                    "=========================================", 
                    email, reserva.getId());
    }
}
