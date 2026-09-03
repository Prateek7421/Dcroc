import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, CreditCard, Calendar, ShoppingBag, Hash, CheckCircle2, ReceiptText 
} from 'lucide-react';

export default function CustomerTransactionHistory() {
  const location = useLocation();
  const customerId = location.state?.customerId;
  const businessCode = location.state?.businessCode;
  const email = location.state?.email;

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://stockpulse-lxml.onrender.com/api/orders/customer/${email}/history`);
        setHistory(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load transaction history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerHistory();
  }, [email]);

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
      
      {/* Enhanced Header */}
      <header className="max-w-[1200px] mx-auto mb-6 sm:mb-10">
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
            <Link 
              to="/customer/console" 
              state={{ customerId, businessCode }}
              className="p-2.5 sm:p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl sm:rounded-2xl border border-zinc-700 text-zinc-400 hover:text-amber-400 transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">Transaction History</h1>
              <div className="flex items-center gap-2 sm:gap-3 mt-1">
                <span className="text-[10px] sm:text-xs font-medium text-zinc-500 shrink-0">ACCOUNT</span>
                <span className="font-mono text-xs sm:text-sm bg-amber-500/10 text-amber-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-amber-500/30 truncate">
                  {customerId || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 bg-zinc-950 border border-zinc-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shrink-0">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
              <div>
                <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-bold">Total Transactions</span>
                <p className="text-xl sm:text-2xl font-bold text-white -mt-0.5 sm:-mt-1">{history.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto">
        {isLoading && (
          <div className="text-center py-16 sm:py-20">
            <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-zinc-400">Loading your purchase history...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center max-w-md mx-auto text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && history.length === 0 && (
          <div className="text-center py-16 sm:py-24 border border-dashed border-zinc-800 rounded-2xl sm:rounded-3xl bg-zinc-900/30 px-4">
            <ReceiptText className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-600 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-300">No Transactions Yet</h3>
            <p className="text-sm sm:text-base text-zinc-500 mt-2 sm:mt-3 max-w-sm mx-auto">
              Your completed orders will appear here once you make a purchase.
            </p>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-4 sm:space-y-6">
          {history.map((tx) => (
            <div 
              key={tx._id} 
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 transition-all duration-300 group flex flex-col"
            >
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                
                {/* Left Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="bg-zinc-800 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shrink-0">
                        <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-lg sm:text-xl truncate">{tx.businessName || "Merchant"}</p>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="truncate">{formatDate(tx.createdAt || tx.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-emerald-500/20 shrink-0 mt-1 sm:mt-0">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Completed
                    </div>
                  </div>

                  {/* Receipt ID */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-zinc-500 mb-4 sm:mb-6 truncate">
                    <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    Receipt #{tx._id.slice(-10)}
                  </div>

                  {/* Items */}
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 sm:mb-3">ORDER ITEMS</p>
                    {tx.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-base gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <span className="text-amber-400 font-mono font-medium bg-zinc-900 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shrink-0">
                            {item.quantity}x
                          </span>
                          <span className="font-medium truncate">{item.name}</span>
                        </div>
                        <span className="font-mono text-zinc-400 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel - Total (Adaptive Row on Mobile, Col on Desktop) */}
                <div className="lg:w-72 xl:w-80 shrink-0 bg-zinc-950 border border-zinc-800 rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-row lg:flex-col items-center justify-between lg:justify-center text-left lg:text-center mt-2 lg:mt-0">
                  <div className="flex flex-col lg:items-center">
                    <p className="uppercase text-[10px] sm:text-xs tracking-widest text-zinc-500 font-bold mb-0.5 lg:mb-2 block">Amount Paid</p>
                    {/* Mobile Success Text */}
                    <div className="lg:hidden text-[10px] sm:text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Successful
                    </div>
                  </div>
                  
                  <div className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-500 my-0 lg:my-4">
                    ${tx.totalAmount.toFixed(2)}
                  </div>

                  {/* Desktop Success Text */}
                  <div className="hidden lg:flex text-xs text-emerald-400 font-medium items-center justify-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Payment Successful
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
