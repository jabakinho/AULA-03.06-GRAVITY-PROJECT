import React, { useState, useEffect } from 'react';
import { dbGetCaregiverDetail, dbAddReview } from '../db';
import { Star, Heart, X, CheckCircle2 } from 'lucide-react';

export default function ReviewScreen({ caregiverId, currentUser, onFinishReview }) {
  const [caregiver, setCaregiver] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tags = [
    'Puntual ⏱️',
    'Atencioso ❤️',
    'Paciente 🧘',
    'Higienização Impecável 🧼',
    'Prestativo 🤝',
    'Excelente Comunicação 💬',
    'Muito Técnico 💉'
  ];

  useEffect(() => {
    if (caregiverId) {
      setCaregiver(dbGetCaregiverDetail(caregiverId));
    }
  }, [caregiverId]);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caregiver) return;

    // Build comment incorporating chosen tags for richer formatting
    let finalComment = comment.trim();
    if (selectedTags.length > 0) {
      const tagsString = `[Destaques: ${selectedTags.join(', ')}]`;
      finalComment = finalComment ? `${tagsString} - ${finalComment}` : tagsString;
    }

    if (!finalComment) {
      finalComment = "Ótimo atendimento prestado!";
    }

    // Submit review to db
    dbAddReview(caregiverId, currentUser.name, rating, finalComment);

    setIsSubmitted(true);
    
    // Auto redirect back after showing success check
    setTimeout(() => {
      onFinishReview();
    }, 1800);
  };

  if (!caregiver) return null;

  if (isSubmitted) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#ffffff',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--success-light)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          animation: 'pulse-dot 1.5s infinite ease-in-out'
        }}>
          <CheckCircle2 size={40} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          Avaliação Enviada!
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Agradecemos seu feedback. Ele ajuda a manter a comunidade do AllCare confiável e segura!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', overflowY: 'auto' }}>
      
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700' }}>Avaliar Atendimento</span>
        <button 
          onClick={onFinishReview} 
          style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Caregiver Mini Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '36px', background: 'var(--primary-light)', padding: '6px', borderRadius: '12px' }}>{caregiver.avatar}</span>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{caregiver.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{caregiver.specialty}</p>
          </div>
        </div>

        {/* Star Rating Panel */}
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Como foi o atendimento do profissional?
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <button
                key={starIndex}
                type="button"
                onClick={() => setRating(starIndex)}
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'transform var(--transition-fast)'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              >
                <Star
                  size={36}
                  fill={(hoverRating || rating) >= starIndex ? "#f59e0b" : "none"}
                  stroke={(hoverRating || rating) >= starIndex ? "none" : "#cbd5e1"}
                  style={{ transition: 'all 0.1s ease' }}
                />
              </button>
            ))}
          </div>

          <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginTop: '12px' }}>
            {rating === 5 ? 'Excelente! ⭐⭐⭐⭐⭐' :
             rating === 4 ? 'Muito Bom! ⭐⭐⭐⭐' :
             rating === 3 ? 'Bom / Regular ⭐⭐⭐' :
             rating === 2 ? 'Ruim ⭐⭐' : 'Muito Ruim ⭐'}
          </p>
        </div>

        {/* Quick Highlights Tag Cloud */}
        <div>
          <label className="form-label" style={{ marginBottom: '8px' }}>O que se destacou?</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: isSelected ? 'var(--primary-light)' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Review comment */}
        <div className="form-group">
          <label className="form-label">Deixe um comentário detalhado</label>
          <textarea
            className="form-input"
            rows="4"
            placeholder="Escreva como foi sua experiência, o que deu certo e pontos a melhorar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'none', fontFamily: 'inherit', padding: '12px' }}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px', borderRadius: '12px', fontSize: '14px', marginTop: '10px' }}>
          Enviar Minha Avaliação
        </button>

      </form>
    </div>
  );
}
