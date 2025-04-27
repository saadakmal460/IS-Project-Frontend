import React, { useEffect, useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../../Redux/UserSlice";

const SecureSummary = () => {
  
  const { data } = useSelector((state) => state.user);


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
      // 1. Get backend's public key for encryption
      const { data: pemKey } = await axios.get("http://localhost:5000/api/crypto/public-key", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        }
      });
      const backendPublicKey = await importRSAPublicKey(pemKey);

      // 2. Generate AES key and IV
      const aesKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const fileBuffer = await selectedDocument.arrayBuffer();

      // 3. Encrypt file using AES-GCM
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        fileBuffer
      );

      // 4. Export AES key and encrypt with backend's public key
      const rawAES = await window.crypto.subtle.exportKey("raw", aesKey);
      const encryptedAESKey = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        backendPublicKey,
        rawAES
      );
      const encryptedIV = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        backendPublicKey,
        iv
      );
      const authTag = encryptedData.slice(-16);

      // 5. Generate RSA key pair for signing
      const rsaKeyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-PSS",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );

      const exportedRSAPublicKeyPEM = await exportRSAPublicKey(rsaKeyPair.publicKey);

      // 6. Sign the encrypted data
      const dataToSign = new Uint8Array([
        ...new Uint8Array(encryptedData), // encrypted file
        ...new Uint8Array(encryptedAESKey), // encrypted AES key
        ...new Uint8Array(encryptedIV), // encrypted IV
        ...new Uint8Array(authTag) // auth tag
      ]);

      const signature = await window.crypto.subtle.sign(
        {
          name: "RSA-PSS",
          saltLength: 32,
        },
        rsaKeyPair.privateKey,
        dataToSign
      );

      const ext = selectedDocument.name.split('.').pop()

      // 7. Prepare FormData
      const formData = new FormData();
      formData.append("file_extension", ext);
      formData.append("file", new Blob([encryptedData.slice(0, -16)]), selectedDocument.name);
      formData.append("data", new Blob([encryptedData]), selectedDocument.name);
      formData.append("key", new Blob([encryptedAESKey]));
      formData.append("iv", new Blob([encryptedIV]));
      formData.append("auth_tag", new Blob([authTag]));
      formData.append("signature", new Blob([signature]));
      formData.append("publicKey", exportedRSAPublicKeyPEM);
      formData.append("captcha_token", captchaToken);


      // 8. Send to backend
      const response = await axios.post("http://localhost:5000/api/model/summarize", formData , { headers: {
        Authorization: `Bearer ${data.token}`,
      }}
    );

      setSummary(response.data.summary);
    } catch (err) {
      console.error(err.message);
      console.error("Error response:", err.response.data);
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

  async function exportRSAPublicKey(key) {
    // Export the RSA public key in SPKI format (binary format)
    const exported = await window.crypto.subtle.exportKey("spki", key);

    // Convert the ArrayBuffer (binary data) to a string
    const exportedAsString = String.fromCharCode(...new Uint8Array(exported));

    // Convert the string to base64
    let exportedAsBase64 = btoa(exportedAsString);

    // Fix base64 padding if necessary
    const paddingNeeded = (4 - (exportedAsBase64.length % 4)) % 4;
    exportedAsBase64 += '='.repeat(paddingNeeded);

    // Format the base64 string in PEM format (with the appropriate headers and line breaks)
    const pemFormattedKey = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;

    return pemFormattedKey;
  }



  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Document Summarizer</h1>

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
