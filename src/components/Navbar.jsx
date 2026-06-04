import React from 'react';
import { Compass, MessageSquare, CalendarRange, User, ClipboardList } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user }) {
  if (!user) return null;

  const isClient = user.role === 'client';

  return (
    <div className="tab-bar">
      {isClient ? (
        <>
          <div 
            className={`tab-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Compass size={20} />
            <span>Explorar</span>
          </div>
          <div 
            className={`tab-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageSquare size={20} />
            <span>Conversas</span>
          </div>
          <div 
            className={`tab-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <CalendarRange size={20} />
            <span>Serviços</span>
          </div>
          <div 
            className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Meu Perfil</span>
          </div>
        </>
      ) : (
        <>
          <div 
            className={`tab-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <ClipboardList size={20} />
            <span>Escalas</span>
          </div>
          <div 
            className={`tab-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageSquare size={20} />
            <span>Mensagens</span>
          </div>
          <div 
            className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Perfil Profissional</span>
          </div>
        </>
      )}
    </div>
  );
}
