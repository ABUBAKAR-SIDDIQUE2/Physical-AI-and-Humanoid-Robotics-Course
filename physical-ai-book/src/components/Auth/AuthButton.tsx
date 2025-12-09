import React from "react";
import { authClient } from "../../services/auth-client";

export const AuthButton = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;

  if (session) {
    return (
      <button
        onClick={async () => {
          await authClient.signOut();
          window.location.reload();
        }}
        className="button button--secondary button--sm"
      >
        Sign Out
      </button>
    );
  }

  return (
    <a href="/login" className="button button--primary button--sm">
      Sign In
    </a>
  );
};
