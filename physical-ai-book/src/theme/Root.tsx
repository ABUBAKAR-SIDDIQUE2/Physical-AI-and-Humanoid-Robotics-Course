import React from 'react';
import ChatWidget from '../components/ChatWidget';
import { authClient } from '../services/auth-client';
import { OnboardingModal } from '../components/Auth/OnboardingModal';

export default function Root({children}: {children: React.ReactNode}) {
  return (
    <authClient.Provider>
      {children}
      <ChatWidget />
      <OnboardingModal />
    </authClient.Provider>
  );
}
