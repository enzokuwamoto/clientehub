import React, { useState, useEffect } from 'react';
import HospedeCrud from './HospedeCrud';
import QuartoCrud from './QuartoCrud';
import ReservaCrud from './ReservaCrud';

export default function AdminPanel({ initialTab = 'hospedes' }) {
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

  return (
    <div style={{ padding: '120px 5% 40px', maxWidth: '1400px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', fontSize: '36px' }}>Painel Administrativo</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie toda a operação do Kaizen Inn (conectado ao H2 Database)</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <div style={navItemStyle('hospedes')} onClick={() => setActiveTab('hospedes')}>
          Hóspedes
        </div>
        <div style={navItemStyle('quartos')} onClick={() => setActiveTab('quartos')}>
          Quartos
        </div>
        <div style={navItemStyle('reservas')} onClick={() => setActiveTab('reservas')}>
          Reservas
        </div>
      </div>

      <div className="fade-in">
        {activeTab === 'hospedes' && <HospedeCrud />}
        {activeTab === 'quartos' && <QuartoCrud />}
        {activeTab === 'reservas' && <ReservaCrud />}
      </div>
      
    </div>
  );
}
