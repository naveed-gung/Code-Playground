import { useEffect, useState } from 'react';
import PythonLogo from '../../public/Logos/python-playground.svg';
import JavaLogo from '../../public/Logos/java-playground.svg';
import BashLogo from '../../public/Logos/bash-playground.svg';
import CppLogo from '../../public/Logos/cpp-playground.svg';
import ReactLogo from '../../public/Logos/react-playground.svg';
import DartLogo from '../../public/Logos/dart-playground.svg';
import BalloonLogo from '../../public/balloon.svg';

export const logos = [
  { src: PythonLogo, alt: 'Python', delay: 0, color: '#3776AB' },
  { src: JavaLogo, alt: 'Java', delay: 0.1, color: '#007396' },
  { src: BashLogo, alt: 'Bash', delay: 0.2, color: '#4EAA25' },
  { src: CppLogo, alt: 'C++', delay: 0.3, color: '#00599C' },
  { src: ReactLogo, alt: 'React', delay: 0.5, color: '#61DAFB' },
  { src: DartLogo, alt: 'Dart', delay: 0.6, color: '#0175C2' },
  { src: BalloonLogo, alt: 'Balloon', delay: 0.7, color: '#FF69B4' }
];

export const usePreloadLogos = () => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalLogos = logos.length;
    let loadedCount = 0;

    const preloadImages = async () => {
      const imagePromises = logos.map(logo => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = logo.src;
          img.onload = () => {
            loadedCount++;
            setProgress(Math.round((loadedCount / totalLogos) * 100));
            resolve();
          };
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setLoaded(true);
      }
    };

    preloadImages();
  }, []);

  return { loaded, progress };
};

export default function PreloadLogos() {
  const { loaded, progress } = usePreloadLogos();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#E6FFDA] to-[#FCF5EB] z-50 flex items-center justify-center transition-opacity duration-500"
         style={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'auto' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-lg font-medium mb-2">Loading Playgrounds...</div>
        <div className="text-sm text-gray-600">{progress}%</div>
      </div>
    </div>
  );
}
