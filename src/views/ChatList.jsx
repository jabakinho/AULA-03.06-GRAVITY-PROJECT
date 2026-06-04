import React, { useState, useEffect } from 'react';
import { getDB } from '../db';
import { MessageSquare, CalendarCheck2, ArrowRight } from 'lucide-react';

export default function ChatList({ currentUser, onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const messages = getDB("allcare_messages");
    const users = getDB("allcare_users");
    
    // Group messages by conversational room counterpart ID
    const roomMap = {};
    messages.forEach(m => {
      if (m.senderId === "system" || m.receiverId === "system") return; // skip system messages in grouping
      
      const counterpartId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
      if (!roomMap[counterpartId]) {
        roomMap[counterpartId] = [];
      }
      roomMap[counterpartId].push(m);
    });

    // Create chat channel summaries
    const chatSummaryList = Object.keys(roomMap).map(counterpartId => {
      const counterpart = users.find(u => u.id === counterpartId) || {
        name: "Usuário Desconhecido",
        avatar: "👤",
        role: "unknown"
      };

      // Sort messages in this room to find latest
      const roomMsgs = roomMap[counterpartId].sort((a,b) => b.timestamp - a.timestamp);
      const latestMsg = roomMsgs[0];

      // Check if there is an active proposal or contract in the messages
      const activeProposalMsg = roomMsgs.find(m => m.type === "proposal");
      let proposalStatus = null;
      if (activeProposalMsg) {
        proposalStatus = activeProposalMsg.proposalData.status;
      }

      return {
        counterpart,
        latestMessage: latestMsg.text,
        latestTime: new Date(latestMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposalStatus,
        timestamp: latestMsg.timestamp
      };
    }).sort((a, b) => b.timestamp - a.timestamp);

    setChats(chatSummaryList);
  }, [currentUser]);

  const getProposalBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span style={{ fontSize: '10px', background: 'var(--accent-light)', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>Proposta Pendente</span>;
      case 'accepted':
        return <span style={{ fontSize: '10px', background: 'var(--success-light)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>Contrato Fechado</span>;
      case 'declined':
        return <span style={{ fontSize: '10px', background: 'var(--danger-light)', color: 'var(--danger)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>Recusada</span>;
      case 'completed':
        return <span style={{ fontSize: '10px', background: '#f1f5f9', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>Finalizado</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-app)' }}>
      {/* Header */}
      <div className="screen-header">
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Mensagens Recentes</span>
          <h1 className="screen-title" style={{ marginTop: '-2px' }}>Conversas</h1>
        </div>
      </div>

      {/* List of discussions */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {chats.length > 0 ? (
          chats.map(chat => (
            <div 
              key={chat.counterpart.id}
              onClick={() => onSelectChat(chat.counterpart)}
              style={{
                background: 'var(--bg-card)',
                padding: '16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)'
              }}
              className="chat-item"
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
            >
              {/* Avatar */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {chat.counterpart.avatar}
              </div>

              {/* Chat details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chat.counterpart.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{chat.latestTime}</span>
                </div>

                {chat.counterpart.specialty && (
                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '500', display: 'block', marginBottom: '2px' }}>
                    {chat.counterpart.specialty}
                  </span>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {chat.latestMessage}
                  </p>
                  {getProposalBadge(chat.proposalStatus)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: 'var(--text-muted)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              <MessageSquare size={24} />
            </div>
            <p style={{ fontWeight: '600' }}>Nenhuma conversa iniciada.</p>
            <p style={{ fontSize: '12px' }}>
              {currentUser.role === 'client' 
                ? 'Navegue pelos cuidadores na aba Explorar e mande uma mensagem!' 
                : 'Aguarde que os clientes entrem em contato com você.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
