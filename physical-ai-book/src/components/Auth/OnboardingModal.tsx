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
    // ✅ FIX: Cast user to 'any' to access custom fields without TS errors
    const user = session?.user as any;
    
    if (user && (!user.software_bg || !user.hardware_bg)) {
      setIsOpen(true);
    }
  }, [session]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authClient.updateUser({
        image: session?.user?.image,
        name: session?.user?.name,
        // ✅ FIX: These comments alone don't fix TS, the 'as any' casting above helps logic,
        // but for this update call, we might need to suppress the object strictly if the type is rigid.
        // The cleanest quick fix is to cast the whole object if update() complains:
        software_bg: software,
        hardware_bg: hardware,
      } as any); 
      
      setIsOpen(false);
      window.location.reload(); 
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
