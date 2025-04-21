import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Captcha = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaVerified(!!value);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify You're Human</h2>

      <ReCAPTCHA
        sitekey="6LcKux8rAAAAAJpXJ0iwQWvB-Zb7cWUzSk2pwiIy"
        onChange={handleCaptchaChange}
      />

      <button
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!captchaVerified}
      >
        Continue
      </button>
    </div>
  );
};

export default Captcha;
