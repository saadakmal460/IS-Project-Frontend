import React from 'react'

const Home = () => {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 drop-shadow-sm mb-4">
          DOC CRUX
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-6">
          Transform lengthy documents into clear, concise summaries with the power of AI – all secured by Zero Trust architecture.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg transition">
          Get Started
        </button>

        <img 
          src="https://illustrations.popsy.co/gray/document.svg" 
          alt="Document illustration"
          className="w-full max-w-lg mt-10"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose DOC CRUX?</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">AI-Powered Summarization</h3>
            <p>Leverage advanced NLP models to extract meaningful summaries in seconds.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">Zero Trust Security</h3>
            <p>Your data is protected with Zero Trust principles, ensuring top-tier confidentiality.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">User-Friendly Interface</h3>
            <p>Simplified and intuitive UI/UX so you can upload, process, and download results easily.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-blue-50 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-gray-700">
          <div>
            <span className="text-4xl font-bold text-blue-600">1</span>
            <h4 className="text-xl font-semibold mt-2">Upload Document</h4>
            <p className="text-sm mt-1">Upload PDFs, DOCX, or text files securely.</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-blue-600">2</span>
            <h4 className="text-xl font-semibold mt-2">AI Processes</h4>
            <p className="text-sm mt-1">Our AI model analyzes content using NLP techniques.</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-blue-600">3</span>
            <h4 className="text-xl font-semibold mt-2">Summary Ready</h4>
            <p className="text-sm mt-1">Receive an accurate, readable summary in seconds.</p>
          </div>
          <div>
            <span className="text-4xl font-bold text-blue-600">4</span>
            <h4 className="text-xl font-semibold mt-2">Download or Share</h4>
            <p className="text-sm mt-1">Export your summary or share it securely.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Summarize Smarter?</h2>
        <p className="text-gray-600 mb-6">Join hundreds of users already using DOC CRUX to save time and stay secure.</p>
        <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition">
          Try Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} DOC CRUX. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
