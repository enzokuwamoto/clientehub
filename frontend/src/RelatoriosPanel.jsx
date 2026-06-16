import React, { useState, useEffect } from 'react';

const API_RELATORIOS = 'http://localhost:8080/api/relatorios';

export default function RelatoriosPanel() {
  const [ocupacao, setOcupacao] = useState(null);
  const [financeiro, setFinanceiro] = useState(null);
  const [origem, setOrigem] = useState(null);
  const [promocoes, setPromocoes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resOcup, resFin, resOrig, resProm] = await Promise.all([
        fetch(`${API_RELATORIOS}/ocupacao`),
        fetch(`${API_RELATORIOS}/financeiro`),
        fetch(`${API_RELATORIOS}/origem`),
        fetch(`${API_RELATORIOS}/promocoes`)
      ]);

      setOcupacao(await resOcup.json());
      setFinanceiro(await resFin.json());
      setOrigem(await resOrig.json());
      setPromocoes(await resProm.json());
    } catch (err) {
      console.error("Erro ao carregar relatórios", err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  };

  const valueStyle = {
    margin: 0,
    fontSize: '36px',
    color: 'var(--primary-color)',
    fontWeight: '700',
    fontFamily: 'var(--font-serif)'
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Carregando relatórios...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
      
      <div style={cardStyle}>
        <h3 style={titleStyle}>Ocupação Atual (Reservas Ativas)</h3>
        <p style={valueStyle}>{ocupacao?.reservasAtivas || 0}</p>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Hóspedes com Check-in ou Confirmados.</p>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>Receita Bruta Estimada</h3>
        <p style={valueStyle}>R$ {(financeiro?.['receitaBrutaTotal Estimada'] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Baseado no valor total de todas as reservas.</p>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>Origem das Reservas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {origem && Object.entries(origem).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '4px' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{k}</span>
              <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>Desempenho de Promoções (Mock)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {promocoes && Object.entries(promocoes).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '4px' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{k}</span>
              <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{v} usos</span>
            </div>
          ))}
          {(!promocoes || Object.keys(promocoes).length === 0) && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Nenhuma promoção cadastrada.</p>
          )}
        </div>
      </div>

    </div>
  );
}
