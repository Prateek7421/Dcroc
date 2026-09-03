import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Landmark, Calendar, User, Hash, ShieldCheck, FileText 
} from 'lucide-react';

export default function TransactionHistory() {
  const location = useLocation();
  const businessCode = location.state?.businessCode || "BIZ-9482";

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoryLedger = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://stockpulse-lxml.onrender.com/api/orders/${businessCode}/history`);
        setHistory(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to pull transaction ledger archive.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistoryLedger();
  }, [businessCode]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 p-3 sm:p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="max-w-[1200px] mx-auto mb-6 sm:mb-10">
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
            <Link 
              to="/owner/console" 
              state={{ businessCode }}
              className="p-2.5 sm:p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl sm:rounded-2xl border border-zinc-700 text-zinc-400 hover:text-amber-400 transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">Transaction History</h1>
              <div className="flex items-center gap-2 sm:gap-3 mt-1">
                <span className="text-[10px] sm:text-xs font-medium text-zinc-500 shrink-0">NODE ID</span>
                <span className="font-mono text-xs sm:text-sm bg-amber-500/10 text-amber-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-amber-500/30 truncate">
                  {businessCode}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 bg-zinc-950 border border-zinc-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shrink-0">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-bold">Total Transactions</span>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white -mt-0.5 sm:-mt-1">{history.length} <span className="hidden sm:inline">Transactions</span></p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto">
        {isLoading && (
          <div className="text-center py-16 sm:py-20">
            <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-zinc-400">Reading secure cryptographic records...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center max-w-md mx-auto text-sm sm:text-base">
            {error}
          </div>
        )}

        {!isLoading && !error && history.length === 0 && (
          <div className="text-center py-16 sm:py-24 border border-dashed border-zinc-800 rounded-2xl sm:rounded-3xl bg-zinc-900/30 px-4">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-600 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-300">Ledger Empty</h3>
            <p className="text-sm sm:text-base text-zinc-500 mt-2 sm:mt-3 max-w-sm mx-auto">
              No processed settlements matched this business signature profile.
            </p>
          </div>
        )}

        <div className="space-y-4 sm:space-y-5">
          {history.map((tx) => (
            <div 
              key={tx._id} 
              className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className="bg-zinc-800 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-base sm:text-lg truncate">{tx.customerName}</p>
                      <div className="text-[10px] sm:text-xs text-zinc-500 flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 truncate">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span className="truncate">Approved: {formatDate(tx.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Manifest Details</p>
                    {tx.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-950 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <span className="text-amber-400 font-mono shrink-0">{item.quantity}x</span>
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="font-mono text-zinc-400 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel - Total (Adaptive Row on Mobile, Col on Desktop) */}
                <div className="lg:w-64 xl:w-72 shrink-0 bg-zinc-950 border border-zinc-800 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center text-left lg:text-center mt-2 lg:mt-0">
                  <div className="flex flex-col lg:items-center">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 block mb-0.5 lg:mb-0">Settled Amount</p>
                    {/* Mobile Success Text */}
                    <div className="lg:hidden flex items-center gap-1 sm:gap-1.5 text-emerald-400 text-[10px] sm:text-xs font-bold mt-0.5">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> VERIFIED
                    </div>
                  </div>
                  
                  <div className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-200 to-teal-400 my-0 lg:my-3">
                    ${tx.totalAmount.toFixed(2)}
                  </div>

                  {/* Desktop Success Text */}
                  <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> VERIFIED
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
