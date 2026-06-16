import React, { useState, useEffect } from 'react';

const API_POLITICAS = 'http://localhost:8080/api/politicas-cancelamento';

export default function PoliticaCancelamentoCrud() {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    horasLimiteSemMulta: '',
    percentualMulta: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_POLITICAS);
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setPoliticas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
      setPoliticas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      descricao: formData.descricao,
      horasLimiteSemMulta: parseInt(formData.horasLimiteSemMulta),
      percentualMulta: parseFloat(formData.percentualMulta)
    };

    try {
      const url = editingId ? `${API_POLITICAS}/${editingId}` : API_POLITICAS;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || 'Erro ao salvar política');
      }

      setFormData({ descricao: '', horasLimiteSemMulta: '', percentualMulta: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      descricao: p.descricao || '',
      horasLimiteSemMulta: p.horasLimiteSemMulta || '',
      percentualMulta: p.percentualMulta || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja inativar esta política?')) return;
    try {
      const res = await fetch(`${API_POLITICAS}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
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
        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary-color)' }}>
          {editingId ? 'Editar Política' : 'Nova Política'}
        </h3>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Descrição da Política</label>
            <input
              style={inputStyle}
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Ex: Padrão Não-Reembolsável"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Horas Limite (sem multa)</label>
              <input
                style={inputStyle}
                type="number"
                name="horasLimiteSemMulta"
                value={formData.horasLimiteSemMulta}
                onChange={handleInputChange}
                placeholder="Ex: 48"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>% Multa após Limite</label>
              <input
                style={inputStyle}
                type="number"
                step="0.01"
                name="percentualMulta"
                value={formData.percentualMulta}
                onChange={handleInputChange}
                placeholder="Ex: 50.0"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              type="submit"
              style={{ flex: 1, backgroundColor: 'var(--primary-color)', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              {editingId ? 'Atualizar Política' : 'Cadastrar Política'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData({ descricao: '', horasLimiteSemMulta: '', percentualMulta: '' }); setError(null); }}
                style={{ flex: 1, backgroundColor: '#F3F4F6', color: 'var(--text-secondary)', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabela de Listagem */}
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary-color)' }}>Políticas Cadastradas</h3>
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dados...</p>
        ) : politicas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}>Nenhuma política cadastrada ainda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Descrição</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Horas Limite</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>% Multa</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {politicas.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>#{p.id}</td>
                    <td style={{ padding: '16px' }}>{p.descricao}</td>
                    <td style={{ padding: '16px' }}>{p.horasLimiteSemMulta}h</td>
                    <td style={{ padding: '16px' }}>{p.percentualMulta}%</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => handleEdit(p)}
                        style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        style={{ padding: '6px 12px', backgroundColor: '#FEE2E2', border: 'none', color: '#B91C1C', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        Excluir
                      </button>
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
