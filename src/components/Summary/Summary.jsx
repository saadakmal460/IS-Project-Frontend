import React, { useState } from "react";
import axios from "axios";

const Summary = () => {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentSummary, setDocumentSummary] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleDocumentSelection = (event) => {
        const uploadedDocument = event.target.files[0];
        if (uploadedDocument && (uploadedDocument.type === 'application/pdf' || uploadedDocument.type === 'text/plain')) {
            setSelectedDocument(uploadedDocument);
            setErrorMessage("");
        } else {
            setErrorMessage("Please upload a valid PDF or TXT file.");
            setSelectedDocument(null);
        }
    };

    const handleSummarizeDocument = async () => {
        if (!selectedDocument) {
            setErrorMessage("Please upload a document.");
            return;
        }

        setErrorMessage("");
        setDocumentSummary("");
        setIsSummarizing(true);

        const documentData = new FormData();
        documentData.append("file", selectedDocument);

        try {
            const apiResponse = await axios.post(
                "http://127.0.0.1:5000/summarize",
                documentData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setDocumentSummary(apiResponse.data.summary || "No summary available.");
        } catch (error) {
            setErrorMessage(
                error.response?.data?.error || "Failed to summarize the document. Please try again."
            );
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="min-h-screen p-6 max-w-3xl mx-auto bg-white">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Document Summarizer</h1>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <label className="flex items-center gap-3 flex-1">
                    <input
                        type="file"
                        onChange={handleDocumentSelection}
                        accept=".pdf,.txt"
                        className="hidden"
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                        Choose File
                    </label>
                    <span className="truncate text-gray-700">
                        {selectedDocument ? selectedDocument.name : "No file selected"}
                    </span>
                </label>

                <button
                    onClick={handleSummarizeDocument}
                    disabled={!selectedDocument || isSummarizing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isSummarizing ? "Summarizing..." : "Summarize"}
                </button>
            </div>

            {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded text-red-700">
                    <p>{errorMessage}</p>
                </div>
            )}

            {documentSummary && (
                <div className="bg-gray-50 rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{documentSummary}</p>
                    <p className="mt-4 text-sm text-gray-600">
                        Word Count: {documentSummary.split(/\s+/).filter(word => word.length > 0).length}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Summary;
