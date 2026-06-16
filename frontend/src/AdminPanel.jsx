import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HospedeCrud from './HospedeCrud';
import QuartoCrud from './QuartoCrud';
import ReservaCrud from './ReservaCrud';
import PagamentoCrud from './PagamentoCrud';
import PoliticaCancelamentoCrud from './PoliticaCancelamentoCrud';
import PromocaoCrud from './PromocaoCrud';
import RelatoriosPanel from './RelatoriosPanel';
import RecepcaoCrud from './RecepcaoCrud';

export default function AdminPanel({ initialTab = 'hospedes' }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const navItemStyle = (tab) => ({
    padding: '16px 24px',
    cursor: 'pointer',
    borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
    color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
    fontWeight: activeTab === tab ? '600' : '500',
    transition: 'all 0.3s ease'
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ padding: '120px 5% 40px', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', fontSize: '36px' }}>{t('welcome')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie toda a operação do Kaizen Inn (conectado ao H2 Database)</p>
        </div>
        <div>
          <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="pt">PT-BR</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <div style={navItemStyle('hospedes')} onClick={() => setActiveTab('hospedes')}>
          {t('guests')}
        </div>
        <div style={navItemStyle('quartos')} onClick={() => setActiveTab('quartos')}>
          {t('rooms')}
        </div>
        <div style={navItemStyle('reservas')} onClick={() => setActiveTab('reservas')}>
          {t('reservations')}
        </div>
        <div style={navItemStyle('pagamentos')} onClick={() => setActiveTab('pagamentos')}>
          {t('payments')}
        </div>
        <div style={navItemStyle('politicas')} onClick={() => setActiveTab('politicas')}>
          {t('policies')}
        </div>
        <div style={navItemStyle('promocoes')} onClick={() => setActiveTab('promocoes')}>
          {t('promotions')}
        </div>
        <div style={navItemStyle('recepcao')} onClick={() => setActiveTab('recepcao')}>
          Recepção
        </div>
        <div style={navItemStyle('relatorios')} onClick={() => setActiveTab('relatorios')}>
          {t('reports')}
        </div>
      </div>

      <div className="fade-in">
        {activeTab === 'hospedes' && <HospedeCrud />}
        {activeTab === 'quartos' && <QuartoCrud />}
        {activeTab === 'reservas' && <ReservaCrud />}
        {activeTab === 'pagamentos' && <PagamentoCrud />}
        {activeTab === 'politicas' && <PoliticaCancelamentoCrud />}
        {activeTab === 'promocoes' && <PromocaoCrud />}
        {activeTab === 'recepcao' && <RecepcaoCrud />}
        {activeTab === 'relatorios' && <RelatoriosPanel />}
      </div>
      
    </div>
  );
}
