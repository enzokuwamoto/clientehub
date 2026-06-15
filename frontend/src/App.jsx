import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' ou 'gestao'
  const [adminTab, setAdminTab] = useState('hospedes');

  // Search State
  const [searchAdults, setSearchAdults] = useState(2);
  const [searchChildren, setSearchChildren] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const goToAdmin = (tab) => {
    setAdminTab(tab);
    setCurrentView('gestao');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    background: scrolled || currentView !== 'landing' ? '#ffffff' : 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
    boxShadow: scrolled || currentView !== 'landing' ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.4s ease'
  };

  const linkStyle = {
    color: scrolled || currentView !== 'landing' ? 'var(--primary-color)' : '#ffffff',
    cursor: 'pointer'
  };

  const btnStyle = scrolled || currentView !== 'landing' ? {
    borderColor: 'var(--primary-color)',
    color: 'var(--primary-color)'
  } : {};

  return (
    <>
      {/* Header Universal */}
      <header className="header" style={headerStyle}>
        <div className="logo-container" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
          <span className="logo-text" style={{ color: scrolled || currentView !== 'landing' ? 'var(--primary-color)' : '#fff'}}>KAIZEN INN</span>
        </div>
        
        <ul className="nav-links">
          <li><a onClick={() => setCurrentView('landing')} style={linkStyle}>Home</a></li>
          {currentView === 'landing' && (
            <>
              <li><a href="#rooms" style={linkStyle}>Acomodações</a></li>
              <li><a href="#facilities" style={linkStyle}>Atividades</a></li>
              <li><a href="#about" style={linkStyle}>Sobre Nós</a></li>
            </>
          )}
          <li>
            <a onClick={() => goToAdmin('hospedes')} style={{ ...linkStyle, fontWeight: 'bold', borderBottom: currentView === 'gestao' ? '2px solid' : 'none' }}>
              Painel Administrativo
            </a>
          </li>
        </ul>

        <button className="btn-header" style={btnStyle} onClick={() => goToAdmin('reservas')}>Reserve Já</button>
      </header>

      {/* Roteamento Simples */}
      {currentView === 'landing' ? (
        // --- LANDING PAGE ORIGINAL ---
        <div>
          {/* Hero Section */}
          <section id="home" className="hero fade-in">
            <div className="hero-content">
              <span className="hero-subtitle">Bem-vindo ao Paraíso</span>
              <h1 className="hero-title">Sua casa na nossa cidade</h1>
            </div>

            {/* Booking Bar */}
            <div className="booking-bar-container">
              <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Check-in</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Check-out</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Adultos</label>
                  <select value={searchAdults} onChange={e => setSearchAdults(parseInt(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Crianças</label>
                  <select value={searchChildren} onChange={e => setSearchChildren(parseInt(e.target.value))}>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <button type="button" className="btn-primary" onClick={() => {
                  setHasSearched(true);
                  document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
                }}>Pesquisar</button>
              </form>
            </div>
          </section>

          {/* Rooms & Rates Section */}
          <section id="rooms" className="section" style={{ backgroundColor: '#f9f9f9' }}>
            <div className="section-header">
              <span className="section-subtitle">Descubra nossas</span>
              <h2 className="section-title">Acomodações & Valores</h2>
            </div>

            {hasSearched && (
              <div style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--primary-color)' }}>
                Resultados para {searchAdults} Adultos e {searchChildren} Crianças:
              </div>
            )}

            <div className="rooms-grid">
              {/* Room 1 */}
              {(!hasSearched || (searchAdults <= 2 && searchChildren === 0)) && (
              <div className="room-card">
                <div className="room-image">
                  <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800" alt="Suíte Master" />
                </div>
                <div className="room-content">
                  <h3 className="room-name">Suíte Master</h3>
                  <div className="room-meta">
                    <span>2 Pessoas</span>
                    <span>45 m²</span>
                    <span>Cama King</span>
                  </div>
                  <p className="room-desc">Máximo conforto com vista panorâmica para o oceano, varanda privativa e ambiente projetado para o seu descanso.</p>
                  <div className="room-price">R$ 850 <span>/ noite</span></div>
                  <button className="btn-dark" onClick={() => goToAdmin('reservas')}>Reservar Agora</button>
                </div>
              </div>
              )}

              {/* Room 2 */}
              {(!hasSearched || (searchAdults <= 4 && searchChildren <= 2 && (searchAdults + searchChildren) <= 4)) && (
              <div className="room-card">
                <div className="room-image">
                  <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800" alt="Quarto Família" />
                </div>
                <div className="room-content">
                  <h3 className="room-name">Quarto Família</h3>
                  <div className="room-meta">
                    <span>4 Pessoas</span>
                    <span>60 m²</span>
                    <span>2 Camas Queen</span>
                  </div>
                  <p className="room-desc">Ideal para famílias, quarto espaçoso que garante conforto para todos com área de estar integrada e vista para o jardim.</p>
                  <div className="room-price">R$ 1.200 <span>/ noite</span></div>
                  <button className="btn-dark" onClick={() => goToAdmin('reservas')}>Reservar Agora</button>
                </div>
              </div>
              )}

              {/* Room 3 */}
              {(!hasSearched || (searchAdults <= 2 && searchChildren === 0)) && (
              <div className="room-card">
                <div className="room-image">
                  <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800" alt="Quarto Duplo Luxo" />
                </div>
                <div className="room-content">
                  <h3 className="room-name">Quarto Duplo Luxo</h3>
                  <div className="room-meta">
                    <span>2 Pessoas</span>
                    <span>35 m²</span>
                    <span>Cama Queen</span>
                  </div>
                  <p className="room-desc">Um refúgio charmoso e intimista, perfeito para casais. Decoração sofisticada com tons terrosos e banheira relaxante.</p>
                  <div className="room-price">R$ 650 <span>/ noite</span></div>
                  <button className="btn-dark" onClick={() => goToAdmin('reservas')}>Reservar Agora</button>
                </div>
              </div>
              )}

              {/* Room 4 */}
              {(!hasSearched || (searchAdults <= 6 && searchChildren <= 4 && (searchAdults + searchChildren) <= 6)) && (
              <div className="room-card">
                <div className="room-image">
                  <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" alt="Villa Privativa" />
                </div>
                <div className="room-content">
                  <h3 className="room-name">Villa Privativa</h3>
                  <div className="room-meta">
                    <span>6 Pessoas</span>
                    <span>120 m²</span>
                    <span>3 Quartos</span>
                  </div>
                  <p className="room-desc">Para quem busca exclusividade. Uma casa completa com piscina própria, chef à disposição e total privacidade à beira-mar.</p>
                  <div className="room-price">R$ 3.500 <span>/ noite</span></div>
                  <button className="btn-dark" onClick={() => goToAdmin('reservas')}>Reservar Agora</button>
                </div>
              </div>
              )}

              {/* Room 5 */}
              {(!hasSearched || (searchAdults <= 2 && searchChildren === 0)) && (
              <div className="room-card">
                <div className="room-image">
                  <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800" alt="Bangalô sobre a Água" />
                </div>
                <div className="room-content">
                  <h3 className="room-name">Bangalô sobre a Água</h3>
                  <div className="room-meta">
                    <span>2 Pessoas</span>
                    <span>50 m²</span>
                    <span>Cama King</span>
                  </div>
                  <p className="room-desc">Durma ouvindo o som das ondas. O bangalô possui piso de vidro, deck privativo e acesso direto ao mar cristalino.</p>
                  <div className="room-price">R$ 1.800 <span>/ noite</span></div>
                  <button className="btn-dark" onClick={() => goToAdmin('reservas')}>Reservar Agora</button>
                </div>
              </div>
              )}

              {/* Room 6 */}
              {(!hasSearched || (searchAdults <= 2 && searchChildren === 0)) && (
              <div className="room-card">
                <div className="room-image">
                  <img src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800" alt="Quarto Standard" />
                </div>
                <div className="room-content">
                  <h3 className="room-name">Quarto Standard</h3>
                  <div className="room-meta">
                    <span>2 Pessoas</span>
                    <span>28 m²</span>
                    <span>Cama Casal</span>
                  </div>
                  <p className="room-desc">A opção perfeita para quem viaja a trabalho ou busca custo-benefício sem abrir mão do padrão de qualidade Kaizen Inn.</p>
                  <div className="room-price">R$ 450 <span>/ noite</span></div>
                  <button className="btn-dark" onClick={() => goToAdmin('reservas')}>Reservar Agora</button>
                </div>
              </div>
              )}

              {/* No Results Message */}
              {hasSearched && 
                (searchAdults > 6 || (searchAdults + searchChildren) > 6) && (
                <div style={{ gridColumn: '1 / -1', padding: '40px', background: '#ffebee', color: '#c62828', borderRadius: '8px', textAlign: 'center' }}>
                  <h3>Poxa! Não temos quartos disponíveis com esses requisitos.</h3>
                  <p>A capacidade máxima de nossas acomodações é de 6 pessoas (Villa Privativa). Por favor, tente buscar duas acomodações separadas.</p>
                </div>
              )}

            </div>
          </section>

          {/* Facilities Section */}
          <section id="facilities" className="facilities">
            <div className="section-header">
              <span className="section-subtitle">Exclusividade</span>
              <h2 className="section-title">Nossos Serviços</h2>
            </div>
            
            <div className="fac-grid">
              <div className="fac-item">
                <h4>Restaurante Estrelado</h4>
                <p>Alta gastronomia com ingredientes locais frescos, menu assinado por chef internacional.</p>
              </div>
              <div className="fac-item">
                <h4>Spa de Luxo</h4>
                <p>Tratamentos revigorantes, massagens com pedras quentes e terapias à base de óleos essenciais.</p>
              </div>
              <div className="fac-item">
                <h4>Piscina Infinita</h4>
                <p>Mergulhe em nossa piscina climatizada com bar molhado e vista espetacular do pôr do sol.</p>
              </div>
              <div className="fac-item">
                <h4>Passeios de Lancha</h4>
                <p>Exploração das ilhas vizinhas com conforto e privacidade, roteiro personalizado incluso.</p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="section">
            <div className="about-grid">
              <div className="about-images">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600" alt="Hotel Pool" />
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600" alt="Hotel Restaurant" />
              </div>
              <div className="about-content">
                <span className="section-subtitle" style={{ justifyContent: 'flex-start' }}>Nossa História</span>
                <h3>Uma experiência única à beira-mar</h3>
                <p>Desde sua fundação, o Kaizen Inn tem sido um sinônimo de luxo, conforto e integração perfeita com a natureza. Localizado em um cenário paradisíaco, fomos premiados como o melhor resort de luxo da região.</p>
                <p>Nossa arquitetura premiada une o estilo contemporâneo com toques tropicais. Desfrute de nossa alta gastronomia, piscinas de borda infinita e o atendimento que antecipa todos os seus desejos.</p>
                <button className="btn-dark" style={{ marginTop: '16px' }} onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}>Conheça Mais</button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        // --- ADMIN PANEL COMPLETO ---
        <div className="fade-in">
          <AdminPanel initialTab={adminTab} />
        </div>
      )}

      {/* Footer Universal */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">KAIZEN INN</div>
            <p className="footer-desc">Redefinindo o conceito de luxo e hospitalidade. Desfrute de momentos inesquecíveis em meio à natureza com serviço impecável e exclusividade sem igual.</p>
          </div>
          
          <div>
            <h4>Links Rápidos</h4>
            <ul>
              <li><a onClick={() => setCurrentView('landing')} style={{cursor: 'pointer', color: '#888'}}>Home</a></li>
              {currentView === 'landing' && (
                <>
                  <li><a href="#rooms">Acomodações</a></li>
                  <li><a href="#facilities">Atividades</a></li>
                  <li><a href="#about">Nossa História</a></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href="#">reservas@kaizeninn.com</a></li>
              <li><a href="#">+55 (11) 9999-0000</a></li>
              <li><a href="#">Rodovia do Sol, Km 42 - Praia Mansa</a></li>
            </ul>
          </div>

          <div>
            <h4>Newsletter</h4>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>Receba ofertas exclusivas por e-mail.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="email" placeholder="Seu e-mail" style={{ padding: '10px', width: '100%', outline: 'none' }} />
              <button style={{ padding: '10px 16px', background: 'var(--accent-color)', border: 'none', cursor: 'pointer', color: '#000', fontWeight: 'bold' }}>OK</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Kaizen Inn Hotel & Resort. Todos os direitos reservados. Feito com luxo.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
