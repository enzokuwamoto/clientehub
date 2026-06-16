import React, { useState, useEffect } from 'react';

const API_RESERVAS = 'http://localhost:8080/api/reservas';

export default function RecepcaoCrud() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para os inputs de dataReal (mapeado por id da reserva)
  const [datasReais, setDatasReais] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_RESERVAS);
      if (!res.ok) throw new Error('Erro ao carregar reservas.');
      const data = await res.json();
      
      // Filtrar apenas reservas que interessam a recepção (CONFIRMADA, CHECK_IN, NO_SHOW)
      const ativas = data.filter(r => ['CONFIRMADA', 'CHECK_IN', 'NO_SHOW'].includes(r.status));
      setReservas(ativas);
      
      // Inicializar o state com a data atual para facilitar o preenchimento
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const nowStr = now.toISOString().slice(0, 16); // Formato YYYY-MM-DDThh:mm
      
      const inicialDatas = {};
      ativas.forEach(r => {
        inicialDatas[r.id] = nowStr;
      });
      setDatasReais(inicialDatas);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (id, value) => {
    setDatasReais(prev => ({ ...prev, [id]: value }));
  };

  const handleAction = async (reserva, actionType) => {
    try {
      const payload = { ...reserva };
      const dataInformada = datasReais[reserva.id];
      
      if (actionType === 'CHECK_IN') {
        if (!dataInformada) {
          alert('Por favor, informe a data/hora real de Check-in.');
          return;
        }
        payload.status = 'CHECK_IN';
        payload.dataCheckinReal = dataInformada;
      } else if (actionType === 'CHECK_OUT') {
        if (!dataInformada) {
          alert('Por favor, informe a data/hora real de Check-out.');
          return;
        }
        payload.status = 'CHECK_OUT';
        payload.dataCheckoutReal = dataInformada;
      } else if (actionType === 'NO_SHOW') {
        payload.status = 'NO_SHOW';
      }

      const res = await fetch(`${API_RESERVAS}/${reserva.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Erro ao processar a ação.');
      }
      
      alert(`Ação ${actionType} registrada com sucesso!`);
      fetchData();
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '0', fontFamily: 'var(--font-sans)' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>Recepção (Check-in / Check-out)</h3>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
          Controle de chegadas e partidas. Registre o momento exato em que o hóspede entrou ou saiu.
        </p>
        
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        {loading && <p>Carregando...</p>}

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Hóspede</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Quarto</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Datas Previstas</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status Atual</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Data/Hora Real</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{r.hospede ? r.hospede.nome : ''}</td>
                <td style={{ padding: '12px' }}>{r.quarto ? r.quarto.numero : ''}</td>
                <td style={{ padding: '12px', color: '#555' }}>
                  {r.dataEntrada} até {r.dataSaida}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                    background: r.status === 'CONFIRMADA' ? '#e8f5e9' : r.status === 'NO_SHOW' ? '#ffebee' : '#fff3e0',
                    color: r.status === 'CONFIRMADA' ? '#2e7d32' : r.status === 'NO_SHOW' ? '#c62828' : '#e65100'
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <input 
                    type="datetime-local" 
                    value={datasReais[r.id] || ''} 
                    onChange={(e) => handleDateChange(r.id, e.target.value)}
                    style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                  {r.status === 'CONFIRMADA' && (
                    <>
                      <button 
                        onClick={() => handleAction(r, 'CHECK_IN')} 
                        style={{ padding: '6px 12px', background: '#e3f2fd', border: '1px solid #1565c0', color: '#1565c0', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Registrar Check-in
                      </button>
                      <button 
                        onClick={() => handleAction(r, 'NO_SHOW')} 
                        style={{ padding: '6px 12px', background: '#ffebee', border: '1px solid #c62828', color: '#c62828', borderRadius: '4px', cursor: 'pointer' }}>
                        No-Show
                      </button>
                    </>
                  )}
                  {r.status === 'CHECK_IN' && (
                    <button 
                      onClick={() => handleAction(r, 'CHECK_OUT')} 
                      style={{ padding: '6px 12px', background: '#e8f5e9', border: '1px solid #2e7d32', color: '#2e7d32', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Registrar Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {reservas.length === 0 && !loading && (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                  Nenhuma reserva para acompanhamento de check-in/out neste momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
