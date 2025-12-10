// @ts
import React from "react";
import ChatWidget from "../components/ChatWidget";
import { OnboardingModal } from "../components/Auth/OnboardingModal";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />
      <OnboardingModal />
    </>
  );
}
