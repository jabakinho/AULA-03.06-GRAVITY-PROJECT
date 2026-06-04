import React, { useState } from 'react';
import { dbUpdateProfile, logoutUser } from '../db';
import { User, Mail, Phone, MapPin, DollarSign, LogOut, Edit3, Check, Star } from 'lucide-react';

export default function Profile({ currentUser, onLogout, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [location, setLocation] = useState(currentUser.location);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [rate, setRate] = useState(currentUser.rate || '');
  const [specialty, setSpecialty] = useState(currentUser.specialty || '');

  const isCaregiver = currentUser.role === 'caregiver';

  const handleSave = () => {
    const updatedFields = {
      name,
      phone,
      location,
      bio
    };

    if (isCaregiver) {
      updatedFields.rate = parseFloat(rate);
      updatedFields.specialty = specialty;
    }

    const res = dbUpdateProfile(currentUser.id, updatedFields);
    if (res.success) {
      onUpdateUser(res.user);
      setIsEditing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-app)' }}>
      {/* Header */}
      <div className="screen-header">
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Dados da Conta</span>
          <h1 className="screen-title" style={{ marginTop: '-2px' }}>Meu Perfil</h1>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{
            background: isEditing ? 'var(--success-light)' : 'var(--primary-light)',
            color: isEditing ? 'var(--success)' : 'var(--primary)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          {isEditing ? <Check size={18} /> : <Edit3 size={18} />}
        </button>
      </div>

      {/* Profile Details Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        
        {/* User Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px 16px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            fontSize: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            {currentUser.avatar}
          </div>

          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>
            {currentUser.name}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{currentUser.username}</p>
          
          {isCaregiver && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: '700',
              background: '#fffbeb',
              color: '#d97706',
              padding: '4px 10px',
              borderRadius: '20px',
              marginTop: '8px'
            }}>
              <Star size={12} fill="#d97706" stroke="none" />
              <span>{currentUser.rating?.toFixed(1) || '5.0'} Cuidador</span>
            </div>
          )}
        </div>

        {/* Profile Info Form / Display */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Editable/Display Fields */}
          <div>
            <label className="form-label">Nome Completo</label>
            {isEditing ? (
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)', padding: '4px 0' }}>{currentUser.name}</div>
            )}
          </div>

          <div>
            <label className="form-label">Telefone Celular</label>
            {isEditing ? (
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            ) : (
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)', padding: '4px 0' }}>{currentUser.phone}</div>
            )}
          </div>

          <div>
            <label className="form-label">Cidade e Estado</label>
            {isEditing ? (
              <input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-main)', padding: '4px 0' }}>
                <MapPin size={14} color="var(--text-muted)" />
                <span>{currentUser.location}</span>
              </div>
            )}
          </div>

          {/* Caregiver settings */}
          {isCaregiver && (
            <>
              <div>
                <label className="form-label">Especialidade Principal</label>
                {isEditing ? (
                  <select className="form-input form-select" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                    <option value="Idosos / Alzheimer">Idosos / Alzheimer</option>
                    <option value="Pós-Operatório / Enfermagem">Pós-Operatório / Enfermagem</option>
                    <option value="Crianças / Necessidades Especiais">Crianças / Necessidades Especiais</option>
                    <option value="Companhia e Rotina">Companhia e Rotina</option>
                  </select>
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)', padding: '4px 0' }}>{currentUser.specialty}</div>
                )}
              </div>

              <div>
                <label className="form-label">Tarifa por Hora (R$)</label>
                {isEditing ? (
                  <input type="number" className="form-input" value={rate} onChange={(e) => setRate(e.target.value)} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '700', color: 'var(--secondary)', padding: '4px 0' }}>
                    <DollarSign size={14} />
                    <span>R$ {currentUser.rate},00/h</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label className="form-label">Biografia / Apresentação</label>
            {isEditing ? (
              <textarea className="form-input" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} style={{ resize: 'none', fontFamily: 'inherit' }} />
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', padding: '4px 0' }}>{currentUser.bio || 'Sem biografia definida.'}</div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Mail size={14} />
              <span>{currentUser.email}</span>
            </div>
          </div>
        </div>

        {/* Logout CTA */}
        <button 
          onClick={() => {
            logoutUser();
            onLogout();
          }}
          className="btn btn-outline btn-full"
          style={{
            marginTop: '24px',
            borderColor: 'var(--danger)',
            color: 'var(--danger)',
            borderRadius: '12px',
            padding: '12px'
          }}
        >
          <LogOut size={16} />
          <span>Sair da Conta</span>
        </button>

      </div>
    </div>
  );
}
