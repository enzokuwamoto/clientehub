import React, { useState, useEffect } from 'react';

const API_RESERVAS = 'http://localhost:8080/api/reservas';
const API_HOSPEDES = 'http://localhost:8080/api/hospedes';
const API_QUARTOS = 'http://localhost:8080/api/quartos';

export default function ReservaCrud() {
  const [reservas, setReservas] = useState([]);
  const [hospedes, setHospedes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    hospedeId: '',
    quartoId: '',
    dataCheckIn: '',
    dataCheckOut: '',
    status: 'CONFIRMADA'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resReservas, resHospedes, resQuartos] = await Promise.all([
        fetch(API_RESERVAS),
        fetch(API_HOSPEDES),
        fetch(API_QUARTOS)
      ]);
      
      if (!resReservas.ok || !resHospedes.ok || !resQuartos.ok) {
        throw new Error('Erro ao carregar dados do banco. Verifique o servidor Java.');
      }
      
      setReservas(await resReservas.json());
      setHospedes(await resHospedes.json());
      setQuartos(await resQuartos.json());
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Constrói o objeto esperado pelo backend (assumindo aninhamento padrão do Spring Data REST / JPA)
    const payload = {
      dataCheckIn: formData.dataCheckIn,
      dataCheckOut: formData.dataCheckOut,
      status: formData.status,
      hospede: { id: formData.hospedeId },
      quarto: { id: formData.quartoId }
    };

    try {
      const response = await fetch(API_RESERVAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData || 'Erro ao criar reserva. Pode ser indisponibilidade do quarto.');
      }

      setSuccess(`Reserva criada com sucesso!`);
      setFormData({ hospedeId: '', quartoId: '', dataCheckIn: '', dataCheckOut: '', status: 'CONFIRMADA' });
      fetchData(); // atualiza a lista
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0', fontFamily: 'var(--font-sans)' }}>
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>Erro: {error}</div>}
      {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        
        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>Nova Reserva</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Hóspede</label>
              <select name="hospedeId" value={formData.hospedeId} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="">Selecione um hóspede...</option>
                {Array.isArray(hospedes) && hospedes.map(h => <option key={h.id} value={h.id}>{h.nome} (CPF: {h.cpf})</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Quarto</label>
              <select name="quartoId" value={formData.quartoId} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="">Selecione um quarto...</option>
                {Array.isArray(quartos) && quartos.filter(q => q.status === 'DISPONIVEL').map(q => 
                  <option key={q.id} value={q.id}>Quarto {q.numero} - {q.nome || q.tipo} (R$ {q.precoBaseDiaria})</option>
                )}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Check-in</label>
                <input type="date" name="dataCheckIn" value={formData.dataCheckIn} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Check-out</label>
                <input type="date" name="dataCheckOut" value={formData.dataCheckOut} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                Criar Reserva
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '24px' }}>Reservas Ativas</h3>
          
          {reservas.length === 0 ? (
            <p style={{ color: '#888' }}>Nenhuma reserva encontrada.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Hóspede</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Quarto</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Período</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reservas) && reservas.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.hospede ? r.hospede.nome : 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{r.quarto ? r.quarto.numero : 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{r.dataCheckIn} até {r.dataCheckOut}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                        background: '#e3f2fd', color: '#1565c0'
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
