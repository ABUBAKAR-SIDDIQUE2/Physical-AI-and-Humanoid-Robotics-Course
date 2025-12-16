// @ts
import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { useEffect } from "react";
import ChatWidget from "../components/ChatWidget";
import { OnboardingModal } from "../components/Auth/OnboardingModal";
import { authClient } from '../services/auth-client';
import AnnouncementPopup from '../components/popup/popUpMsg';

const SessionLogger = () => {
  const { data: session, error } = authClient.useSession();
  
  useEffect(() => {
    console.log("Current Session:", session);
    if (error) console.error("Session Error:", error);
  }, [session, error]);

  return null;
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />
      <AnnouncementPopup/>
      <BrowserOnly>
        {() => (
          <>
            <SessionLogger />
            <OnboardingModal />
          </>
        )}
      </BrowserOnly>
    </>
  );
}
