import React, { useState } from 'react';
import { dbLogin, dbRegister } from '../db';
import { ShieldCheck, Heart, User, Briefcase, KeyRound, Mail, MapPin, Phone, Award, DollarSign } from 'lucide-react';

export default function LoginRegister({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('client'); // 'client' or 'caregiver'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  // Caregiver specific
  const [specialty, setSpecialty] = useState('Idosos / Alzheimer');
  const [rate, setRate] = useState('');
  const [experience, setExperience] = useState('');

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Login flow
      if (!username || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
      const res = dbLogin(username, password, role);
      if (res.success) {
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 800);
      } else {
        setError(res.error);
      }
    } else {
      // Registration flow
      if (!username || !password || !name || !email || !location || !phone) {
        setError('Preencha os campos obrigatórios (Nome, Usuário, Email, Telefone, Localização e Senha).');
        return;
      }

      const userData = {
        role,
        name,
        username,
        email,
        phone,
        location,
        bio: bio || (role === 'client' ? 'Procurando cuidadores dedicados.' : 'Cuidador apaixonado pela profissão.'),
        avatar: role === 'client' ? '👤' : '🧑‍⚕️'
      };

      if (role === 'caregiver') {
        if (!rate || !experience) {
          setError('Cuidadores precisam preencher tarifa horária e tempo de experiência.');
          return;
        }
        userData.specialty = specialty;
        userData.rate = parseFloat(rate);
        userData.experience = experience + ' anos';
      }

      const res = dbRegister(userData);
      if (res.success) {
        setSuccess('Cadastro concluído! Faça o login agora.');
        // Switch to login tab, pre-fill username
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setError('');
          setSuccess('');
        }, 1500);
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="login-container" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '12px'
        }}>
          <Heart size={32} fill="white" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>AllCare</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Cuidado com carinho na palma da sua mão</p>
      </div>

      {/* Tabs (Login / Cadastro) */}
      <div style={{
        display: 'flex',
        background: '#e2e8f0',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            background: isLogin ? 'var(--bg-card)' : 'transparent',
            color: isLogin ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Entrar
        </button>
        <button 
          onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            background: !isLogin ? 'var(--bg-card)' : 'transparent',
            color: !isLogin ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Cadastrar
        </button>
      </div>

      {/* Role Picker */}
      <div style={{ marginBottom: '20px' }}>
        <span className="form-label" style={{ textAlign: 'center', marginBottom: '8px' }}>Selecione seu Perfil</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div 
            onClick={() => handleRoleChange('client')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: `2px solid ${role === 'client' ? 'var(--primary)' : 'var(--border)'}`,
              background: role === 'client' ? 'var(--primary-light)' : 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <User size={24} color={role === 'client' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px', color: role === 'client' ? 'var(--primary)' : 'var(--text-main)' }}>Sou Cliente</span>
          </div>

          <div 
            onClick={() => handleRoleChange('caregiver')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: `2px solid ${role === 'caregiver' ? 'var(--primary)' : 'var(--border)'}`,
              background: role === 'caregiver' ? 'var(--primary-light)' : 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Briefcase size={24} color={role === 'caregiver' ? 'var(--primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px', color: role === 'caregiver' ? 'var(--primary)' : 'var(--text-main)' }}>Sou Cuidador</span>
          </div>
        </div>
      </div>

      {/* Success/Error Banners */}
      {error && (
        <div style={{
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '16px',
          textAlign: 'center',
          animation: 'fadeIn var(--transition-fast)'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          marginBottom: '16px',
          textAlign: 'center',
          animation: 'fadeIn var(--transition-fast)'
        }}>
          {success}
        </div>
      )}

      {/* Main Authentication Form */}
      <form onSubmit={handleAuth} style={{ flex: 1 }}>
        {!isLogin && (
          <>
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone celular</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cidade e Estado</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: São Paulo, SP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Caregiver specific details */}
            {role === 'caregiver' && (
              <div style={{
                background: '#f1f5f9',
                padding: '14px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: '1px solid var(--border)'
              }}>
                <span className="form-label" style={{ color: 'var(--primary)', marginBottom: '10px' }}>Configuração Profissional</span>
                
                <div className="form-group">
                  <label className="form-label">Especialidade Principal</label>
                  <select 
                    className="form-input form-select"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <option value="Idosos / Alzheimer">Idosos / Alzheimer</option>
                    <option value="Pós-Operatório / Enfermagem">Pós-Operatório / Enfermagem</option>
                    <option value="Crianças / Necessidades Especiais">Crianças / Necessidades Especiais</option>
                    <option value="Companhia e Rotina">Companhia e Rotina</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label">Tarifa (R$/Hora)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="40"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label">Anos de Experiência</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Biografia / Apresentação</label>
              <textarea 
                className="form-input" 
                placeholder="Conte um pouco sobre você ou o tipo de ajuda que precisa..."
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ resize: 'none', fontFamily: 'inherit' }}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Nome de Usuário</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: mariasilva"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Senha</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Mínimo 4 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px', borderRadius: '14px', fontSize: '15px' }}>
          {isLogin ? 'Entrar no Aplicativo' : 'Concluir Cadastro'}
        </button>
      </form>

      {/* Demo Credentials Hint */}
      {isLogin && (
        <div style={{
          marginTop: '20px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '4px' }}>💡 Credenciais de Teste Rápido (Login):</p>
          <p>Cliente: <strong>joaopereira</strong> | Senha: <strong>1234</strong> (Selecione "Sou Cliente")</p>
          <p>Cuidador: <strong>mariasilva</strong> | Senha: <strong>1234</strong> (Selecione "Sou Cuidador")</p>
        </div>
      )}
    </div>
  );
}
