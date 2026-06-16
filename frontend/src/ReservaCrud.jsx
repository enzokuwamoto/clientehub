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
    dataEntrada: '',
    dataSaida: '',
    qtdeAdultos: 1,
    qtdeCriancas: 0,
    qtdeCriancasAte5A: 0,
    codigoPromocional: '',
    status: 'PROPOSTA'
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
      dataEntrada: formData.dataEntrada,
      dataSaida: formData.dataSaida,
      qtdeAdultos: parseInt(formData.qtdeAdultos),
      qtdeCriancas: parseInt(formData.qtdeCriancas),
      qtdeCriancasAte5A: parseInt(formData.qtdeCriancasAte5A),
      codigoPromocional: formData.codigoPromocional,
      status: formData.status,
      hospede: { id: formData.hospedeId },
      quarto: { id: formData.quartoId },
      origem: 'SITE' // Fixado temporariamente
    };

    try {
      const response = await fetch(API_RESERVAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errMessage = 'Erro na requisição. Verifique os dados.';
        try {
          const errObj = await response.json();
          if (errObj.erro) errMessage = errObj.erro;
          else if (errObj.error === 'Bad Request') errMessage = 'Dados inválidos. Verifique se os campos foram preenchidos corretamente.';
          else errMessage = errObj.message || errObj.error || errMessage;
        } catch(e) {
          // fallback
        }
        throw new Error(errMessage);
      }

      setSuccess(`Reserva criada com sucesso!`);
      setFormData({ hospedeId: '', quartoId: '', dataEntrada: '', dataSaida: '', qtdeAdultos: 1, qtdeCriancas: 0, qtdeCriancasAte5A: 0, codigoPromocional: '', status: 'PROPOSTA' });
      fetchData(); // atualiza a lista
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reserva, novoStatus) => {
    if (!window.confirm(`Deseja alterar a reserva #${reserva.id} para ${novoStatus}?`)) return;
    try {
      const payload = { ...reserva, status: novoStatus };
      const res = await fetch(`${API_RESERVAS}/${reserva.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let errMessage = 'Erro ao atualizar status';
        try {
          const errObj = await res.json();
          if (errObj.erro) errMessage = errObj.erro;
          else if (errObj.error === 'Bad Request') errMessage = 'Dados inválidos ao atualizar.';
        } catch(e) {}
        throw new Error(errMessage);
      }
      fetchData();
    } catch (err) {
      setError(err.message);
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
                <input type="date" name="dataEntrada" value={formData.dataEntrada} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Check-out</label>
                <input type="date" name="dataSaida" value={formData.dataSaida} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Adultos</label>
                <input type="number" min="1" name="qtdeAdultos" value={formData.qtdeAdultos} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Crianças</label>
                <input type="number" min="0" name="qtdeCriancas" value={formData.qtdeCriancas} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Crianças &lt; 5a</label>
                <input type="number" min="0" max={formData.qtdeCriancas} name="qtdeCriancasAte5A" value={formData.qtdeCriancasAte5A} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Código Promocional</label>
              <input type="text" name="codigoPromocional" value={formData.codigoPromocional} onChange={handleInputChange} placeholder="Opcional" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
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
                  <th style={{ padding: '12px', textAlign: 'left' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reservas) && reservas.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.hospede ? r.hospede.nome : 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{r.quarto ? r.quarto.numero : 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{r.dataEntrada ? r.dataEntrada.split('-').reverse().join('/') : ''} até {r.dataSaida ? r.dataSaida.split('-').reverse().join('/') : ''}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                        background: r.status === 'CONFIRMADA' ? '#e8f5e9' : r.status === 'CANCELADA' ? '#ffebee' : '#e3f2fd',
                        color: r.status === 'CONFIRMADA' ? '#2e7d32' : r.status === 'CANCELADA' ? '#c62828' : '#1565c0'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {r.status === 'CONFIRMADA' && (
                        <>
                          <button onClick={() => handleUpdateStatus(r, 'CHECK_IN')} style={{ marginRight: '8px', padding: '4px 8px', background: '#e3f2fd', border: '1px solid #1565c0', color: '#1565c0', borderRadius: '4px', cursor: 'pointer' }}>Check-in</button>
                          <button onClick={() => handleUpdateStatus(r, 'NO_SHOW')} style={{ padding: '4px 8px', background: '#ffebee', border: '1px solid #c62828', color: '#c62828', borderRadius: '4px', cursor: 'pointer' }}>No-show</button>
                        </>
                      )}
                      {r.status === 'CHECK_IN' && (
                        <button onClick={() => handleUpdateStatus(r, 'CHECK_OUT')} style={{ padding: '4px 8px', background: '#e8f5e9', border: '1px solid #2e7d32', color: '#2e7d32', borderRadius: '4px', cursor: 'pointer' }}>Check-out</button>
                      )}
                      {r.status !== 'CANCELADA' && r.status !== 'CHECK_OUT' && (
                        <button onClick={() => handleUpdateStatus(r, 'CANCELADA')} style={{ marginLeft: '8px', padding: '4px 8px', background: 'transparent', border: 'none', color: '#c62828', textDecoration: 'underline', cursor: 'pointer' }}>Cancelar</button>
                      )}
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
