import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Image as ImageIcon, Film, Sparkles, Phone, Loader2
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://dcrocbackend.onrender.com/api';

export default function CustomerGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'

  // --- FETCH GALLERY DATA FROM BACKEND ---
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/gallery/customer`);
        setMediaItems(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filter logic (matching schema field: mediaType)
  const filteredMedia = mediaItems.filter(item => 
    filter === 'all' ? true : item.mediaType === filter
  );

  return (
    <div className="min-h-screen w-full bg-[#FEE5BD] font-sans text-[#6E2D16] selection:bg-[#FAAA6B] selection:text-[#6E2D16] relative pb-12">
      
      {/* BACKGROUND WITH YOUR CUSTOM TINT */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute left-1/2 top-1/3 h-[12rem] w-[75rem] -translate-x-1/2 rounded-full bg-[#da7e7e] blur-[110px]" />
        <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#FAAA6B]/40 blur-[120px]" />
        <div className="absolute -bottom-48 -right-28 h-[34rem] w-[34rem] rounded-full bg-[#f05632]/15 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#6E2D16_1px,transparent_1px),linear-gradient(90deg,#6E2D16_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* FULL-WIDTH STICKY HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-[#FAAA6B]/40 bg-[#FEE5BD]/85 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-12 shadow-[0_20px_50px_rgba(110,45,22,0.08)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <img
              src="https://res.cloudinary.com/jvuks1bl/image/upload/v1786024305/dcroc_rxnakn.jpg"
              alt="D'Croc Rotisseria Logo"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover shadow-[0_8px_20px_rgba(110,45,22,0.15)] border-2 border-[#FAAA6B] shrink-0"
            />
            <div>
              <p className="mb-0.5 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f05632]">
                <Sparkles className="h-3 w-3" /> Fique por dentro
              </p>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#6E2D16] sm:text-3xl">
                Nossa Galeria
              </h1>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/customer/console"
              className="group inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#FAAA6B]/50 bg-[#FEE5BD]/50 px-5 text-sm font-semibold text-[#6E2D16] transition-all hover:-translate-y-0.5 hover:border-[#f05632] hover:bg-[#FAAA6B]/30 sm:flex-none shadow-sm backdrop-blur-md"
            >
              <ArrowLeft className="h-4 w-4 text-[#f05632] transition-transform group-hover:-translate-x-1" />
              Ver Cardápio
            </Link>
            
            <a
              href=" https://wa.me/qr/FE6NIW2RPZFEO1"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#FAAA6B]/50 bg-[#FAAA6B]/20 px-5 text-sm font-semibold text-[#6E2D16] transition-all hover:-translate-y-0.5 hover:border-[#f05632] hover:bg-[#FAAA6B]/30 sm:flex-none shadow-sm backdrop-blur-md"
            >
              <Phone className="h-4 w-4 text-[#f05632] transition-transform group-hover:rotate-12" />
              Fazer Pedido
            </a>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        
        {/* TOOLBAR: FILTERS */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/40 border border-[#FAAA6B]/40 p-4 sm:p-5 rounded-[1.5rem] backdrop-blur-xl shadow-[0_8px_30px_rgba(110,45,22,0.04)]">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#6E2D16]">Ofertas e Novidades</h2>
            <p className="text-sm font-medium text-[#6E2D16]/70 mt-1">
              Acompanhe nossos preparos diários e produtos saindo do forno!
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex bg-[#FEE5BD]/60 p-1.5 rounded-xl border border-[#FAAA6B]/50 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white text-[#f05632] shadow-sm' : 'text-[#6E2D16]/70 hover:text-[#6E2D16]'}`}
            >
              Tudo
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'image' ? 'bg-white text-[#f05632] shadow-sm' : 'text-[#6E2D16]/70 hover:text-[#6E2D16]'}`}
            >
              <ImageIcon className="w-4 h-4" /> Fotos
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'video' ? 'bg-white text-[#f05632] shadow-sm' : 'text-[#6E2D16]/70 hover:text-[#6E2D16]'}`}
            >
              <Film className="w-4 h-4" /> Reels
            </button>
          </div>
        </div>

        {/* MEDIA GRID (Pinterest / Masonry Style) */}
        <main className="z-10 relative">
          {isLoading ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2rem] border border-[#FAAA6B]/40 bg-white/40 px-6 text-center shadow-lg backdrop-blur-md">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#f05632]" />
              <p className="text-sm font-medium text-[#6E2D16]/70">Carregando galeria...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#FAAA6B] bg-white/40 px-6 text-center shadow-lg backdrop-blur-md">
              <ImageIcon className="mb-4 h-12 w-12 text-[#f05632]/50" strokeWidth={1.5} />
              <p className="max-w-md font-serif text-2xl font-bold text-[#6E2D16]">Nenhuma novidade no momento.</p>
              <p className="mt-2 text-sm text-[#6E2D16]/60">Volte em breve para acompanhar nossos preparos!</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {filteredMedia.map((item) => (
                <article
                  key={item._id}
                  className="break-inside-avoid mb-6 group overflow-hidden rounded-[1.7rem] border border-[#FAAA6B]/60 bg-white/50 shadow-[0_8px_30px_rgba(110,45,22,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#f05632] hover:shadow-[0_22px_50px_rgba(240,86,50,0.2)] flex flex-col"
                >
                  {/* Media Display */}
                  <div className="relative w-full bg-black/5 overflow-hidden m-2 rounded-[1.2rem] shadow-inner" style={{ width: 'calc(100% - 16px)' }}>
                    {item.mediaType === 'video' ? (
                      <div className="relative">
                        <video 
                          src={item.mediaUrl} 
                          className="w-full h-auto max-h-[600px] object-cover" 
                          controls
                          controlsList="nodownload"
                        />
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-white/90 text-[0.65rem] font-bold tracking-wider">
                          <Film className="w-3 h-3 text-rose-400" /> REEL
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={item.mediaUrl}
                          alt={item.title || "Novidade D'Croc"}
                          className="w-full h-auto object-cover transition duration-700 group-hover:scale-[1.02]"
                        />
                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-white/90 text-[0.65rem] font-bold tracking-wider">
                          <ImageIcon className="w-3 h-3 text-[#FAAA6B]" /> FOTO
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Description / Title */}
                  {(item.title || item.description) && (
                    <div className="px-5 pt-3 pb-6 flex flex-col">
                      {item.title && (
                        <h3 className="font-bold text-base text-[#6E2D16] mb-1">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-[0.90rem] font-medium leading-relaxed text-[#6E2D16]/90 whitespace-pre-wrap">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Brand Tag */}
                      <div className="mt-4 pt-4 border-t border-[#6E2D16]/10 flex items-center justify-between text-[#6E2D16]/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#f05632]">D'Croc Rotisseria</span>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
