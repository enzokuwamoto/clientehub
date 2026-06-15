import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/hospedes';

export default function HospedeCrud() {
  const [hospedes, setHospedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    cpf: '',
    dataNasc: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load Hospedes on component mount
  useEffect(() => {
    fetchHospedes();
  }, []);

  const fetchHospedes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha ao conectar com o servidor. O Java está rodando?');
      const data = await response.json();
      setHospedes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
      formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    if (name === 'telefone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
      formattedValue = formattedValue.replace(/^(\d{2})(\d)/g, '($1) $2');
      formattedValue = formattedValue.replace(/(\d)(\d{4})$/, '$1-$2');
    }

    if (name === 'cep') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8);
      formattedValue = formattedValue.replace(/(\d{5})(\d)/, '$1-$2');
    }

    setFormData({ ...formData, [name]: formattedValue });
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
        nome: formData.nome,
        cpf: formData.cpf,
        dataNasc: formData.dataNasc,
        email: formData.email,
        telefone: formData.telefone,
        endereco: {
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: {
            descricao: formData.cidade,
            estado: {
              descricao: formData.estado
            }
          }
        }
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Erro ao salvar hóspede');
      }

      setSuccess(`Hóspede ${isUpdating ? 'atualizado' : 'cadastrado'} com sucesso!`);
      resetForm();
      fetchHospedes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hospede) => {
    setFormData({
      id: hospede.id || '',
      nome: hospede.nome || '',
      cpf: hospede.cpf || '',
      dataNasc: hospede.dataNasc || '',
      email: hospede.email || '',
      telefone: hospede.telefone || '',
      cep: hospede.endereco?.cep || '',
      logradouro: hospede.endereco?.logradouro || '',
      numero: hospede.endereco?.numero || '',
      complemento: hospede.endereco?.complemento || '',
      bairro: hospede.endereco?.bairro || '',
      cidade: hospede.endereco?.cidade?.descricao || '',
      estado: hospede.endereco?.cidade?.estado?.descricao || ''
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este hóspede?')) return;
    
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Erro ao excluir hóspede');
      }

      setSuccess('Hóspede excluído com sucesso!');
      fetchHospedes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      id: '', nome: '', cpf: '', dataNasc: '', email: '', telefone: '', 
      cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' 
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '0', fontFamily: 'var(--font-sans)' }}>
      {/* Alertas */}
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>Erro: {error}</div>}
      {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        
        {/* Formulário (Create / Update) */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--primary-color)' }}>
            {isEditing ? 'Editar Hóspede' : 'Novo Hóspede'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>CPF</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Data de Nascimento</label>
                <input type="date" name="dataNasc" value={formData.dataNasc} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Telefone</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(11) 90000-0000" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <h4 style={{ margin: '16px 0 8px 0', fontSize: '14px', color: 'var(--primary-color)' }}>Endereço Residencial</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Rua / Logradouro</label>
                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Complemento (opcional)</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} placeholder="Apto, Bloco, etc." style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Estado (UF)</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="">Selecione...</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button type="submit" disabled={loading} style={{ flex: 1, background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} style={{ flex: 1, background: '#eee', color: '#333', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela de Hóspedes (Read / Delete) */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--primary-color)' }}>Hóspedes Cadastrados</h3>
            <button onClick={fetchHospedes} style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
              Atualizar Lista
            </button>
          </div>

          {loading && !hospedes.length ? (
            <p>Carregando dados do banco MySQL...</p>
          ) : hospedes.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Nenhum hóspede cadastrado no banco de dados.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>CPF</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>E-mail</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(hospedes) && hospedes.map(hospede => (
                    <tr key={hospede.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{hospede.nome}</td>
                      <td style={{ padding: '12px' }}>{hospede.cpf}</td>
                      <td style={{ padding: '12px' }}>{hospede.email}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button onClick={() => handleEdit(hospede)} style={{ background: '#fff9c4', color: '#f57f17', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                          Editar
                        </button>
                        <button onClick={() => handleDelete(hospede.id)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
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
    </div>
  );
}
