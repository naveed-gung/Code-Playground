import ReactLogo from '../../../public/Logos/react-playground.svg';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from "@/components/ui/button";

export const reactDescription = "A JavaScript library for building user interfaces with a component-based architecture and reactive updates.";

export const reactStarterCode = `import React, { useState, useEffect } from 'react';

function BouncingBall() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2, y: 3 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        const newPos = {
          x: prev.x + velocity.x,
          y: prev.y + velocity.y
        };
        
        // Bounce logic here
        if (newPos.x <= 0 || newPos.x >= 95) {
          setVelocity(v => ({ ...v, x: -v.x }));
        }
        if (newPos.y <= 0 || newPos.y >= 85) {
          setVelocity(v => ({ ...v, y: -v.y }));
        }
        
        return {
          x: Math.max(0, Math.min(95, newPos.x)),
          y: Math.max(0, Math.min(85, newPos.y))
        };
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [velocity]);

  return (
    <div style={{ 
      position: 'relative',
      width: '300px',
      height: '200px',
      border: '2px solid #ccc',
      borderRadius: '8px'
    }}>
      <div style={{
        position: 'absolute',
        left: position.x + '%',
        top: position.y + '%',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#0088ff',
        transform: 'translate(-50%, -50%)'
      }} />
    </div>
        );
      </div>
    </div>

export default BouncingBall;`;

export const runReactCode = async (code: string) => {
  try {
    // Create a function from the code
    const Component = new Function('React', 'useState', 'useEffect', `
      ${code}
      return BouncingBall;
    `)(React, useState, useEffect);

    // Create a temporary div to render the component
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render the component and capture its initial state
    let output = '';
    try {
      const component = React.createElement(Component);
      ReactDOM.render(component, container);
      
      // Get the component's rendered HTML
      output = container.innerHTML;
    } finally {
      // Clean up
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }

    return {
      output: output || 'Component rendered successfully!',
      error: null
    };
  } catch (error) {
    return {
      output: null,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

const ReactPlayground = () => {
  const [code, setCode] = useState(reactStarterCode);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2, y: 3 });
  const [isAnimating, setIsAnimating] = useState(true);
  const [customOutput, setCustomOutput] = useState<string | null>(null);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        // Bounce off walls
        if (newX <= 0 || newX >= 95) {
          newVelX = -newVelX;
          newX = Math.max(0, Math.min(95, newX));
        }
        if (newY <= 0 || newY >= 85) {
          newVelY = -newVelY;
          newY = Math.max(0, Math.min(85, newY));
        }

        setVelocity({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [velocity, isAnimating]);

  const toggleAnimation = () => setIsAnimating(!isAnimating);
  
  const resetBall = () => {
    setPosition({ x: 50, y: 50 });
    setVelocity({ x: 2, y: 3 });
  };

  const runCode = async () => {
  const result = await runReactCode(code);
  setCustomOutput(result.output);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-background rounded border">
              <h3 className="font-semibold mb-2 flex items-center"><img src={ReactLogo} alt="React" className="w-8 h-8 mr-2" /> React Playground</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div className="w-full min-h-[500px] h-auto border rounded-lg overflow-hidden flex flex-col bg-white bg-opacity-70 backdrop-blur-md">
            <div className="w-full h-full min-h-[500px] bg-white bg-opacity-80">
              <textarea
                className="w-full h-full p-4 font-mono text-sm bg-[#18181b] text-white resize-none focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
            <div className="flex justify-between gap-2 p-2 bg-white backdrop-blur-sm  border-t border-[#404040]">
              <Button
                onClick={() => {
                  setCode(reactStarterCode);
                  setCustomOutput(null);
                }}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                Reset Code
              </Button>
              <Button
                onClick={runCode}
                size="sm"
                className="flex items-center"
              >
               Run Code
              </Button>
            </div>
          </div>

          {/* Live Preview/Output */}
          <div className="w-full h-[500px] border rounded-lg overflow-hidden flex flex-col bg-background">
            {customOutput === null ? (
              <>
                <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 border rounded-lg overflow-hidden">
                  <div
                    className="absolute w-4 h-4 bg-primary rounded-full shadow-lg transition-all duration-100"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={toggleAnimation}>
                    {isAnimating ? 'Pause' : 'Play'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetBall}>
                    Reset
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Position: ({Math.round(position.x)}, {Math.round(position.y)})
                </div>
                <div className="bg-muted p-4 rounded-lg border mt-2">
                  <div className="text-sm font-medium mb-2">Component State:</div>
                  <div className="font-mono text-sm">
                    <div>Position: {JSON.stringify(position)}</div>
                    <div>Velocity: {JSON.stringify(velocity)}</div>
                    <div>Animating: {String(isAnimating)}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-muted p-4 rounded-lg border">
                <div className="text-sm font-medium mb-2">Output:</div>
                <div className="bg-card text-card-foreground p-3 rounded font-mono text-sm border">
                  {customOutput}
                </div>
              </div>
            )}
          </div>
      </div>
      <div className="text-xs text-muted-foreground mt-4">
        💡 Edit the code on the left to modify the cipher implementation. The right panel shows the current running version.
      </div>
    </div>
  </div>
  );
}
export default ReactPlayground;