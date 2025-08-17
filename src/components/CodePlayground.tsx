import { Card } from "@/components/ui/card";
import PythonPlayground from "./languages/PythonPlayground";
import JavaPlayground from "./languages/JavaPlayground";
import BashPlayground from "./languages/BashPlayground";
import CppPlayground from "./languages/CppPlayground";
import DartPlayground from "./languages/DartPlayground";
import ReactPlayground from "./languages/ReactPlayground";
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const containerVariants = {
  hidden: { 
    opacity: 0,
    transform: 'scale(0.95) translateY(20px)'
  },
  visible: {
    opacity: 1,
    transform: 'scale(1) translateY(0px)',
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transform: 'scale(0.95) translateY(-20px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
} as const;

const itemVariants = {
  hidden: { 
    opacity: 0,
    x: -20,
    y: 20
  },
  visible: { 
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
} as const;

const cardVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 30
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.3
    }
  }
} as const;

interface CodePlaygroundProps {
  language: string;
  description: string;
  icon: ReactNode;
  // Optional props for language-specific configurations
  initialCode?: string;
  onRun?: (code: string) => Promise<any>;
}

const CodePlayground = ({ language, description, icon }: CodePlaygroundProps) => {
  const renderPlayground = () => {
    switch (language) {
      case 'Python':
        return <PythonPlayground />;
      case 'Java':
        return <JavaPlayground />;
      case 'Bash':
        return <BashPlayground />;
      case 'C++':
        return <CppPlayground />;
      case 'Dart':
        return <DartPlayground />;
      case 'React':
        return <ReactPlayground />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="flex-1 p-6 space-y-6 overflow-auto"
    >
      <motion.div 
        variants={itemVariants} 
        className="flex items-center space-x-4"
      >
        <motion.span
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="text-4xl"
        >
          {icon}
        </motion.span>
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-foreground">Welcome to {language}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        layoutId="playground-card"
      >
        <Card className="mt-6">
          <motion.div 
            variants={itemVariants}
            className="p-6"
          >
            {renderPlayground()}
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CodePlayground;