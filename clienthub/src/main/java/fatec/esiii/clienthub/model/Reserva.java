package fatec.esiii.clienthub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reservas")
public class Reserva extends EntidadeDominio {

    @ManyToOne
    @JoinColumn(name = "hospede_id")
    private Hospede hospede;

    @ManyToOne
    @JoinColumn(name = "quarto_id")
    private Quarto quarto;

    private LocalDate dataEntrada;
    private LocalDate dataSaida;
    
    private java.time.LocalDateTime dataCheckinReal;
    private java.time.LocalDateTime dataCheckoutReal;
    
    private int qtdeAdultos;
    private int qtdeCriancas;
    private int qtdeCriancasAte5A;
    
    private String codigoPromocional;
    
    @Enumerated(EnumType.STRING)
    private StatusReserva status;
    
    private String origem; // Ex: "SITE", "BALCAO", "AGENCIA"
    
    private BigDecimal valorTotal;

    public Hospede getHospede() { return hospede; }
    public void setHospede(Hospede hospede) { this.hospede = hospede; }

    public Quarto getQuarto() { return quarto; }
    public void setQuarto(Quarto quarto) { this.quarto = quarto; }

    public LocalDate getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDate dataEntrada) { this.dataEntrada = dataEntrada; }

    public LocalDate getDataSaida() { return dataSaida; }
    public void setDataSaida(LocalDate dataSaida) { this.dataSaida = dataSaida; }

    public java.time.LocalDateTime getDataCheckinReal() { return dataCheckinReal; }
    public void setDataCheckinReal(java.time.LocalDateTime dataCheckinReal) { this.dataCheckinReal = dataCheckinReal; }

    public java.time.LocalDateTime getDataCheckoutReal() { return dataCheckoutReal; }
    public void setDataCheckoutReal(java.time.LocalDateTime dataCheckoutReal) { this.dataCheckoutReal = dataCheckoutReal; }

    public int getQtdeAdultos() { return qtdeAdultos; }
    public void setQtdeAdultos(int qtdeAdultos) { this.qtdeAdultos = qtdeAdultos; }

    public int getQtdeCriancas() { return qtdeCriancas; }
    public void setQtdeCriancas(int qtdeCriancas) { this.qtdeCriancas = qtdeCriancas; }

    public int getQtdeCriancasAte5A() { return qtdeCriancasAte5A; }
    public void setQtdeCriancasAte5A(int qtdeCriancasAte5A) { this.qtdeCriancasAte5A = qtdeCriancasAte5A; }

    public String getCodigoPromocional() { return codigoPromocional; }
    public void setCodigoPromocional(String codigoPromocional) { this.codigoPromocional = codigoPromocional; }

    public StatusReserva getStatus() { return status; }
    public void setStatus(StatusReserva status) { this.status = status; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
}
