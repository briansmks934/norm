import React, { useRef, useState } from 'react';
import HCaptchaComponent from '@hcaptcha/react-hcaptcha';

interface HCaptchaProps {
  onVerificationSuccess: () => void;
}

// This would typically come from environment variables
const SITE_KEY = '10000000-ffff-ffff-ffff-000000000001'; // hCaptcha's test key

const HCaptcha: React.FC<HCaptchaProps> = ({ onVerificationSuccess }) => {
  const captchaRef = useRef<HCaptchaComponent>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async (token: string) => {
    if (!token) {
      setError('Verification failed. Please try again.');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      // In a real implementation, you would verify this token on your server
      // For this demo, we'll simulate a server verification with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verification successful
      onVerificationSuccess();
    } catch (err) {
      setError('Failed to verify. Please try again.');
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`transition-opacity duration-300 ${verifying ? 'opacity-50 pointer-events-none' : ''}`}>
        <HCaptchaComponent
          ref={captchaRef}
          sitekey={SITE_KEY}
          onVerify={handleVerify}
          onError={() => setError('An error occurred. Please try again.')}
          onExpire={() => setError('Verification expired. Please try again.')}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
      
      {verifying && (
        <div className="mt-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600">Verifying...</span>
        </div>
      )}
    </div>
  );
};

export default HCaptcha;