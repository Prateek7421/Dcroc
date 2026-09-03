import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import OwnerDashBoard from './OwnerDashBoard'; 
import CustomerDashBoard from './CustomerDashBoard'; 
import OwnerGallery from './OwnerGallery';
import CustomerGallery from './CustomerGallery';

const API_BASE_URL = 'https://dcrocbackend.onrender.com/api';

// --- CABEÇALHO ---
const Header = () => (
  <header className="absolute top-0 left-0 w-full flex items-center justify-between p-4 sm:p-5 lg:px-12 bg-[#FEE5BD]/95 backdrop-blur-md border-b border-[#FAAA6B]/50 z-50 shadow-sm">
    <div className="flex items-center gap-6">
      <img 
        src="https://res.cloudinary.com/jvuks1bl/image/upload/v1788457009/WhatsApp_Image_2026-09-03_at_21.55.42_dmsiav.jpg" 
        alt="dcrocrotisseria logo" 
        className="h-10 sm:h-12 w-auto object-contain rounded-full shadow-sm scale-[1.4] sm:scale-[1.6] origin-left" 
      />
      <span className="text-xl ml-6 sm:text-2xl font-playball font-bold text-[#6E2D16] tracking-tight">D'croc Rotisseria e Congelados</span>
    </div>
    
    <div className="hidden sm:flex items-center gap-6 font-medium text-[#6E2D16]/80 text-sm">
      <Link to="/customer/console" className="cursor-pointer text-xl hover:text-[#f05632] transition">🛒</Link>
      <Link to="/customer/console" className="bg-[#f05632] hover:bg-[#d94a28] text-white px-5 py-2 rounded-lg shadow-sm transition font-semibold">Ver Cardápio</Link>
    </div>
  </header>
);

