import React, { useState, useEffect } from 'react';
import { dbGetContractsForUser, dbUpdateProposalStatus } from '../db';
import { ClipboardList, Calendar, Clock, DollarSign, Award, Star } from 'lucide-react';

export default function ServiceHistory({ currentUser, onOpenReview }) {
  const [contracts, setContracts] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('ativos'); // 'ativos' or 'historico'

  const loadContracts = () => {
    if (!currentUser) return;
    setContracts(dbGetContractsForUser(currentUser.id));
  };

  useEffect(() => {
    loadContracts();
  }, [currentUser]);

  const handleFinishContract = (contract) => {
    // Update status to 'completed' in database
    dbUpdateProposalStatus(contract.messageId, 'completed');
    
    // Refresh contracts list
    loadContracts();

    // Direct to review screen if current user is the client (clients rate caregivers!)
    if (currentUser.role === 'client') {
      onOpenReview(contract.caregiverId);
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (activeSubTab === 'ativos') {
      return c.status === 'accepted' || c.status === 'pending';
    } else {
      return c.status === 'completed' || c.status === 'declined';
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-app)' }}>
      {/* Header */}
      <div className="screen-header">
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Controle de Plantões</span>
          <h1 className="screen-title" style={{ marginTop: '-2px' }}>Meus Serviços</h1>
        </div>
      </div>

      {/* Sub Tabs (Ativos / Histórico) */}
      <div style={{
        display: 'flex',
        margin: '12px 16px 8px 16px',
        background: '#e2e8f0',
        borderRadius: '10px',
        padding: '3px'
      }}>
        <button 
          onClick={() => setActiveSubTab('ativos')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '7px',
            fontWeight: '600',
            fontSize: '13px',
            background: activeSubTab === 'ativos' ? '#ffffff' : 'transparent',
            color: activeSubTab === 'ativos' ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: activeSubTab === 'ativos' ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Agendados / Ativos
        </button>
        <button 
          onClick={() => setActiveSubTab('historico')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '7px',
            fontWeight: '600',
            fontSize: '13px',
            background: activeSubTab === 'historico' ? '#ffffff' : 'transparent',
            color: activeSubTab === 'historico' ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: activeSubTab === 'historico' ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          Histórico
        </button>
      </div>

      {/* Contract Lists */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {filteredContracts.length > 0 ? (
          filteredContracts.map(contract => (
            <div 
              key={contract.messageId}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px',
                animation: 'slideUp var(--transition-fast)'
              }}
            >
              {/* Header card details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{contract.counterpartAvatar}</span>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{contract.counterpartName}</h3>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {currentUser.role === 'client' ? 'Cuidador Contratado' : 'Cliente Contratante'}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  background: 
                    contract.status === 'pending' ? 'var(--accent-light)' : 
                    contract.status === 'accepted' ? 'var(--success-light)' : 
                    contract.status === 'declined' ? 'var(--danger-light)' : '#f1f5f9',
                  color: 
                    contract.status === 'pending' ? '#b45309' : 
                    contract.status === 'accepted' ? 'var(--success)' : 
                    contract.status === 'declined' ? 'var(--danger)' : 'var(--text-muted)'
                }}>
                  {contract.status === 'pending' ? 'Pendente' : 
                   contract.status === 'accepted' ? 'Confirmado' : 
                   contract.status === 'declined' ? 'Recusado' : 'Concluído'}
                </span>
              </div>

              {/* Body Details */}
              <div style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>📅 Data do Plantão:</span>
                  <span style={{ fontWeight: '600' }}>{contract.date.split('-').reverse().join('/')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⏱️ Total de Horas:</span>
                  <span style={{ fontWeight: '600' }}>{contract.hours} horas</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>💵 Custo Estimado:</span>
                  <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>R$ {contract.total},00</span>
                </div>
              </div>

              {/* Action Buttons */}
              {contract.status === 'accepted' && (
                <button 
                  onClick={() => handleFinishContract(contract)}
                  className="btn btn-secondary btn-full"
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    background: 'var(--success-light)',
                    color: 'var(--success)'
                  }}
                >
                  Concluir e Finalizar Plantão
                </button>
              )}

              {contract.status === 'completed' && currentUser.role === 'client' && (
                <button 
                  onClick={() => onOpenReview(contract.caregiverId)}
                  className="btn btn-outline btn-full"
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)'
                  }}
                >
                  <Star size={14} fill="var(--primary)" stroke="none" />
                  Avaliar Cuidador Novamente
                </button>
              )}
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
            gap: '8px',
            marginTop: '20px'
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
              <ClipboardList size={24} />
            </div>
            <p style={{ fontWeight: '600' }}>Nenhum serviço nesta aba.</p>
            <p style={{ fontSize: '11px' }}>
              Propostas de serviços aceitas no chat aparecerão aqui como plantões ativos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
