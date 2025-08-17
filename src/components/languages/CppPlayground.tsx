import CppLogo from '../../../public/Logos/cpp-playground.svg';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const cppDescription = "A powerful, high-performance programming language that extends C with object-oriented features.";

export const cppStarterCode = `#include <iostream>
using namespace std;

void printPattern(int height, string pattern) {
    if (pattern == "pyramid") {
        // Print pyramid pattern
        for (int i = 1; i <= height; i++) {
            // Print spaces
            for (int j = 1; j <= height - i; j++)
                cout << " ";
            
            // Print stars
            for (int j = 1; j <= 2 * i - 1; j++)
                cout << "*";
                
            cout << endl;
        }
    }
    else if (pattern == "diamond") {
        // Print upper half
        for (int i = 1; i <= height; i++) {
            for (int j = 1; j <= height - i; j++)
                cout << " ";
            for (int j = 1; j <= 2 * i - 1; j++)
                cout << "*";
            cout << endl;
        }
        
        // Print lower half
        for (int i = height - 1; i >= 1; i--) {
            for (int j = 1; j <= height - i; j++)
                cout << " ";
            for (int j = 1; j <= 2 * i - 1; j++)
                cout << "*";
            cout << endl;
        }
    }
}

int main() {
    int height;
    string pattern;
    
    cout << "Enter pattern height: ";
    cin >> height;
    
    cout << "Enter pattern type (pyramid/diamond): ";
    cin >> pattern;
    
    printPattern(height, pattern);
    return 0;
}`;

import { jdoodleAPI, languageConfigs } from '@/lib/jdoodle';

export const runCppCode = async (code: string) => {
  try {
    const result = await jdoodleAPI.executeCode(
      code,
      languageConfigs.cpp.language,
      languageConfigs.cpp.versionIndex
    );

    return {
      output: result.output,
      error: result.error || null
    };
  } catch (error) {
    return {
      output: null,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

const CppPlayground = () => {
  const [height, setHeight] = useState(7);
  const [pattern, setPattern] = useState('pyramid');
  const [output, setOutput] = useState('');
  const [code, setCode] = useState(cppStarterCode);
  const [customOutput, setCustomOutput] = useState<string | null>(null);

  const generatePyramid = (h: number) => {
    let result = '';
    for (let i = 1; i <= h; i++) {
      // Add leading spaces
      const spaces = ' '.repeat(h - i);
      // Add stars
      const stars = '*'.repeat(2 * i - 1);
      result += spaces + stars + '\n';
    }
    return result;
  };

  const generateDiamond = (h: number) => {
    let result = '';
    // Upper half (pyramid)
    for (let i = 1; i <= h; i++) {
      const spaces = ' '.repeat(h - i);
      const stars = '*'.repeat(2 * i - 1);
      result += spaces + stars + '\n';
    }
    // Lower half (inverted pyramid)
    for (let i = h - 1; i >= 1; i--) {
      const spaces = ' '.repeat(h - i);
      const stars = '*'.repeat(2 * i - 1);
      result += spaces + stars + '\n';
    }
    return result;
  };

  const generateTriangle = (h: number) => {
    let result = '';
    for (let i = 1; i <= h; i++) {
      result += '*'.repeat(i) + '\n';
    }
    return result;
  };

  const generateSquare = (h: number) => {
    let result = '';
    for (let i = 0; i < h; i++) {
      if (i === 0 || i === h - 1) {
        // Top and bottom borders
        result += '*'.repeat(h) + '\n';
      } else {
        // Side borders only
        result += '*' + ' '.repeat(h - 2) + '*' + '\n';
      }
    }
    return result;
  };

  const generatePattern = () => {
    let ascii = '';
    
    switch (pattern) {
      case 'pyramid':
        ascii = generatePyramid(height);
        break;
      case 'diamond':
        ascii = generateDiamond(height);
        break;
      case 'triangle':
        ascii = generateTriangle(height);
        break;
      case 'square':
        ascii = generateSquare(height);
        break;
    }
    
    setOutput(ascii);
  };

  const patterns = [
    { id: 'pyramid', name: 'Pyramid', description: 'Classic centered pyramid' },
    { id: 'diamond', name: 'Diamond', description: 'Diamond shape with symmetry' },
    { id: 'triangle', name: 'Triangle', description: 'Right-aligned triangle' },
    { id: 'square', name: 'Square', description: 'Hollow square border' }
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-background rounded border">
        <h3 className="font-semibold mb-2 flex items-center"><img src={CppLogo} alt="C++" className="w-8 h-8 mr-2" /> C++ ASCII Art Generator</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="w-full min-h-[500px] h-auto border rounded-lg overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
            <div className="w-full h-full min-h-[500px] bg-[#1e1e1e]">
              <textarea
                className="w-full h-full p-4 font-mono text-sm bg-[#1e1e1e] text-white resize-none focus:outline-none"
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
            <div className="flex justify-between gap-2 p-2 bg-white backdrop-blur-sm  border-t border-[#404040]">
              <Button
                onClick={() => {
                  setCode(cppStarterCode);
                  setCustomOutput(null);
                }}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                Reset Code
              </Button>
              <Button
                onClick={async () => {
                  const result = await runCppCode(code);
                  setCustomOutput(result.output);
                }}
                size="sm"
                className="flex items-center"
              >
                Run Code
              </Button>
            </div>
          </div>
          {/* Live Preview or Output */}
          <div className="space-y-4">
            {customOutput === null ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pattern:</label>
                    <select 
                      value={pattern} 
                      onChange={(e) => setPattern(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      {patterns.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {p.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Size:</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Math.max(3, Math.min(15, Number(e.target.value))))}
                      min="3"
                      max="15"
                      className="font-mono"
                    />
                  </div>
                </div>
                <Button onClick={generatePattern} className="bg-primary flex items-center">
                  <img src={CppLogo} alt="C++" className="w-5 h-5 mr-2" />Generate ASCII Art
                </Button>
                <div className="bg-muted p-4 rounded-lg border">
                  <div className="text-sm font-medium mb-2">C++ Console Output:</div>
                  <div className="bg-card text-card-foreground p-3 rounded font-mono text-sm border overflow-x-auto">
                    <div className="text-primary flex items-center"><img src={CppLogo} alt="C++" className="w-5 h-5 mr-2" />C++ ASCII Art Generator</div>
                    <div className="text-muted-foreground">==============================</div>
                    <div>Pattern: {patterns.find(p => p.id === pattern)?.name}</div>
                    <div>Size: {height}</div>
                    <div className="my-2">Generating pattern...</div>
                    {output && (
                      <>
                        <div className="my-2 text-green-600">Generated ASCII Art:</div>
                        <div className="bg-background p-2 rounded border">
                          <pre className="text-primary leading-tight">{output}</pre>
                        </div>
                        <div className="mt-2 text-muted-foreground">
                          ASCII art generation complete! 
                          (Lines: {output.split('\n').length - 1}, Characters: {output.length})
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  This demonstrates C++ loops, string manipulation, and console output formatting.
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
      </div>
      <div className="text-xs text-muted-foreground mt-4">
        💡 Edit the code on the left to modify the cipher implementation. The right panel shows the current running version.
      </div>
    </div>
  );
};

export default CppPlayground;