// --- SELEÇÃO DE PAPEL CENTRALIZADA ---
const RoleSelection = () => {
  return (
    <div className="relative w-full max-w-lg bg-white/70 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-[#FAAA6B] text-center transition-all duration-300 hover:border-[#f05632]/50 hover:shadow-[#f05632]/10 mt-16">
      <div className="mt-2 sm:mt-4 mb-8 flex flex-col items-center justify-center">
        <p className="text-[10px] sm:text-xs font-bold text-[#f05632] uppercase tracking-widest mt-2 mb-3">Rotisserie & Congleados</p>
        
        <h1 className="text-xl sm:text-[28px] font-sans font-bold tracking-tight text-[#6E2D16] mb-4">
          SABOR, QUALIDADE E CARINHO 
        </h1>
        <p className='text-2xl relative bottom-2.5 mb-3 font-sans font-bold text-[#f05632]'>em cada detalhe</p>
        <p className="text-xs sm:text-sm text-[#6E2D16]/80 text-balance leading-relaxed">
          Sabor e praticidade para o seu dia a dia. Acesse nosso cardápio e faça seu pedido pelo whatsapp!
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* BOTÕES DO CLIENTE */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center w-full text-[10px] sm:text-xs font-bold text-[#FAAA6B] uppercase tracking-widest before:flex-1 before:border-t before:border-[#FAAA6B]/50 before:mr-3 after:flex-1 after:border-t after:border-[#FAAA6B]/50 after:ml-3">
            Área do Cliente
          </div>
          <div className="flex">
            <Link to="/customer/console" className="flex-1 bg-[#f05632] hover:bg-[#d94a28] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.99] shadow-md shadow-orange-500/20 text-sm">
              Acessar Cardápio
            </Link>
          </div>
        </div>

        {/* BOTÕES DO LOJISTA */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center w-full text-[10px] sm:text-xs font-bold text-[#FAAA6B] uppercase tracking-widest before:flex-1 before:border-t before:border-[#FAAA6B]/50 before:mr-3 after:flex-1 after:border-t after:border-[#FAAA6B]/50 after:ml-3">
            Área do Lojista
          </div>
          <div className="flex gap-3 sm:gap-4">
            <Link to="/owner" state={{ tab: 'login' }} className="flex-1 bg-white hover:bg-[#FEE5BD] border border-[#FAAA6B] text-[#6E2D16] font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.99] text-sm">
              Entrar
            </Link>
            <Link to="/owner" state={{ tab: 'register' }} className="flex-1 bg-[#6E2D16] hover:bg-[#8B3B1E] text-[#FEE5BD] font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.99] shadow-md shadow-[#6E2D16]/20 text-sm">
              Criar Loja
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-[9px] sm:text-[11px] text-[#6E2D16]/50 font-medium tracking-wide">PLATAFORMA 100% SEGURA</div>
    </div>
  );
};

// --- GATEWAY DO PROPRIETÁRIO ---
const OwnerDashboard = () => {
  const location = useLocation();
  const [isLoginTab, setIsLoginTab] = useState(location.state?.tab !== 'register');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.tab) {
      setIsLoginTab(location.state.tab === 'login');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLoginTab) {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        const assignedCode = response.data.businessCode;
        navigate('/owner/console', { state: { businessCode: assignedCode, name: businessName, email: email } });
      } else {
        const payload = { name: businessName, email, companyName: businessName, password };
        const response = await axios.post(`${API_BASE_URL}/auth/register-owner`, payload);
        const assignedCode = response.data.businessCode;
        alert(`Inicialização bem-sucedida! Código atribuído: ${assignedCode}`);
        navigate('/owner/console', { state: { businessCode: assignedCode, name: businessName, email: email } });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || err.message || 'Falha na autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-[#FAAA6B] flex flex-col mt-16 z-10 relative">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FEE5BD] text-[#6E2D16] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold border border-[#FAAA6B]">⚙️</div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#6E2D16] text-center tracking-tight">Central do Lojista</h2>
      <p className="text-[11px] sm:text-xs text-[#6E2D16]/70 text-center mt-1 mb-5 sm:mb-6">Autentique-se para gerenciar seus produtos e pedidos.</p>

      {errorMsg && <div className="bg-rose-100 border border-rose-200 text-rose-600 rounded-lg sm:rounded-xl p-2 sm:p-3 text-[11px] sm:text-xs font-semibold text-center mb-4">{errorMsg}</div>}

      <div className="flex flex-row items-center bg-[#FEE5BD]/50 p-1 rounded-lg sm:rounded-xl mb-5 sm:mb-6 border border-[#FAAA6B]/50 w-full">
        <button type="button" onClick={() => { setIsLoginTab(true); setErrorMsg(''); }} className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-md sm:rounded-lg transition-all cursor-pointer ${isLoginTab ? 'bg-white text-[#6E2D16] border border-[#FAAA6B]/30 shadow-sm' : 'text-[#6E2D16]/60 hover:text-[#6E2D16]'}`}>Entrar</button>
        <button type="button" onClick={() => { setIsLoginTab(false); setErrorMsg(''); }} className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-md sm:rounded-lg transition-all cursor-pointer ${!isLoginTab ? 'bg-white text-[#6E2D16] border border-[#FAAA6B]/30 shadow-sm' : 'text-[#6E2D16]/60 hover:text-[#6E2D16]'}`}>Criar Negócio</button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 w-full">
        {!isLoginTab && (
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-[11px] font-bold text-[#6E2D16]/80 uppercase tracking-widest mb-1 sm:mb-1.5">Nome do Negócio</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: dcrocrotisseria" className="w-full bg-white border border-[#FAAA6B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-[#6E2D16] placeholder-[#6E2D16]/40 focus:outline-none focus:ring-2 focus:ring-[#f05632] transition-all" required />
          </div>
        )}
        
        <div className="flex flex-col">
          <label className="text-[10px] sm:text-[11px] font-bold text-[#6E2D16]/80 uppercase tracking-widest mb-1 sm:mb-1.5">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lojista@email.com" className="w-full bg-white border border-[#FAAA6B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-[#6E2D16] placeholder-[#6E2D16]/40 focus:outline-none focus:ring-2 focus:ring-[#f05632] transition-all" required />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] sm:text-[11px] font-bold text-[#6E2D16]/80 uppercase tracking-widest mb-1 sm:mb-1.5">Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-[#FAAA6B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-[#6E2D16] placeholder-[#6E2D16]/40 focus:outline-none focus:ring-2 focus:ring-[#f05632] transition-all" required />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-[#6E2D16] hover:bg-[#8B3B1E] disabled:bg-[#6E2D16]/50 text-[#FEE5BD] font-semibold py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition duration-150 shadow-md shadow-[#6E2D16]/10 cursor-pointer text-xs sm:text-sm mt-1 sm:mt-2">
          {isLoading ? 'Processando...' : isLoginTab ? 'Acessar Painel' : 'Inicializar Loja'}
        </button>
      </form>
      <div className="flex justify-center mt-5 sm:mt-6">
        <Link to="/" className="text-xs sm:text-sm font-semibold text-[#6E2D16]/70 hover:text-[#f05632] transition">← Cancelar Autenticação</Link>
      </div>
    </div>
  );
};

// Component wrapper with seamless theme transitions
function AppContent() {
  const location = useLocation();
  const isCreamTheme = location.pathname === '/' || location.pathname === '/owner';

  return (
    <main
      className={`relative font-sans min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden ${
        isCreamTheme
          ? 'bg-[#FEE5BD] selection:bg-[#FAAA6B] selection:text-[#6E2D16] p-4 sm:p-6 lg:p-8'
          : 'bg-[#0a0e10] selection:bg-emerald-400/30 p-0'
      }`}
    >
      {isCreamTheme && <Header />}
<div className="absolute left-1/2 top-1/3 h-[12rem] w-[75rem] -translate-x-1/2 rounded-full bg-[#da7e7e] blur-[110px]" />
      {isCreamTheme && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#FAAA6B_1px,transparent_1px),linear-gradient(to_bottom,#FAAA6B_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30"></div>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[20rem] sm:w-[28rem] h-[20rem] sm:h-[28rem] bg-[#FAAA6B]/40 rounded-full blur-[100px] sm:blur-[140px]"></div>
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[20rem] sm:w-[28rem] h-[20rem] sm:h-[28rem] bg-[#f05632]/10 rounded-full blur-[100px] sm:blur-[140px]"></div>
        </div>
      )}

      <div className={`relative z-10 w-full flex items-center justify-center ${isCreamTheme ? 'min-h-[calc(100vh-2rem)] sm:min-h-0 pt-10' : 'min-h-screen'}`}>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/owner/gallery" element={<OwnerGallery />} />
          <Route path="/customer/gallery" element={<CustomerGallery />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/console" element={<OwnerDashBoard />} />
          <Route path="/customer/console" element={<CustomerDashBoard />} />
        </Routes>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
