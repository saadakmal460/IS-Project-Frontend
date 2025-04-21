import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const SecureSummary = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !["application/pdf", "text/plain"].includes(file.type)) {
      setError("Please upload a valid PDF or TXT file.");
      return;
    }
    setSelectedDocument(file);
    setError("");
  };

  const handleSummarize = async () => {
    if (!selectedDocument || !captchaToken) {
      setError("Please verify reCAPTCHA and select a document.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const { data: pemKey } = await axios.get("http://localhost:8000/public-key");
      const publicKey = await importRSAPublicKey(pemKey);

      const aesKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const fileBuffer = await selectedDocument.arrayBuffer();

      const encryptedFile = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        fileBuffer
      );

      const rawAES = await window.crypto.subtle.exportKey("raw", aesKey);
      const encryptedAESKey = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        rawAES
      );

      const encryptedIV = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        iv
      );

      const authTag = encryptedFile.slice(-16);

      const formData = new FormData();
      formData.append("file", new Blob([encryptedFile.slice(0, -16)]), selectedDocument.name);
      formData.append("key", new Blob([encryptedAESKey]));
      formData.append("iv", new Blob([encryptedIV]));
      formData.append("auth_tag", new Blob([authTag]));
      formData.append("captcha_token", captchaToken);

      const response = await axios.post("http://localhost:8000/summarize", formData);
      setSummary(response.data.summary);
    } catch (err) {
      setError("Error occurred while processing the document.");
    } finally {
      setIsLoading(false);
    }
  };

  async function importRSAPublicKey(pem) {
    const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, "");
    const binaryDer = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer.buffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["encrypt"]
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Zero-Trust Document Summarizer</h1>

      <div className="mb-4">
        <label htmlFor="fileInput" className="block text-lg font-medium text-gray-700 mb-2">
          Upload Document (PDF or TXT)
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className="mb-4">
        <ReCAPTCHA
          sitekey="6LcKux8rAAAAAJpXJ0iwQWvB-Zb7cWUzSk2pwiIy"
          onChange={handleCaptchaChange}
        />
      </div>

      <button
        onClick={handleSummarize}
        disabled={isLoading || !selectedDocument || !captchaToken}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? "Summarizing..." : "Summarize Document"}
      </button>

      {summary && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Summary</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SecureSummary;
