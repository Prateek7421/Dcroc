import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  ArrowLeft, Server, Check, Clock, ShoppingCart, User, Package, DollarSign 
} from 'lucide-react';

export default function IncomingRequests() {
  const location = useLocation();
  const businessCode = location.state?.businessCode || "BIZ-9482";

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Pending Orders
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://stockpulse-lxml.onrender.com/api/orders/${businessCode}`);
        setOrders(response.data.filter(order => order.status === 'Pending'));
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingOrders();
  }, [businessCode]);

  // WebSocket Real-time Updates
  useEffect(() => {
    const socket = io('https://stockpulse-lxml.onrender.com');
    socket.emit('join_business_room', businessCode);

    socket.on('new_order_incoming', (data) => {
      if (data.order && data.order.status === 'Pending') {
        setOrders(prev => [data.order, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [businessCode]);

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await axios.put(`https://stockpulse-lxml.onrender.com/api/orders/${orderId}/approve`);
      if (response.data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to approve order');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-[1100px] mx-auto mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl shadow-black/50">
          <div className="flex items-center gap-4">
            <Link 
              to="/owner/console" 
              state={{ businessCode }}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl border border-zinc-700 text-zinc-400 hover:text-amber-400 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Incoming Orders</h1>
              <div className="flex items-center gap-3 mt-1">
                <Server className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-sm text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {businessCode}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 sm:mt-0 bg-zinc-950 border border-zinc-800 px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Live Queue</span>
                <p className="text-xl font-bold text-white -mt-0.5">{orders.length} Pending</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto">
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-400">Loading incoming requests...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-3xl text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <ShoppingCart className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-zinc-300">No Pending Orders</h3>
            <p className="text-zinc-500 mt-2 max-w-sm mx-auto">
              New customer requests will appear here in real-time
            </p>
          </div>
        )}

        {/* Orders List */}


        {/* Orders List - Compact Cards */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-3xl p-5 md:p-6 transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-zinc-800 p-3 rounded-2xl">
                      <User className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{order.customerName}</p>
                      <p className="text-xs font-mono text-zinc-500">Order • {order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-950/80 rounded-2xl px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-amber-400">[{item.quantity}x]</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-mono text-zinc-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-72 flex-shrink-0 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="text-center">
                    <span className="uppercase text-[10px] tracking-widest text-zinc-500">Total</span>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-yellow-400 mt-1">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApproveOrder(order._id)}
                    className="mt-6 w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Approve Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
