import PythonLogo from '../../../public/Logos/python-playground.svg';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

import { jdoodleAPI, languageConfigs } from '@/lib/jdoodle';

export const runPythonCode = async (code: string) => {
  try {
    const result = await jdoodleAPI.executeCode(
      code,
      languageConfigs.python.language,
      languageConfigs.python.versionIndex
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

const PythonPlayground = () => {
  const [gameState, setGameState] = useState({
    targetNumber: Math.floor(Math.random() * 100) + 1,
    message: '',
    won: false,
    attempts: 0
  });
  const [guess, setGuess] = useState('');
  const [code, setCode] = useState(pythonStarterCode);
  const [customOutput, setCustomOutput] = useState<string | null>(null);

  const handleGuess = () => {
    if (!guess) return;

    const numberGuess = parseInt(guess);
    setGameState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      message: numberGuess === prev.targetNumber
        ? '🎉 Congratulations! You got it!'
        : numberGuess < prev.targetNumber
          ? '⬆️ Go higher!'
          : '⬇️ Go lower!',
      won: numberGuess === prev.targetNumber
    }));
    setGuess('');
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-background rounded border">
        <h3 className="font-semibold mb-2 flex items-center"><img src={PythonLogo} alt="Python" className="w-8 h-8 mr-2" /> Number Guessing Game</h3>
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
                  setCode(pythonStarterCode);
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
                  const result = await runPythonCode(code);
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
                <p className="text-sm text-muted-foreground mb-4">
                  I'm thinking of a number between 1 and 100. Can you guess it?
                </p>
                {gameState.message && (
                  <div className={`p-2 rounded mb-4 ${
                    gameState.won ? 'bg-green-100 text-green-800' : 
                    gameState.message.includes('higher') ? 'bg-blue-100 text-blue-800' :
                    gameState.message.includes('lower') ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {gameState.message.replace('🎉', '').replace('⬆️', '').replace('⬇️', '')}
                  </div>
                )}
                {!gameState.won ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleGuess();
                  }} className="flex gap-2">
                    <input
                      type="number"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded"
                      placeholder="Enter your guess"
                      min="1"
                      max="100"
                    />
                    <Button type="submit" size="sm" className="flex items-center">
Guess!
                    </Button>
                  </form>
                ) : (
                  <Button onClick={() => {
                    setGameState({
                      targetNumber: Math.floor(Math.random() * 100) + 1,
                      message: '',
                      won: false,
                      attempts: 0
                    });
                    setGuess('');
                  }} size="sm" className="flex items-center">
                    <img src={PythonLogo} alt="Python" className="w-5 h-5 mr-2" />Play Again
                  </Button>
                )}
                <div className="mt-4 text-sm text-muted-foreground">
                  Attempts: {gameState.attempts}
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

export const pythonStarterCode = `# Python Number Guessing Game
import random

def number_guessing_game():
    number = random.randint(1, 100)
    attempts = 0
    
    print("🎲 Welcome to the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")
    
    while True:
        try:
            guess = int(input("Enter your guess: "))
            attempts += 1
            
            if guess == number:
                print(f"🎉 Congratulations! You guessed it in {attempts} attempts!")
                break
            elif guess < number:
                print("📈 Try a higher number!")
            else:
                print("📉 Try a lower number!")
                
        except ValueError:
            print("Please enter a valid number!")

# Run the game
number_guessing_game()`;

export const pythonDescription = "A versatile, high-level programming language known for its simplicity and readability. Perfect for beginners and powerful enough for complex applications.";

export default PythonPlayground;