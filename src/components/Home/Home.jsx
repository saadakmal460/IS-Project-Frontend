import React from 'react';

const Home = () => {
  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col">

      {/* NavBar */}
      <header className="bg-white/70 backdrop-blur-md shadow-md fixed w-full z-20 top-0 left-0">
        <div className="flex justify-between items-center py-4 px-6 relative">
          {/* Logo */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl font-heading text-blue-700">
            DOC CRUX
          </div>

          {/* Centered Nav Links */}
          <nav className="mx-auto flex space-x-8 text-gray-700 font-medium">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#howitworks" className="hover:text-blue-600">How It Works</a>
            <a href="#getstarted" className="hover:text-blue-600">Get Started</a>
          </nav>
        </div>
      </header>

      <main className="pt-20 w-full">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col rounded-2xl justify-center items-center text-center bg-gradient-to-br from-blue-300 via-white to-blue-300 w-full">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-blue-700 drop-shadow mb-4">
            DOC CRUX
          </h1>
          <p className="text-lg md:text-xl font-roboto text-gray-600 mb-6 w-full">
            Transform lengthy documents into clear, concise summaries with the power of AI – all secured by Zero Trust architecture.
          </p>
          <a href="#getstarted">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg transition">
              Get Started
            </button>
          </a>
          
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white text-center w-full">
          <h2 className="text-4xl font-heading font-bold text-gray-800 mb-12">Why Choose DOC CRUX?</h2>
          <div className="grid md:grid-cols-3 gap-12 px-6">
            {[ 
              { title: "AI-Powered Summarization", desc: "Leverage advanced NLP models to extract meaningful summaries in seconds." },
              { title: "Zero Trust Security", desc: "Your data is protected with Zero Trust principles, ensuring top-tier confidentiality." },
              { title: "User-Friendly Interface", desc: "Simplified and intuitive UI/UX to upload, process, and download results easily." }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-100 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-heading font-semibold text-blue-700 mb-4">{feature.title}</h3>
                <p className="font-roboto text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="howitworks" className="py-20 rounded-2xl bg-blue-100 text-center w-full shadow-md">
          <h2 className="text-4xl font-heading font-bold  text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-10 px-6 text-gray-700 ">
            {[ 
              { step: "1", title: "Upload Document", desc: "Upload PDFs, DOCX, or text files securely." },
              { step: "2", title: "AI Processes", desc: "Our AI analyzes content using NLP techniques." },
              { step: "3", title: "Summary Ready", desc: "Receive an accurate, readable summary in seconds." },
              { step: "4", title: "Download or Share", desc: "Export your summary or share it securely." }
            ].map((item, index) => (
              <div key={index}>
                <span className="text-5xl font-heading font-bold text-blue-600">{item.step}</span>
                <h4 className="text-xl font-heading font-semibold mt-4 ">{item.title}</h4>
                <p className="font-roboto text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="getstarted" className="py-16 bg-white text-center w-full">
          <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4">Ready to Summarize Smarter?</h2>
          <p className="font-roboto text-gray-600 mb-8 w-full max-w-2xl mx-auto">
            Join hundreds of users already using DOC CRUX to save time and stay secure.
          </p>
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-md transition">
            Try Now
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} DOC CRUX. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;
