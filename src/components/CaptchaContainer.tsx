import React, { useState } from 'react';
import GoogleRecaptcha from './GoogleRecaptcha';
import CloudflareTurnstile from './CloudflareTurnstile';
import { useConfig } from '../hooks/useConfig';

interface CaptchaContainerProps {
  onVerificationSuccess: () => void;
}

const captchaTypes = [
  { id: 'google', label: 'Google reCAPTCHA' },
  { id: 'cloudflare', label: 'Cloudflare Turnstile' }
];

const CaptchaContainer: React.FC<CaptchaContainerProps> = ({ onVerificationSuccess }) => {
  const { config } = useConfig();
  const [selectedCaptcha, setSelectedCaptcha] = useState(config.defaultCaptcha || 'google');

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="captchaSelector" className="text-sm font-medium text-gray-700">
          Verification Method
        </label>
        <select
          id="captchaSelector"
          value={selectedCaptcha}
          onChange={(e) => setSelectedCaptcha(e.target.value as 'google' | 'cloudflare')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2 text-gray-700 border"
        >
          {captchaTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        {selectedCaptcha === 'google' && (
          <GoogleRecaptcha onVerificationSuccess={onVerificationSuccess} />
        )}
        {selectedCaptcha === 'cloudflare' && (
          <CloudflareTurnstile onVerificationSuccess={onVerificationSuccess} />
        )}
      </div>
    </div>
  );
};

export default CaptchaContainer;