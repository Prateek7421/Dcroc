import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, MessageSquare } from 'lucide-react';

const SOCKET_URL = 'https://stockpulse-lxml.onrender.com';

export default function ChatPanel({ 
  businessCode, 
  roomId, 
  senderName, 
  senderRole, 
  senderEmail 
}) {
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);

 useEffect(() => {
    if (!roomId) return;

    axios.get(`${SOCKET_URL}/api/messages/room/${roomId}`)
      .then(res => setMessages(res.data || []))
      .catch(err => console.error(err));

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join_private_room', roomId);

    // THIS IS THE CRUCIAL FIX 
    socketRef.current.on('receive_private_message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => socketRef.current?.disconnect();
  }, [roomId]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageData = {
      businessCode,
      roomId,
      senderRole,
      senderName,
      senderEmail,
      text: inputMessage.trim()
    };

    socketRef.current.emit('send_private_message', messageData);
    setInputMessage('');
  };

  const isSender = (msg) => 
    msg.senderEmail === senderEmail && msg.senderRole === senderRole;

  return (
    <div className="flex flex-col w-full h-[75vh] min-h-[400px] sm:h-[640px] bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Chat Header */}
      <div className="h-14 sm:h-16 border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6 flex items-center shrink-0">
        <div className="flex flex-col justify-center">
          <h2 className="font-semibold text-white text-sm sm:text-base">Live Support Chat</h2>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-400">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#0a0a0a]"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 px-4 text-center">
            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-40" />
            <p className="text-base sm:text-lg font-medium">No messages yet</p>
            <p className="text-xs sm:text-sm mt-1">Send a message to begin</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const me = isSender(msg);
            return (
              <div key={msg._id || index} className={`flex w-full ${me ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] ${me ? 'items-end' : 'items-start'} flex flex-col`}>
                  
                  {/* Sender Name */}
                  <span className={`text-[10px] sm:text-xs mb-1 px-1 ${me ? 'text-amber-400' : 'text-zinc-500'}`}>
                    {msg.senderName}
                  </span>

                  {/* Message Bubble */}
                  <div 
                    className={`px-3.5 sm:px-4 py-2 sm:py-3 rounded-2xl sm:rounded-3xl text-sm sm:text-[15px] leading-relaxed break-words w-full ${
                      me 
                        ? 'bg-amber-500 text-black rounded-br-sm sm:rounded-br-md' 
                        : 'bg-zinc-800 text-white rounded-bl-sm sm:rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3 w-full">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-amber-500 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all group"
            aria-label="Send Message"
          >
            <Send className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-black/40 disabled:text-zinc-500 group-enabled:text-black transition-colors" />
          </button>
        </form>
      </div>
    </div>
  );
}
