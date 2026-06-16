import React, { useState, useEffect } from 'react';

const API_PAGAMENTOS = 'http://localhost:8080/api/pagamentos';
const API_RESERVAS = 'http://localhost:8080/api/reservas';

export default function PagamentoCrud() {
  const [pagamentos, setPagamentos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    reservaId: '',
    valor: '',
    formaPagamento: 'CARTAO_CREDITO',
    status: 'APROVADO'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPag, resRes] = await Promise.all([
        fetch(API_PAGAMENTOS),
        fetch(API_RESERVAS)
      ]);
      
      if (!resPag.ok) throw new Error(`Erro HTTP pagamentos: ${resPag.status}`);
      if (!resRes.ok) throw new Error(`Erro HTTP reservas: ${resRes.status}`);
      
      const dataPag = await resPag.json();
      const dataRes = await resRes.json();
      
      setPagamentos(Array.isArray(dataPag) ? dataPag : []);
      setReservas(Array.isArray(dataRes) ? dataRes : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados de pagamentos.');
      setPagamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'reservaId') {
      const selectedReserva = reservas.find(r => r.id === parseInt(value));
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        valor: selectedReserva && selectedReserva.valorTotal ? selectedReserva.valorTotal : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      reserva: { id: parseInt(formData.reservaId) },
      valor: parseFloat(formData.valor),
      formaPagamento: formData.formaPagamento,
      status: formData.status,
      dataOperacao: new Date().toISOString()
    };

    try {
      const res = await fetch(API_PAGAMENTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || 'Erro ao registrar pagamento');
      }

      setFormData({ reservaId: '', valor: '', formaPagamento: 'CARTAO_CREDITO', status: 'APROVADO' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEstorno = async (pagamento) => {
    if (!window.confirm('Deseja realmente estornar este pagamento?')) return;
    try {
      const res = await fetch(`${API_PAGAMENTOS}/${pagamento.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao estornar');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '15px',
    backgroundColor: '#FAFAFA',
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
      {/* Formulário */}
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary-color)' }}>Registrar Pagamento Manual</h3>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Reserva</label>
            <select
              style={inputStyle}
              name="reservaId"
              value={formData.reservaId}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione uma reserva...</option>
              {reservas.filter(r => r.status !== 'CANCELADA').map(r => (
                <option key={r.id} value={r.id}>
                  Reserva #{r.id} - {r.hospede?.nome} (R$ {r.valorTotal})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              <span>Valor Pago</span>
              {formData.reservaId && (
                <span style={{ color: 'var(--primary-color)' }}>
                  (Total da Reserva: R$ {reservas.find(r => r.id === parseInt(formData.reservaId))?.valorTotal})
                </span>
              )}
            </label>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              placeholder="Ex: 500.00"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Forma de Pagamento</label>
              <select style={inputStyle} name="formaPagamento" value={formData.formaPagamento} onChange={handleInputChange}>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="PIX">PIX</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} name="status" value={formData.status} onChange={handleInputChange}>
                <option value="APROVADO">Aprovado</option>
                <option value="PENDENTE">Pendente</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: 'var(--primary-color)', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}
          >
            Registrar Pagamento
          </button>
        </form>
      </div>

      {/* Tabela de Listagem */}
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary-color)' }}>Histórico de Pagamentos</h3>
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dados...</p>
        ) : pagamentos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}>Nenhum pagamento registrado ainda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Reserva</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Valor</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Forma</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>#{p.id}</td>
                    <td style={{ padding: '16px' }}>#{p.reserva?.id} - {p.reserva?.hospede?.nome}</td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>R$ {p.valor}</td>
                    <td style={{ padding: '16px' }}>{p.formaPagamento}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: p.status === 'APROVADO' ? '#D1FAE5' : p.status === 'ESTORNADO' ? '#FEE2E2' : '#FEF3C7',
                        color: p.status === 'APROVADO' ? '#065F46' : p.status === 'ESTORNADO' ? '#991B1B' : '#92400E'
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {p.status !== 'ESTORNADO' && (
                        <button 
                          onClick={() => handleEstorno(p)}
                          style={{ padding: '6px 12px', backgroundColor: '#FEE2E2', border: 'none', color: '#B91C1C', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Estornar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
