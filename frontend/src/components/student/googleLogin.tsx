// import api
import React, { useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  onLoginSuccess: (user: unknown) => void;
  onLoginError?: (error: unknown) => void;
  apiRouter: (data: { tokenId: string }) => Promise<{ ok: boolean; data: unknown; message?: string }>;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
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

const CLIENT_ID = '1009449170165-l51vq71vru9hqefmkl570nf782455uf1.apps.googleusercontent.com';

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onLoginSuccess,
  onLoginError,
  apiRouter

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
      console.log("res  in google signup", apiRouter)

      const res = await apiRouter({ tokenId: idToken });
      console.log("res  in google signup", res)


      if (res.ok) {
        onLoginSuccess(res.data); // pass user object
      } else {
        const errorMsg = res.message || (res.data as { message?: string })?.message || 'Login failed';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Google login failed', error);
      if (onLoginError) onLoginError(error);
    }
  };

  return <div ref={googleButtonRef}></div>;
};
