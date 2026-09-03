import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowUpRight,
  ChefHat,
  CircleUserRound,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Package,
  Phone,
  Sparkles,
  Search,
  ChevronDown,
  MapPin,
  Clock,
  X // <--- Ícone X adicionado aqui
} from 'lucide-react';

const API_BASE_URL = 'https://stockpulse-lxml.onrender.com/api';

const formatPrice = (price) => `R$ ${Number(price).toFixed(2).replace('.', ',')}`;

// ==========================================
// CUSTOM DROPDOWN COMPONENT
// ==========================================
const CustomDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full sm:w-[170px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-[#FEE5BD]/60 backdrop-blur-md border border-[#FAAA6B]/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#6E2D16] transition-all focus:outline-none focus:ring-2 focus:ring-[#f05632]/40 shadow-sm hover:bg-[#FEE5BD]/80"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-[#f05632] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-[#FEE5BD] border border-[#FAAA6B]/80 rounded-xl shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f05632] hover:text-white ${value === option.value ? 'bg-[#FAAA6B]/30 text-[#f05632]' : 'text-[#6E2D16]'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CustomerDashBoard() {
  const location = useLocation();
  const { username = 'Visitante' } = location.state || {};
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // ESTADO DO ZOOM DA IMAGEM
  const [zoomedImage, setZoomedImage] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStock, setFilterStock] = useState('all');

  // Contact Info Constants
  const WHATSAPP_LINK = "https://wa.me/qr/FE6NIW2RPZFEO1";
  const DISPLAY_PHONE = "+55 11 91261-1100";
  const INSTAGRAM_LINK = "https://www.instagram.com/dcroc_?utm_source=qr&igsh=MXFnNWJhOGZscjlwZg==";
  const MAPS_LINK = "https://share.google/qS15TOcA1UNMf5vZy";

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products`);
        setInventory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setErrorMessage(
          err.response?.data?.error ||
          err.message ||
          'Falha ao carregar o cardápio da loja.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // --- FILTER & SORT LOGIC ---
  useEffect(() => {
    let result = [...inventory];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(term));
    }

    if (filterStock === 'low') {
      result = result.filter(item => item.stock > 0 && item.stock <= 5);
    } else if (filterStock === 'out') {
      result = result.filter(item => item.stock <= 0);
    }

    result.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });

    setFilteredInventory(result);
  }, [inventory, searchTerm, sortBy, filterStock]);

  const sortOptions = [
    { value: 'name', label: 'Ordenar: Nome' },
    { value: 'price', label: 'Ordenar: Preço' },
    { value: 'stock', label: 'Ordenar: Estoque' },
  ];

  const stockOptions = [
    { value: 'all', label: 'Todo Estoque' },
    { value: 'low', label: 'Baixo Estoque' },
    { value: 'out', label: 'Esgotado' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FEE5BD] font-sans text-[#6E2D16] selection:bg-[#FAAA6B] selection:text-[#6E2D16] flex flex-col">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#FAAA6B]/30 blur-[120px]" />
        <div className="absolute -bottom-48 -right-28 h-[34rem] w-[34rem] rounded-full bg-[#f05632]/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/3 h-[12rem] w-[75rem] -translate-x-1/2 rounded-full bg-[#da7e7e] blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#6E2D16_1px,transparent_1px),linear-gradient(90deg,#6E2D16_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-[#FAAA6B]/40 bg-[#FEE5BD]/85 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-12 shadow-[0_20px_50px_rgba(110,45,22,0.08)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Logo on Left & Company Name */}
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src="https://res.cloudinary.com/jvuks1bl/image/upload/v1788457009/WhatsApp_Image_2026-09-03_at_21.55.42_dmsiav.jpg"
              alt="D'Croc Rotisseria Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover shadow-[0_8px_20px_rgba(110,45,22,0.15)] border-2 border-[#FAAA6B] shrink-0"
            />
            <div>
              <p className="mb-0.5 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f05632]">
                <Sparkles className="h-3 w-3" /> Cardápio Online
              </p>
              <h1 className="font-playball text-2xl font-bold tracking-tight text-[#6E2D16] sm:text-3xl">
                D'Croc Rotisseria e Congelados
              </h1>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/customer/gallery"
              className="group inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#FAAA6B]/50 bg-[#FAAA6B]/10 px-4 text-sm font-semibold text-[#6E2D16] transition-all hover:-translate-y-0.5 hover:border-[#f05632] hover:bg-[#FAAA6B]/20 sm:flex-none shadow-sm"
            >
              <ImageIcon className="h-4 w-4 text-[#f05632] transition-transform group-hover:scale-110" />
              Ofertas &amp; fotos
            </Link>
            
            <div className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#FAAA6B]/50 bg-[#FAAA6B]/20 px-4 text-sm text-[#6E2D16]/90 sm:w-auto shadow-sm">
              <CircleUserRound className="h-4 w-4 text-[#f05632]" />
              Olá, <strong className="max-w-[130px] truncate text-[#6E2D16]">{username}</strong>
            </div>
            <Link
              to="/"
              className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#f05632]/30 bg-[#f05632] px-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#d94a28] sm:w-auto shadow-md shadow-[#f05632]/20"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Sair
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 flex-grow mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

        {errorMessage && (
          <div className="mb-8 rounded-2xl border border-rose-300 bg-rose-100/50 backdrop-blur-md p-4 text-center text-sm font-medium text-rose-700 shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* TOOLBAR: SEARCH & FILTERS */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-white/40 border border-[#FAAA6B]/40 p-4 sm:p-5 rounded-[1.5rem] backdrop-blur-xl shadow-[0_8px_30px_rgba(110,45,22,0.04)]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FEE5BD] p-2.5 rounded-xl border border-[#FAAA6B]/50 shadow-inner">
              <Package className="w-6 h-6 text-[#f05632]" strokeWidth={1.75} />
            </div>
            <div>
              <p className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f05632]">Feito com carinho</p>
              <h2 className="text-xl sm:text-2xl  font-bold text-[#6E2D16]">Nossos Produtos</h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 z-20">
            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f05632] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FEE5BD]/60 backdrop-blur-md border border-[#FAAA6B]/80 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#f05632]/40 focus:border-[#f05632] placeholder:text-[#6E2D16]/50 text-[#6E2D16] transition-all shadow-sm"
              />
            </div>

            {/* CUSTOM DROPDOWNS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <CustomDropdown value={sortBy} options={sortOptions} onChange={setSortBy} />
              <CustomDropdown value={filterStock} options={stockOptions} onChange={setFilterStock} />
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <main className="z-10 relative">
          {isLoading ? (
            <div className="flex min-h-[46vh] flex-col items-center justify-center rounded-[2rem] border border-[#FAAA6B]/40 bg-[#FAAA6B]/10 shadow-lg backdrop-blur-md">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#f05632]" />
              <p className="text-sm font-medium text-[#6E2D16]/70">Preparando o cardápio...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="flex min-h-[46vh] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#FAAA6B] bg-white/40 px-6 text-center shadow-lg backdrop-blur-md">
              <Package className="mb-4 h-12 w-12 text-[#f05632]" strokeWidth={1.5} />
              <p className="max-w-md  text-2xl font-bold text-[#6E2D16]">Nenhum produto encontrado.</p>
              <p className="mt-2 text-sm text-[#6E2D16]/70">Tente ajustar seus filtros de busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredInventory.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 5;

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-[1.7rem] border border-[#FAAA6B]/50 bg-white/50 shadow-[0_8px_30px_rgba(110,45,22,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#f05632] hover:shadow-[0_22px_50px_rgba(240,86,50,0.15)] flex flex-col"
                  >
                    {/* Alterado para object-cover e removido o m-2 para ocupar a área toda */}
                    <div className="relative h-48 overflow-hidden bg-[#FEE5BD]/80 sm:h-52 shadow-inner">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          onClick={() => setZoomedImage(product.imageUrl)}
                          title="Clique para ampliar"
                          className="h-55 w-82 object-cover cursor-pointer transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#FAAA6B_0%,transparent_70%)]">
                          <ChefHat className="h-16 w-16 text-[#6E2D16]/30" strokeWidth={1.2} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Stock Badge */}
                      <div className={`absolute right-3 top-3 rounded-lg px-2.5 py-1 text-[0.65rem] font-bold tracking-wide shadow-sm backdrop-blur-md border border-white/20 flex items-center gap-1.5 ${isOutOfStock ? 'bg-rose-100/90 text-rose-700' :
                          isLowStock ? 'bg-amber-100/90 text-amber-700' :
                            'bg-white/90 text-[#6E2D16]'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {isOutOfStock ? 'Esgotado' : isLowStock ? `Últimas ${product.stock}` : `${product.stock} un.`}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <h3 className="line-clamp-2 min-h-[3rem]  text-lg font-bold leading-tight text-[#6E2D16] transition-colors group-hover:text-[#f05632]">
                        {product.name}
                      </h3>
                      <div className="mt-4 flex items-end justify-between border-t border-[#6E2D16]/10 pt-4">
                        <div>
                          <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#6E2D16]/60">A partir de</p>
                          <p className="text-2xl font-extrabold tracking-tight text-[#f05632]">{formatPrice(product.price)}</p>
                        </div>
                        
                        {/* Link dinâmico para pedir no WhatsApp */}
                        <a 
                          href={`${WHATSAPP_LINK}?text=Olá! Gostaria de pedir: ${product.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-xl bg-[#f05632]/10 flex items-center justify-center text-[#f05632] transition-all group-hover:bg-[#f05632] group-hover:text-white"
                          title="Pedir no WhatsApp"
                        >
                          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:scale-110" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ================= FULL-SCREEN IMAGE ZOOM MODAL ================= */}
      {/* Usamos object-contain para a imagem aberta não ser cortada */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors backdrop-blur-md z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed Product"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* RICH FOOTER WITH CONTACT INFO - ORGANIZED IN SEPARATED COLUMNS */}
      <footer className="relative z-10 w-full border-t border-[#FAAA6B]/50 bg-white/40 backdrop-blur-xl mt-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 lg:py-12">
          
          {/* Grid Layout with Vertical Dividers on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x divide-[#FAAA6B]/90">
            
            {/* 1. Branding Section */}
            <div className="flex flex-col gap-4 lg:pr-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://res.cloudinary.com/jvuks1bl/image/upload/v1788457009/WhatsApp_Image_2026-09-03_at_21.55.42_dmsiav.jpg"
                  alt="Logo"
                  className="h-16 w-16 rounded-full border-2 border-[#FAAA6B] shadow-sm"
                />
                <h3 className=" text-2xl font-playball font-bold text-[#6E2D16] leading-tight">D'Croc Rotisseria e Congelados</h3>
              </div>
              <p className="text-sm font-medium text-[#6E2D16]/70 leading-relaxed">
                Sabores artesanais que encantam, preparados com muito amor e carinho para a sua mesa.
              </p>
            </div>

            {/* 2. Address */}
            <div className="flex flex-col gap-3 lg:px-8">
              <h4 className="font-bold text-[#6E2D16] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f05632]" />
                Endereço
              </h4>
              <p className="text-sm font-medium text-[#6E2D16]/80 leading-relaxed">
                Rua Guadalupe, 49<br />
                Santo André - SP
              </p>
              <a 
                href={MAPS_LINK} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-bold text-[#f05632] hover:underline flex items-center gap-1 w-fit mt-1"
              >
                Abrir no Google Maps <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Working Hours */}
            <div className="flex flex-col gap-3 lg:px-8">
              <h4 className="font-bold text-[#6E2D16] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f05632]" />
                Horário de Atendimento
              </h4>
              <ul className="text-sm font-medium text-[#6E2D16]/80 space-y-2">
                <li className="flex justify-between">
                  <span>Terça a Sábado:</span>
                  <span className="font-bold">09:00 às 18:00</span>
                </li>
                <li className="flex justify-between border-t border-[#FAAA6B]/20 pt-2">
                  <span>Domingo:</span>
                  <span className="font-bold text-[#f05632]">09:00 às 13:00</span>
                </li>
              </ul>
            </div>

            {/* 4. Contact & Socials */}
            <div className="flex flex-col gap-4 lg:pl-8">
              <h4 className="font-bold text-[#6E2D16] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f05632]" />
                Contato : {DISPLAY_PHONE}
              </h4>
              
              {/* WhatsApp Button */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl transition-all shadow-md font-semibold group w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="transition-transform group-hover:scale-110">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
                Fazer Pedido
              </a>

              {/* Follow Us (Instagram) */}
              <div className="flex items-center gap-3 mt-2">
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-white hover:bg-gray-50 text-[#E1306C] p-3 rounded-xl transition-all shadow-sm border border-[#FAAA6B]/50 group"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <div>
                  <p className="text-xs font-bold text-[#6E2D16]/60 uppercase tracking-wider">Acompanhe-nos</p>
                  <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#f05632] hover:underline">
                    @dcroc_
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Copyright Bar */}
          <div className="mt-12 pt-6 border-t border-[#FAAA6B]/90 text-center text-xs font-semibold text-[#6E2D16]/90">
            &copy; {new Date().getFullYear()} D'Croc Rotisseria. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}
