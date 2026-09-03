import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Trash2, X, Image as ImageIcon, Film, Upload, Play, Sparkles, ArrowLeft, Loader2
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function OwnerGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State matching backend schema fields (title, description, mediaType, mediaBase64)
  const [formData, setFormData] = useState({
    type: 'image', // 'image' or 'video'
    title: '',
    description: '',
    mediaPreview: '',
    mediaBase64: '' 
  });

  // --- FETCH GALLERY DATA ON LOAD ---
  useEffect(() => {
    fetchGallery();
  }, []);

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

  // --- HANDLERS ---
  const filteredMedia = mediaItems.filter(item => 
    filter === 'all' ? true : item.mediaType === filter
  );

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        mediaPreview: event.target.result,
        mediaBase64: event.target.result 
      }));
    };
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mediaBase64) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title || "Novidade D'Croc",
        description: formData.description,
        mediaType: formData.type,
        mediaBase64: formData.mediaBase64
      };

      const response = await axios.post(`${API_BASE_URL}/gallery/owner`, payload);
      
      // Prepend newly created item to state
      setMediaItems([response.data, ...mediaItems]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ type: 'image', title: '', description: '', mediaPreview: '', mediaBase64: '' });
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.response?.data?.error || "Falha ao enviar a mídia.");
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Excluir esta mídia da sua galeria?")) {
      try {
        await axios.delete(`${API_BASE_URL}/gallery/owner/${id}`);
        setMediaItems(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Falha ao excluir a mídia.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FEE5BD] font-sans text-[#6E2D16] selection:bg-[#FAAA6B] selection:text-[#6E2D16] relative pb-10">
      
      {/* TINTED BACKGROUND */}
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
                <Sparkles className="h-3 w-3" /> Marketing & Divulgação
              </p>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#6E2D16] sm:text-3xl">
                Galeria e Reels
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/owner/console"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#FAAA6B]/50 bg-[#FEE5BD]/50 px-5 text-sm font-semibold text-[#6E2D16] transition-all hover:-translate-y-0.5 hover:border-[#f05632] hover:bg-[#FAAA6B]/30 shadow-sm backdrop-blur-md"
            >
              <ArrowLeft className="h-4 w-4 text-[#f05632] transition-transform group-hover:-translate-x-1" />
              Voltar ao Estoque
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        
        {/* TOOLBAR */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/40 border border-[#FAAA6B]/40 p-4 sm:p-5 rounded-[1.5rem] backdrop-blur-xl shadow-[0_8px_30px_rgba(110,45,22,0.04)]">
          
          {/* Filters */}
          <div className="flex bg-[#FEE5BD]/60 p-1.5 rounded-xl border border-[#FAAA6B]/50 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white text-[#f05632] shadow-sm' : 'text-[#6E2D16]/70 hover:text-[#6E2D16]'}`}
            >
              Tudo
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'image' ? 'bg-white text-[#f05632] shadow-sm' : 'text-[#6E2D16]/70 hover:text-[#6E2D16]'}`}
            >
              <ImageIcon className="w-4 h-4" /> Fotos
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'video' ? 'bg-white text-[#f05632] shadow-sm' : 'text-[#6E2D16]/70 hover:text-[#6E2D16]'}`}
            >
              <Film className="w-4 h-4" /> Reels
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#f05632] hover:bg-[#d94a28] active:scale-[0.98] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#f05632]/30 text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            Adicionar Mídia
          </button>
        </div>

        {/* MEDIA GRID */}
        <main className="z-10 relative">
          {isLoading ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2rem] border border-[#FAAA6B]/40 bg-white/40 px-6 text-center shadow-lg backdrop-blur-md">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#f05632]" />
              <p className="text-sm font-medium text-[#6E2D16]/70">Carregando galeria...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#FAAA6B] bg-white/40 px-6 text-center shadow-lg backdrop-blur-md">
              <ImageIcon className="mb-4 h-12 w-12 text-[#f05632]" strokeWidth={1.5} />
              <p className="max-w-md font-serif text-2xl font-bold text-[#6E2D16]">Sua galeria está vazia.</p>
              <p className="mt-2 text-sm text-[#6E2D16]/60">Mostre aos seus clientes o lado delicioso do seu negócio!</p>
              
              {mediaItems.length === 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 bg-[#f05632] hover:bg-[#d94a28] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#f05632]/30 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Primeira Mídia
                </button>
              )}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  className="break-inside-avoid group overflow-hidden rounded-[1.7rem] border border-[#FAAA6B]/60 bg-white/50 shadow-[0_8px_30px_rgba(110,45,22,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#f05632] hover:shadow-[0_22px_50px_rgba(240,86,50,0.2)] flex flex-col"
                >
                  {/* Media Display */}
                  <div className="relative w-full bg-black/5 overflow-hidden m-2 rounded-[1.2rem] shadow-inner" style={{ width: 'calc(100% - 16px)' }}>
                    {item.mediaType === 'video' ? (
                      <div className="relative">
                        <video 
                          src={item.mediaUrl} 
                          className="w-full h-auto max-h-[500px] object-cover" 
                          controls
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-white/90 text-[0.65rem] font-bold tracking-wide">
                          <Film className="w-3 h-3 text-rose-400" /> REEL
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={item.mediaUrl}
                          alt={item.title || "Galeria"}
                          className="w-full h-auto object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-white/90 text-[0.65rem] font-bold tracking-wide">
                          <ImageIcon className="w-3 h-3 text-emerald-400" /> FOTO
                        </div>
                      </div>
                    )}
                    
                    {/* Delete Button (Appears on Hover) */}
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-rose-500 hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all text-rose-600 shadow-lg scale-90 group-hover:scale-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Title & Description */}
                  {(item.title || item.description) && (
                    <div className="px-5 pt-3 pb-5 flex flex-col">
                      {item.title && (
                        <h3 className="font-bold text-base text-[#6E2D16] mb-1">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-sm font-medium leading-relaxed text-[#6E2D16]/90 whitespace-pre-wrap">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ================= ADD MEDIA MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#6E2D16]/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FEE5BD] border-2 border-[#FAAA6B] rounded-[2rem] w-full max-w-lg shadow-2xl my-auto overflow-hidden relative">

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#FAAA6B]/40 bg-white/60 backdrop-blur-md">
              <h2 className="text-2xl font-serif font-bold text-[#6E2D16] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f05632]" />
                Nova Publicação
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6E2D16]/50 hover:text-[#f05632] p-2 transition-colors rounded-full hover:bg-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 bg-white/30 backdrop-blur-sm">
              
              {/* Type Selector */}
              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-[#6E2D16]/80 mb-2 font-bold">
                  Tipo de Mídia
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'image', mediaPreview: ''})}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.type === 'image' ? 'border-[#f05632] bg-white text-[#f05632] shadow-sm' : 'border-[#FAAA6B]/40 bg-white/50 text-[#6E2D16]/60 hover:bg-white/80'}`}
                  >
                    <ImageIcon className="w-5 h-5" /> Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'video', mediaPreview: ''})}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.type === 'video' ? 'border-[#f05632] bg-white text-[#f05632] shadow-sm' : 'border-[#FAAA6B]/40 bg-white/50 text-[#6E2D16]/60 hover:bg-white/80'}`}
                  >
                    <Film className="w-5 h-5" /> Reel / Vídeo
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-[#6E2D16]/80 mb-2 font-bold">
                  Arquivo ({formData.type === 'image' ? 'Foto' : 'Vídeo'})
                </label>
                
                {formData.mediaPreview ? (
                  <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#FAAA6B] bg-black/5 shrink-0 shadow-md flex items-center justify-center min-h-[200px]">
                    {formData.type === 'video' ? (
                      <video src={formData.mediaPreview} className="w-full h-auto max-h-[300px]" controls />
                    ) : (
                      <img src={formData.mediaPreview} alt="preview" className="object-contain w-full h-auto max-h-[300px]" />
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, mediaPreview: '', mediaBase64: ''})}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-rose-500 hover:text-white p-2 rounded-full transition-all text-[#6E2D16] shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full bg-white/60 border-2 border-dashed border-[#FAAA6B] hover:border-[#f05632] hover:bg-white rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center group shadow-sm min-h-[200px]">
                    {formData.type === 'video' ? (
                      <Play className="w-8 h-8 mb-3 text-[#FAAA6B] group-hover:text-[#f05632] transition-colors" fill="currentColor" />
                    ) : (
                      <Upload className="w-8 h-8 mb-3 text-[#FAAA6B] group-hover:text-[#f05632] transition-colors" />
                    )}
                    <div className="font-bold text-sm text-[#6E2D16]">
                      {formData.type === 'image' ? 'Clique para selecionar uma foto' : 'Clique para selecionar um vídeo'}
                    </div>
                    <p className="text-xs text-[#6E2D16]/50 mt-1">
                      {formData.type === 'image' ? 'PNG, JPG ou WEBP' : 'MP4 ou MOV (Máx 50MB)'}
                    </p>
                    <input
                      type="file"
                      accept={formData.type === 'image' ? "image/*" : "video/*"}
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-[#6E2D16]/80 mb-1.5 font-bold">
                  Título (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/80 border border-[#FAAA6B]/60 focus:border-[#f05632] focus:ring-2 focus:ring-[#f05632]/20 rounded-xl px-4 py-3 text-sm font-semibold text-[#6E2D16] focus:outline-none transition-all placeholder:text-[#6E2D16]/40 shadow-sm"
                  placeholder="Ex: Torta Fresca do Dia"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[0.65rem] uppercase tracking-wider text-[#6E2D16]/80 mb-1.5 font-bold">
                  Legenda / Descrição
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/80 border border-[#FAAA6B]/60 focus:border-[#f05632] focus:ring-2 focus:ring-[#f05632]/20 rounded-xl px-4 py-3 text-sm font-medium text-[#6E2D16] focus:outline-none transition-all placeholder:text-[#6E2D16]/40 shadow-sm resize-none"
                  placeholder="Escreva algo chamativo sobre essa publicação..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.mediaPreview}
                className="w-full py-4 mt-2 bg-[#f05632] hover:bg-[#d94a28] active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#f05632]/30 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 shrink-0" />
                )}
                {isSubmitting ? 'Publicando no Cloudinary...' : 'Publicar na Galeria'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}