import React, { useState, useEffect } from 'react';
import { dbGetCaregiverDetail } from '../db';
import { ArrowLeft, Star, MessageSquare, MapPin, DollarSign, Award, Calendar } from 'lucide-react';

export default function CaregiverDetail({ caregiverId, onBack, onStartChat }) {
  const [caregiver, setCaregiver] = useState(null);

  useEffect(() => {
    if (caregiverId) {
      setCaregiver(dbGetCaregiverDetail(caregiverId));
    }
  }, [caregiverId]);

  if (!caregiver) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-muted)' }}>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-app)' }}>
      {/* Navigation Header */}
      <div className="screen-header" style={{ position: 'relative' }}>
        <button 
          onClick={onBack} 
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700' }}>Perfil do Cuidador</span>
        <div style={{ width: 20 }}></div> {/* spacer */}
      </div>

      {/* Scrollable details */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Main Profile Info */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px 16px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: 'var(--primary-light)',
            fontSize: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {caregiver.avatar}
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{caregiver.name}</h2>
          <span style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: '600',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '4px 12px',
            borderRadius: '20px',
            marginTop: '6px',
            marginBottom: '10px'
          }}>
            {caregiver.specialty}
          </span>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <MapPin size={14} />
              <span>{caregiver.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#d97706', fontWeight: '600' }}>
              <Star size={14} fill="#d97706" stroke="none" />
              <span>{caregiver.rating.toFixed(1)} ({caregiver.reviews.length} avaliações)</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
              <Award size={18} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Experiência</p>
              <p style={{ fontSize: '13px', fontWeight: '700' }}>{caregiver.experience}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '8px', borderRadius: '12px' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tarifa / Hora</p>
              <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--secondary)' }}>R$ {caregiver.rate},00</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid var(--border)',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Sobre o Cuidador</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)' }}>{caregiver.bio}</p>
        </div>

        {/* Reviews list */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Avaliações</h3>
          {caregiver.reviews.length > 0 ? (
            caregiver.reviews.map(rev => (
              <div 
                key={rev.id} 
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '14px',
                  border: '1px solid var(--border)',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>{rev.clientName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{rev.date}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < rev.rating ? "#d97706" : "none"} 
                      stroke={i < rev.rating ? "none" : "#cbd5e1"} 
                    />
                  ))}
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{rev.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', padding: '12px' }}>Este cuidador ainda não possui avaliações.</p>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div style={{
        padding: '12px 16px',
        background: '#ffffff',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}>
        <button 
          className="btn btn-primary btn-full"
          onClick={() => onStartChat(caregiver)}
          style={{ padding: '14px', borderRadius: '12px' }}
        >
          <MessageSquare size={18} />
          <span>Falar com {caregiver.name.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
}
