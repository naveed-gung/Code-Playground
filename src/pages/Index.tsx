import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import CodePlayground from '@/components/CodePlayground';

import { runPythonCode, pythonStarterCode, pythonDescription } from '@/components/languages/PythonPlayground';
import { runReactCode, reactStarterCode, reactDescription } from '@/components/languages/ReactPlayground';
import { dartDescription, dartStarterCode, runDartCode } from '@/components/languages/DartPlayground';
import { runJavaCode, javaStarterCode, javaDescription } from '@/components/languages/JavaPlayground';
import { runBashCode, bashStarterCode, bashDescription } from '@/components/languages/BashPlayground';
import { runCppCode, cppStarterCode, cppDescription } from '@/components/languages/CppPlayground';

import PythonLogo from '../../public/Logos/python-playground.svg';
import JavaLogo from '../../public/Logos/java-playground.svg';
import BashLogo from '../../public/Logos/bash-playground.svg';
import CppLogo from '../../public/Logos/cpp-playground.svg';
import DartLogo from '../../public/Logos/dart-playground.svg';
import ReactLogo from '../../public/Logos/react-playground.svg';

const languageConfigs = {
  python: {
    name: 'Python',
    icon: <img src={PythonLogo} alt="Python" className="w-10 h-10" />,
    description: pythonDescription,
    starterCode: pythonStarterCode,
    runCode: runPythonCode,
  },
  java: {
    name: 'Java',
    icon: <img src={JavaLogo} alt="Java" className="w-10 h-10" />,
    description: javaDescription,
    starterCode: javaStarterCode,
    runCode: runJavaCode,
  },
  bash: {
    name: 'Bash',
    icon: <img src={BashLogo} alt="Bash" className="w-10 h-10" />,
    description: bashDescription,
    starterCode: bashStarterCode,
    runCode: runBashCode,
  },
  cpp: {
    name: 'C++',
    icon: <img src={CppLogo} alt="C++" className="w-10 h-10" />,
    description: cppDescription,
    starterCode: cppStarterCode,
    runCode: runCppCode,
  },
  dart: {
    name: 'Dart',
    icon: <img src={DartLogo} alt="Dart" className="w-10 h-10" />,
    description: dartDescription,
    starterCode: dartStarterCode,
    runCode: runDartCode,
  },
  react: {
    name: 'React',
    icon: <img src={ReactLogo} alt="React" className="w-10 h-10" />,
    description: reactDescription,
    starterCode: reactStarterCode,
    runCode: runReactCode,
  },
};
const Index = () => {
  const location = useLocation();
  const initialLanguage = location.state?.selectedLanguage || 'python';
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const currentConfig = languageConfigs[selectedLanguage as keyof typeof languageConfigs];

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Sidebar 
            selectedLanguage={selectedLanguage} 
            onLanguageSelect={setSelectedLanguage} 
          />
        </motion.div>
        <AnimatePresence mode="wait">
          <CodePlayground
            key={selectedLanguage}
            language={currentConfig.name}
            initialCode={currentConfig.starterCode}
            onRun={currentConfig.runCode}
            description={currentConfig.description}
            icon={currentConfig.icon}
          />
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
