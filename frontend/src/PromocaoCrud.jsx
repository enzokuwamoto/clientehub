import React, { useState, useEffect } from 'react';

const API_PROMOCOES = 'http://localhost:8080/api/promocoes';

export default function PromocaoCrud() {
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descontoPercentual: '',
    dataInicio: '',
    dataFim: '',
    regraAplicacao: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_PROMOCOES);
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setPromocoes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
      setPromocoes([]);
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
      nome: formData.nome,
      descontoPercentual: parseFloat(formData.descontoPercentual),
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      regraAplicacao: formData.regraAplicacao
    };

    try {
      const url = editingId ? `${API_PROMOCOES}/${editingId}` : API_PROMOCOES;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errMessage = 'Erro ao salvar promoção';
        try {
          const errObj = await res.json();
          if (errObj.erro) errMessage = errObj.erro;
          else if (errObj.error === 'Bad Request') errMessage = 'Dados inválidos. Verifique os campos preenchidos.';
          else errMessage = errObj.message || errObj.error || errMessage;
        } catch(e) {}
        throw new Error(errMessage);
      }

      setFormData({ nome: '', descontoPercentual: '', dataInicio: '', dataFim: '', regraAplicacao: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      nome: p.nome || '',
      descontoPercentual: p.descontoPercentual || '',
      dataInicio: p.dataInicio || '',
      dataFim: p.dataFim || '',
      regraAplicacao: p.regraAplicacao || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta promoção?')) return;
    try {
      const res = await fetch(`${API_PROMOCOES}/${id}`, { method: 'DELETE' });
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
          {editingId ? 'Editar Promoção' : 'Nova Promoção'}
        </h3>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Nome da Promoção</label>
            <input
              style={inputStyle}
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: Black Friday"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>% Desconto</label>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              name="descontoPercentual"
              value={formData.descontoPercentual}
              onChange={handleInputChange}
              placeholder="Ex: 15.0"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Data Início</label>
              <input
                style={inputStyle}
                type="date"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Data Fim</label>
              <input
                style={inputStyle}
                type="date"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Regra de Aplicação (Opcional)</label>
            <input
              style={inputStyle}
              name="regraAplicacao"
              value={formData.regraAplicacao}
              onChange={handleInputChange}
              placeholder="Ex: Min. 3 diárias"
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              type="submit"
              style={{ flex: 1, backgroundColor: 'var(--primary-color)', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              {editingId ? 'Atualizar Promoção' : 'Cadastrar Promoção'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData({ nome: '', descontoPercentual: '', dataInicio: '', dataFim: '', regraAplicacao: '' }); setError(null); }}
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
        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: 'var(--primary-color)' }}>Promoções Cadastradas</h3>
        
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Carregando dados...</p>
        ) : promocoes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}>Nenhuma promoção cadastrada ainda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Nome</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Desconto</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Período</th>
                  <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {promocoes.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{p.nome}</td>
                    <td style={{ padding: '16px' }}>{p.descontoPercentual}%</td>
                    <td style={{ padding: '16px' }}>{p.dataInicio && p.dataInicio.split('-').reverse().join('/')} até {p.dataFim && p.dataFim.split('-').reverse().join('/')}</td>
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
