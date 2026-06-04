import React, { useState, useEffect } from 'react';
import { dbGetCaregivers } from '../db';
import { Search, Star, SlidersHorizontal, MapPin } from 'lucide-react';

export default function Explore({ onViewDetail }) {
  const [caregivers, setCaregivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todos');

  useEffect(() => {
    // Load caregivers from db
    setCaregivers(dbGetCaregivers());
  }, []);

  const specialties = [
    'Todos',
    'Idosos / Alzheimer',
    'Pós-Operatório / Enfermagem',
    'Crianças / Necessidades Especiais',
    'Companhia e Rotina'
  ];

  // Filtering logic
  const filteredCaregivers = caregivers.filter(cg => {
    const matchesSearch = cg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cg.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cg.specialty.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesSpecialty = selectedSpecialty === 'Todos' || cg.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="screen-header">
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Encontre Cuidados</span>
          <h1 className="screen-title" style={{ marginTop: '-2px' }}>Profissionais</h1>
        </div>
        <div className="header-action">
          <SlidersHorizontal size={18} />
        </div>
      </div>

      {/* Search Input */}
      <div style={{ padding: '12px 16px 8px 16px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Buscar por cuidador ou especialidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px', borderRadius: '14px', background: '#ffffff', border: '1px solid var(--border)' }}
          />
        </div>
      </div>

      {/* Specialty Badges Carousel */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 16px 14px 16px',
        whiteSpace: 'nowrap'
      }}>
        {specialties.map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              background: selectedSpecialty === spec ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedSpecialty === spec ? '#ffffff' : 'var(--text-muted)',
              boxShadow: selectedSpecialty === spec ? 'var(--shadow-sm)' : 'none',
              border: `1px solid ${selectedSpecialty === spec ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {spec === 'Todos' ? '✨ Todos' : spec}
          </button>
        ))}
      </div>

      {/* Caregiver List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredCaregivers.length > 0 ? (
          filteredCaregivers.map(cg => (
            <div 
              key={cg.id} 
              className="caregiver-card animate-slide-up"
              onClick={() => onViewDetail(cg.id)}
            >
              <div className="avatar-wrapper">
                <div className="avatar">{cg.avatar}</div>
                <div className="status-badge status-online"></div>
              </div>

              <div className="card-info">
                <div className="card-header-row">
                  <span className="caregiver-name">{cg.name}</span>
                  <div className="rating-badge">
                    <Star size={12} fill="#d97706" stroke="none" />
                    <span>{cg.rating.toFixed(1)}</span>
                  </div>
                </div>

                <span className="specialty-tag">{cg.specialty}</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>
                  <MapPin size={12} />
                  <span>{cg.location}</span>
                </div>

                <div className="card-footer-row">
                  <span className="hourly-rate">
                    R$ {cg.rate} <span>/ hora</span>
                  </span>
                  <span className="experience-text">
                    ⏱️ {cg.experience} exp.
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            color: 'var(--text-muted)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '32px' }}>🔍</span>
            <p style={{ fontWeight: '600' }}>Nenhum cuidador encontrado.</p>
            <p style={{ fontSize: '12px' }}>Tente ajustar a busca ou limpar os filtros de especialidade.</p>
          </div>
        )}
      </div>
    </div>
  );
}
