import React, { useState, useEffect } from 'react';
import { initDB, getCurrentUser } from './db';
import PhoneWrapper from './components/PhoneWrapper';
import Navbar from './components/Navbar';
import LoginRegister from './views/LoginRegister';
import Explore from './views/Explore';
import CaregiverDetail from './views/CaregiverDetail';
import ChatList from './views/ChatList';
import ChatRoom from './views/ChatRoom';
import ServiceHistory from './views/ServiceHistory';
import ReviewScreen from './views/ReviewScreen';
import Profile from './views/Profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'chats' | 'services' | 'profile'
  
  // Navigation details
  const [subView, setSubView] = useState(null); // 'caregiverDetail' | 'chatRoom' | 'review'
  const [selectedCaregiverId, setSelectedCaregiverId] = useState(null);
  const [selectedChatCounterpart, setSelectedChatCounterpart] = useState(null);
  const [selectedReviewCaregiverId, setSelectedReviewCaregiverId] = useState(null);

  // Initialize DB on component mount
  useEffect(() => {
    initDB();
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Set default tab based on role
      setActiveTab(user.role === 'client' ? 'explore' : 'services');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab(user.role === 'client' ? 'explore' : 'services');
    setSubView(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSubView(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // Nav actions
  const handleViewCaregiverDetail = (id) => {
    setSelectedCaregiverId(id);
    setSubView('caregiverDetail');
  };

  const handleStartChatFromDetail = (caregiver) => {
    setSelectedChatCounterpart(caregiver);
    setSubView('chatRoom');
  };

  const handleSelectChatFromList = (counterpart) => {
    setSelectedChatCounterpart(counterpart);
    setSubView('chatRoom');
  };

  const handleOpenReview = (caregiverId) => {
    setSelectedReviewCaregiverId(caregiverId);
    setSubView('review');
  };

  const handleFinishReview = () => {
    setSubView(null);
    setActiveTab('services'); // return to services tab
  };

  // Main Render View Router
  const renderContent = () => {
    if (!currentUser) {
      return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
    }

    // Sub View Overlays (Caregiver Detail, Chat Room, Review Screen)
    if (subView === 'caregiverDetail') {
      return (
        <CaregiverDetail 
          caregiverId={selectedCaregiverId} 
          onBack={() => setSubView(null)} 
          onStartChat={handleStartChatFromDetail}
        />
      );
    }

    if (subView === 'chatRoom') {
      return (
        <ChatRoom 
          currentUser={currentUser} 
          counterpart={selectedChatCounterpart} 
          onBack={() => {
            setSubView(null);
            setActiveTab('chats');
          }} 
        />
      );
    }

    if (subView === 'review') {
      return (
        <ReviewScreen 
          caregiverId={selectedReviewCaregiverId} 
          currentUser={currentUser} 
          onFinishReview={handleFinishReview} 
        />
      );
    }

    // Default Bottom Tab Views
    switch (activeTab) {
      case 'explore':
        return <Explore onViewDetail={handleViewCaregiverDetail} />;
      case 'chats':
        return (
          <ChatList 
            currentUser={currentUser} 
            onSelectChat={handleSelectChatFromList} 
          />
        );
      case 'services':
        return (
          <ServiceHistory 
            currentUser={currentUser} 
            onOpenReview={handleOpenReview} 
          />
        );
      case 'profile':
        return (
          <Profile 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser} 
          />
        );
      default:
        return <Explore onViewDetail={handleViewCaregiverDetail} />;
    }
  };

  return (
    <PhoneWrapper>
      <div className="app-content">
        {renderContent()}
      </div>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setSubView(null); // close any overlay when changing tabs
          setActiveTab(tab);
        }} 
        user={currentUser} 
      />
    </PhoneWrapper>
  );
}
