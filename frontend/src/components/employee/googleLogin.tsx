// import api
import { employeeApiMethods } from '@/services/APIservices/employeeApiService';
import React, { useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  onLoginSuccess: (user: unknown) => void; // can also include token if needed
  onLoginError?: (error: unknown) => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: unknown) => void;
          renderButton: (parent: HTMLElement, options: unknown) => void;
          prompt: () => void;
        }
      }
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

const CLIENT_ID = '1009449170165-l51vq71vru9hqefmkl570nf782455uf1.apps.googleusercontent.com';

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
      } else {
        initializeGoogleSignIn();
      }
    };

    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id) {
        console.error('Google API not loaded');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
        });
      }
    };

    loadGoogleScript();

    // Optional: cleanup script on unmount
    return () => {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: unknown) => {
    try {
      const idToken = (response as GoogleCredentialResponse).credential;

      // Correct API call: send { tokenId } object
      const res = await employeeApiMethods.googleSignup({ tokenId: idToken });
      console.log("res  in google signup", res)


      if (res.ok) {
        onLoginSuccess(res.data); // pass user object
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Google login failed', error);
      if (onLoginError) onLoginError(error);
    }
  };

  return <div ref={googleButtonRef}></div>;
};
