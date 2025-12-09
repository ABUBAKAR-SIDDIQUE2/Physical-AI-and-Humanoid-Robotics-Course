import React, { useState, useEffect } from "react";
import { authClient } from "../../services/auth-client";
import styles from "./OnboardingModal.module.css"; // Assuming CSS modules

export const OnboardingModal = () => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [software, setSoftware] = useState("Beginner");
  const [hardware, setHardware] = useState("None");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user && (!session.user.software_bg || !session.user.hardware_bg)) {
      setIsOpen(true);
    }
  }, [session]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authClient.updateUser({
        image: session?.user?.image, // Required by type, keep existing
        name: session?.user?.name,   // Required by type, keep existing
        // @ts-ignore - Custom fields aren't fully typed in the client yet without schema gen
        software_bg: software,
        // @ts-ignore
        hardware_bg: hardware,
      });
      setIsOpen(false);
      window.location.reload(); // Refresh session to get new fields
    } catch (e) {
      console.error(e);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--ifm-background-color)',
        padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%'
      }}>
        <h2>Welcome to Physical AI!</h2>
        <p>Please tell us about your experience level to personalize the AI tutor.</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Software Experience</label>
          <select 
            value={software} 
            onChange={(e) => setSoftware(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Hardware Experience</label>
          <select 
            value={hardware} 
            onChange={(e) => setHardware(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="None">None</option>
            <option value="Arduino">Arduino</option>
            <option value="PCB Design">PCB Design</option>
          </select>
        </div>

        <button 
          className="button button--primary button--block" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Start Learning"}
        </button>
      </div>
    </div>
  );
};
