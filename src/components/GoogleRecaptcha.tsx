import React, { useRef, useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useConfig } from '../hooks/useConfig';

interface GoogleRecaptchaProps {
  onVerificationSuccess: () => void;
}

const GoogleRecaptcha: React.FC<GoogleRecaptchaProps> = ({ onVerificationSuccess }) => {
  const { config } = useConfig();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [mouseMovements, setMouseMovements] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const handleMouseMove = () => {
      setMouseMovements(prev => prev + 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resetTimer = setInterval(() => {
      if (Date.now() - lastAttemptTime > config.recaptcha.cooldownPeriod) {
        setAttempts(0);
      }
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(resetTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [startTime, lastAttemptTime, config.recaptcha.cooldownPeriod]);

  const handleVerify = async (token: string | null) => {
    if (!token) {
      setError('Verification failed. Please try again.');
      return;
    }

    if (timeOnPage < config.recaptcha.minTimeOnPage) {
      setError('Please wait a moment before verifying.');
      return;
    }

    if (mouseMovements < config.recaptcha.minMouseMovements) {
      setError('Please interact with the page naturally.');
      return;
    }

    if (attempts >= config.recaptcha.maxAttempts) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    const timeSinceLastAttempt = Date.now() - lastAttemptTime;
    if (timeSinceLastAttempt < 2000) {
      setError('Please wait before trying again.');
      return;
    }

    setVerifying(true);
    setError(null);
    setAttempts(prev => prev + 1);
    setLastAttemptTime(Date.now());

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onVerificationSuccess();
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify. Please try again.');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`transition-opacity duration-300 ${verifying ? 'opacity-50 pointer-events-none' : ''}`}
        style={{ minHeight: '78px' }}
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={config.recaptcha.siteKey}
          onChange={handleVerify}
          size="normal"
          theme="light"
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

export default GoogleRecaptcha;