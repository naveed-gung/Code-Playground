import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PreloadLogos, { logos, usePreloadLogos } from '@/components/PreloadLogos';

// This ensures we track if we've shown the welcome screen in this session
const welcomeShownKey = 'welcomeScreenShown';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Map of language names to their playground routes
const languageMap = {
  'Python': 'python',
  'Java': 'java',
  'Bash': 'bash',
  'C++': 'cpp',
  'React': 'react',
  'Dart': 'dart'
} as const;

const Welcome = () => {
  const navigate = useNavigate();
  const { loaded } = usePreloadLogos();
  const [isExiting, setIsExiting] = useState(false);

  // Ensure we're always showing the welcome screen on mount
  useEffect(() => {
    // Ensure the welcome screen is visible
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const startPlayground = async () => {
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate('/playground');
  };

  const startRandomPlayground = async () => {
    setIsExiting(true);
    const languages = Object.keys(languageMap);
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)] as keyof typeof languageMap;
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate('/playground', { state: { selectedLanguage: languageMap[randomLanguage] } });
  };

  if (!loaded) {
    return <PreloadLogos />;
  }

  return (
    <motion.div
      initial="hidden"
      animate={isExiting ? "exit" : "show"}
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-[#E6FFDA] to-[#FCF5EB] relative overflow-y-auto md:overflow-y-auto max-h-[100vh] md:max-h-screen"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 pt-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            🚀 Welcome to Code Playground
          </h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-4 mt-4">
            Learn. Play. Code. Run.
          </motion.p>
          <motion.p variants={itemVariants} className="text-base lg:text-lg text-gray-500 max-w-3xl mx-auto mb-8">
            An interactive coding environment where you can explore different programming languages,
            run live code, and see results instantly — all in your browser.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8"
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.alt}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-24 h-24 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, white 0%, ${logo.color}15 100%)`,
                  borderBottom: `3px solid ${logo.color}30`
                }}
              >
                <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
              </div>
              <span className="mt-3 text-sm font-medium text-gray-600">{logo.alt}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={containerVariants} className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '1. Select a language', icon: '🎯', description: 'Choose from a variety of programming languages' },
              { title: '2. Edit the code', icon: '✏️', description: 'Write or modify code in our interactive editor' },
              { title: '3. Run & see results', icon: '✨', description: 'Execute your code and see instant results' }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-medium text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button
              onClick={startPlayground}
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-white transform hover:scale-105 transition-transform duration-300"
            >
              Start Coding Playground
            </Button>
          </div>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-sm text-gray-500 italic"
          >
            Pick your language or try something random. Edit the code. Run it. Watch it come alive.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Welcome;
