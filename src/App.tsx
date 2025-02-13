import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail, Phone, Brain, Database, ChevronRight } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-[#76b900]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-[#76b900] font-bold text-xl">RO</span>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['About', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-300 hover:text-[#76b900] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Navigation Button */}
            <button
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['About', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-[#76b900] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Ruben Otano
              <span className="block text-[#76b900] mt-2">AI/ML Engineer</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Transforming complex data into intelligent solutions
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-[#76b900] hover:bg-[#76b900]/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              Let's Connect <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#76b900] to-[#76b900]/20 flex items-center justify-center">
              {/* <span className="text-gray-400 text-sm">Image placeholder</span> */}
              <img 
                src="https://media.licdn.com/dms/image/v2/D4D03AQHQ4rsKLeeRYw/profile-displayphoto-shrink_800_800/B4DZTx6G8dHkAc-/0/1739225329861?e=1744848000&v=beta&t=oqVEgBjturGJgTZf73mwfawVwYei3VwW_SrodIiW164" 
                alt="Ruben"
                className="w-[200px] h-[200px] rounded-full border-4 border-[#76b900] shadow-[0_0_15px_#76b900]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#76b900]">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 leading-relaxed">
                As an AI/ML Engineer, I specialize in developing cutting-edge solutions that leverage the power of artificial intelligence and machine learning. With a deep understanding of both theoretical concepts and practical applications, I help organizations transform their data into actionable insights and intelligent systems.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                My expertise includes deep learning, computer vision, natural language processing, and reinforcement learning. I'm passionate about staying at the forefront of AI technology and contributing to its advancement.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <Brain className="text-[#76b900] mb-2" size={24} />
                <h3 className="font-semibold mb-2">AI Development</h3>
                <p className="text-gray-400 text-sm">Custom AI solutions for complex problems</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <Database className="text-[#76b900] mb-2" size={24} />
                <h3 className="font-semibold mb-2">ML Engineering</h3>
                <p className="text-gray-400 text-sm">Scalable machine learning systems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#76b900]">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80"
                alt="AI Project"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Computer Vision System</h3>
                <p className="text-gray-400 mb-4">
                  Developed a real-time object detection system using deep learning, achieving 95% accuracy in industrial applications.
                </p>
                <div className="flex gap-2">
                  <span className="bg-[#76b900]/20 text-[#76b900] px-3 py-1 rounded-full text-sm">TensorFlow</span>
                  <span className="bg-[#76b900]/20 text-[#76b900] px-3 py-1 rounded-full text-sm">Python</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
                alt="ML Project"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">NLP Recommendation Engine</h3>
                <p className="text-gray-400 mb-4">
                  Built a sophisticated recommendation system using natural language processing and collaborative filtering.
                </p>
                <div className="flex gap-2">
                  <span className="bg-[#76b900]/20 text-[#76b900] px-3 py-1 rounded-full text-sm">PyTorch</span>
                  <span className="bg-[#76b900]/20 text-[#76b900] px-3 py-1 rounded-full text-sm">FastAPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#76b900]">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-6">
                I'm always interested in hearing about new projects and opportunities. Feel free to reach out!
              </p>
              <div className="space-y-4">
                <a href="mailto:rubenotano13@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-[#76b900] transition-colors">
                  <Mail size={20} />
                  rubenotano13@gmail.com
                </a>
                <a href="tel:7868689166" className="flex items-center gap-3 text-gray-300 hover:text-[#76b900] transition-colors">
                  <Phone size={20} />
                  (786) 868-9166
                </a>
              </div>
              <div className="flex gap-4 mt-6">
                <a href="https://github.com/CynicalCat13" className="text-gray-300 hover:text-[#76b900] transition-colors">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/ruben-otano-54056732b/" className="text-gray-300 hover:text-[#76b900] transition-colors">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#76b900] transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#76b900] transition-colors"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-[#76b900] transition-colors"
              ></textarea>
              <button
                type="submit"
                className="bg-[#76b900] hover:bg-[#76b900]/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;