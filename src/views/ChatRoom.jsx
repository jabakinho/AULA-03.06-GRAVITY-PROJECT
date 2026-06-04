import React, { useState, useEffect, useRef } from 'react';
import { dbGetMessagesForRoom, dbSendMessage, dbUpdateProposalStatus, runChatSimulator, runProposalSimulator } from '../db';
import { ArrowLeft, Send, FileText, X, Check, Calendar, Clock, DollarSign } from 'lucide-react';

export default function ChatRoom({ currentUser, counterpart, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  
  // Proposal Form States
  const [proposalRate, setProposalRate] = useState(counterpart.rate || 30);
  const [proposalHours, setProposalHours] = useState(4);
  const [proposalDate, setProposalDate] = useState(new Date().toISOString().split('T')[0]);

  const messageEndRef = useRef(null);

  const loadMessages = () => {
    if (!currentUser || !counterpart) return;
    const roomMsgs = dbGetMessagesForRoom(currentUser.id, counterpart.id);
    setMessages(roomMsgs);
  };

  useEffect(() => {
    loadMessages();
  }, [currentUser, counterpart]);

  useEffect(() => {
    // Scroll to bottom on new message
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    // Save client message to local storage
    const newMsg = dbSendMessage(currentUser.id, counterpart.id, userText, 'text');
    setMessages(prev => [...prev, newMsg]);

    // Run caregiver simulator
    runChatSimulator(currentUser.id, counterpart.id, userText, (simulatedReply) => {
      // Refresh messages once simulator replies
      loadMessages();
    });
  };

  const handleSendProposal = (e) => {
    e.preventDefault();
    const rate = parseFloat(proposalRate);
    const hours = parseFloat(proposalHours);
    const total = rate * hours;
    
    const proposalData = {
      rate,
      hours,
      date: proposalDate,
      total,
      status: 'pending'
    };

    const text = `Proposta de Serviço: R$ ${total},00 no dia ${proposalDate.split('-').reverse().join('/')}`;
    
    // Save proposal to db
    const newMsg = dbSendMessage(currentUser.id, counterpart.id, text, 'proposal', proposalData);
    setMessages(prev => [...prev, newMsg]);
    setShowProposalModal(false);

    // Run caregiver proposal simulator (auto-reply based on proposal value)
    runProposalSimulator(currentUser.id, counterpart.id, proposalData, (simulatedReply, wasAccepted) => {
      if (wasAccepted) {
        // Automatically set proposal status to accepted in db
        dbUpdateProposalStatus(newMsg.id, 'accepted');
      } else {
        dbUpdateProposalStatus(newMsg.id, 'declined');
      }
      loadMessages();
    });
  };

  const handleProposalAction = (msgId, action) => {
    // action is 'accepted' or 'declined'
    dbUpdateProposalStatus(msgId, action);
    loadMessages();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f1f5f9' }}>
      
      {/* Chat Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid var(--border)', background: '#ffffff', padding: '12px 16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginLeft: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {counterpart.avatar}
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{counterpart.name}</h4>
            <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: '600' }}>● Online</span>
          </div>
        </div>

        {/* Proposal CTA button */}
        <button 
          onClick={() => setShowProposalModal(true)}
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <FileText size={12} />
          <span>Fazer Proposta</span>
        </button>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-muted)', fontSize: '12px', padding: '0 20px' }}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>💬</p>
            <p style={{ fontWeight: '600' }}>Inicie a negociação!</p>
            <p>Envie uma mensagem ou utilize o botão acima para formalizar uma proposta de atendimento.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.senderId === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} style={{
                alignSelf: 'center',
                background: '#e2e8f0',
                color: 'var(--text-muted)',
                fontSize: '10px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '8px',
                textAlign: 'center',
                margin: '4px 0'
              }}>
                ℹ️ {msg.text}
              </div>
            );
          }

          if (msg.type === 'proposal') {
            const p = msg.proposalData;
            return (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Proposal Header */}
                <div style={{
                  background: isMe ? 'var(--primary)' : 'var(--secondary)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} />
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>PROPOSTA DE SERVIÇO</span>
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    background: 'rgba(255, 255, 255, 0.25)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {p.status === 'pending' ? 'Pendente' : p.status === 'accepted' ? 'Aceita' : p.status === 'declined' ? 'Recusada' : 'Finalizada'}
                  </span>
                </div>

                {/* Proposal Details */}
                <div style={{ padding: '14px', fontSize: '12px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <span><strong>Data:</strong> {p.date.split('-').reverse().join('/')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span><strong>Duração:</strong> {p.hours} horas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={14} color="var(--text-muted)" />
                    <span><strong>Valor/Hora:</strong> R$ {p.rate},00/h</span>
                  </div>
                  
                  <div style={{ 
                    borderTop: '1px dashed var(--border)', 
                    paddingTop: '8px', 
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Valor Total:</span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--secondary)' }}>R$ {p.total},00</span>
                  </div>

                  {/* Proposal Actions */}
                  {p.status === 'pending' && !isMe && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button 
                        onClick={() => handleProposalAction(msg.id, 'declined')}
                        style={{
                          flex: 1,
                          background: 'var(--danger-light)',
                          color: 'var(--danger)',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <X size={12} />
                        Recusar
                      </button>
                      <button 
                        onClick={() => handleProposalAction(msg.id, 'accepted')}
                        style={{
                          flex: 1,
                          background: 'var(--success-light)',
                          color: 'var(--success)',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '11px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={12} />
                        Aceitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div 
              key={msg.id} 
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                background: isMe ? 'var(--primary)' : 'var(--bg-card)',
                color: isMe ? '#ffffff' : 'var(--text-main)',
                padding: '10px 14px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '75%',
                fontSize: '13px',
                lineHeight: '1.4',
                boxShadow: 'var(--shadow-sm)',
                border: isMe ? 'none' : '1px solid var(--border)'
              }}
            >
              {msg.text}
              <div style={{ 
                fontSize: '9px', 
                color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-light)', 
                textAlign: 'right', 
                marginTop: '4px' 
              }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Message Footer */}
      <form onSubmit={handleSendText} style={{
        padding: '10px 14px',
        background: '#ffffff',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Digite sua mensagem..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1, borderRadius: '20px', background: '#f8fafc', border: '1px solid var(--border)', height: '40px', padding: '0 16px' }}
        />
        <button type="submit" style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#ffffff',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          flexShrink: 0
        }}>
          <Send size={16} fill="white" />
        </button>
      </form>

      {/* PROPOSAL MODAL POPUP */}
      {showProposalModal && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          animation: 'fadeIn var(--transition-fast)'
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            borderRadius: '24px 24px 0 0',
            padding: '24px 20px',
            animation: 'slideUp var(--transition-normal) forwards',
            boxShadow: '0 -10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700' }}>Nova Proposta de Cuidado</h3>
              <button 
                onClick={() => setShowProposalModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendProposal}>
              <div className="form-group">
                <label className="form-label">Data do Atendimento</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={proposalDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setProposalDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Horas Estimadas</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={proposalHours}
                    min="1"
                    max="24"
                    onChange={(e) => setProposalHours(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Valor/Hora (R$)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={proposalRate}
                    onChange={(e) => setProposalRate(e.target.value)}
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid var(--border)',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Custo Total Estimado:</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--secondary)' }}>R$ {proposalRate * proposalHours},00</span>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px', borderRadius: '12px' }}>
                Enviar Proposta no Chat
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
