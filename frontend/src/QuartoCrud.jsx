import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/quartos';

export default function QuartoCrud() {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    numeroQuarto: '',
    nome: '',
    tipo: 'SINGLE',
    capacidadeAdultos: 2,
    capacidadeCriancas: 0,
    precoDiaria: '',
    status: 'DISPONIVEL'
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchQuartos();
  }, []);

  const fetchQuartos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha ao conectar.');
      const data = await response.json();
      setQuartos(data);
    } catch (err) {
      setError(err.message);
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

    try {
      const isUpdating = isEditing && formData.id;
      const url = isUpdating ? `${API_URL}/${formData.id}` : API_URL;
      const method = isUpdating ? 'PUT' : 'POST';

      const payload = {
        numero: formData.numeroQuarto,
        nome: formData.nome,
        tipo: formData.tipo,
        capacidadeAdultos: parseInt(formData.capacidadeAdultos),
        capacidadeCriancas: parseInt(formData.capacidadeCriancas),
        precoBaseDiaria: parseFloat(formData.precoDiaria),
        status: formData.status
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData);
      }

      setSuccess(`Quarto salvo com sucesso!`);
      resetForm();
      fetchQuartos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '', numeroQuarto: '', nome: '', tipo: 'SINGLE', capacidadeAdultos: 2, capacidadeCriancas: 0, precoDiaria: '', status: 'DISPONIVEL'
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '0', fontFamily: 'var(--font-sans)' }}>
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>Erro: {error}</div>}
      {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        
        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
            {isEditing ? 'Editar Quarto' : 'Novo Quarto'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nº Quarto</label>
                <input type="text" name="numeroQuarto" value={formData.numeroQuarto} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nome (ex: Suíte Master)</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="SINGLE">Single (Solteiro)</option>
                <option value="DUPLO">Duplo (Casal/Duas camas)</option>
                <option value="SUITE">Suíte (Luxo/Master)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Cap. Adultos</label>
                <input type="number" name="capacidadeAdultos" value={formData.capacidadeAdultos} onChange={handleInputChange} min="1" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Cap. Crianças</label>
                <input type="number" name="capacidadeCriancas" value={formData.capacidadeCriancas} onChange={handleInputChange} min="0" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Preço da Diária (R$)</label>
              <input type="number" step="0.01" name="precoDiaria" value={formData.precoDiaria} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="DISPONIVEL">Disponível</option>
                <option value="OCUPADO">Ocupado</option>
                <option value="MANUTENCAO">Em Manutenção</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                Salvar
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '24px' }}>Quartos Cadastrados</h3>
          
          {quartos.length === 0 ? (
            <p style={{ color: '#888' }}>Nenhum quarto encontrado.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nº</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Preço</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(quartos) && quartos.map(q => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{q.numero}</td>
                    <td style={{ padding: '12px' }}>{q.nome || '-'}</td>
                    <td style={{ padding: '12px' }}>{q.tipo}</td>
                    <td style={{ padding: '12px' }}>R$ {q.precoBaseDiaria}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                        background: q.status === 'DISPONIVEL' ? '#e8f5e9' : '#ffebee',
                        color: q.status === 'DISPONIVEL' ? '#2e7d32' : '#c62828'
                      }}>
                        {q.status}
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
