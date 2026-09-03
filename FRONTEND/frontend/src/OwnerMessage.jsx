import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, UserSquare2, MessageSquare, ArrowLeft } from 'lucide-react';
import ChatPanel from './ChatPanel';

export default function OwnerMessages() {
  const location = useLocation();
  const { name, businessCode, email } = location.state || {};

  const [activeCustomer, setActiveCustomer] = useState(null);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (!businessCode) return;
    axios.get(`https://stockpulse-lxml.onrender.com/api/messages/business/${businessCode}/connections`)
      .then(res => setConnections(res.data))
      .catch(err => console.error(err));
  }, [businessCode]);

  return (
    <div className="h-[100dvh] w-full bg-[#09090b] p-3 sm:p-4 md:p-6 flex flex-col overflow-hidden font-sans">
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col min-h-0 space-y-3 sm:space-y-4">
        
        {/* Header Block */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link 
            to="/owner/console" 
            state={{ businessCode }}
            className="p-2 sm:p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl sm:rounded-2xl border border-zinc-700 text-zinc-400 hover:text-amber-400 transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white truncate">Owner Messages</h1>
            <p className="text-[10px] sm:text-xs text-zinc-500 truncate">Business Node • {businessCode}</p>
          </div>
        </div>

        {/* Full-Screen Split Layout */}
        <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row gap-4 sm:gap-6">
          
          {/* Customers Sidebar */}
          <div className={`w-full lg:w-80 xl:w-96 shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden ${activeCustomer ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                <h2 className="font-semibold text-white text-sm sm:text-base">Active Customers</h2>
              </div>
              <span className="bg-zinc-800 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono text-zinc-400 shrink-0">
                {connections.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 sm:space-y-2 custom-scrollbar">
              {connections.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-4">
                  <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-40" />
                  <p className="text-sm sm:text-base">No active conversations</p>
                </div>
              ) : (
                connections.map((cust) => (
                  <button
                    key={cust._id}
                    onClick={() => setActiveCustomer(cust)}
                    className={`w-full flex items-center gap-3 sm:gap-4 p-3 rounded-xl sm:rounded-2xl transition-all border ${
                      activeCustomer?._id === cust._id 
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                        : 'border-transparent hover:bg-zinc-800'
                    }`}
                  >
                    <div className="bg-zinc-800 p-2 sm:p-2.5 rounded-xl shrink-0">
                      <UserSquare2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-semibold text-sm sm:text-base text-white truncate">{cust.username}</p>
                      <p className="text-[10px] sm:text-xs font-mono text-zinc-500 truncate">{cust._id}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Expansive Chat Area */}
          <div className={`flex-1 min-w-0 flex flex-col w-full h-full ${!activeCustomer ? 'hidden lg:flex' : 'flex'}`}>
            {activeCustomer ? (
              <div className="flex-1 min-h-0 flex flex-col w-full">
                
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setActiveCustomer(null)}
                  className="lg:hidden self-start flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 mb-3 rounded-lg transition-colors border border-zinc-700 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" /> Back to Customers
                </button>
                
                <ChatPanel 
                  businessCode={businessCode}
                  roomId={`${businessCode}-${activeCustomer._id}`}
                  senderName={name || "Owner"}
                  senderRole="owner"
                  senderEmail={email}
                />
              </div>
            ) : (
              <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl sm:rounded-3xl h-full flex flex-col items-center justify-center text-center px-4 sm:px-8">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 text-zinc-600" />
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-300 mb-2">Select a Customer</h3>
                <p className="text-sm sm:text-base text-zinc-500 max-w-xs sm:max-w-sm">
                  Choose a customer from the left sidebar to open a secure chat session
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          @media (min-width: 640px) { .custom-scrollbar::-webkit-scrollbar { width: 6px; } }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d97706; }
        `
      }} />
    </div>
  );
}
