import BashLogo from '../../../public/Logos/bash-playground.svg';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const bashDescription = "A Unix shell and command language interpreter, commonly used for shell scripting and automation.";

export const bashStarterCode = String.raw`#!/bin/bash
# Simple Caesar Cipher using tr command
text="Hello World"
shift=3

# Create the substitution alphabet for the given shift
alpha="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
shifted="$(echo $alpha | sed "s/^\\(.*\\)\\(.\\{$shift\\}\\)/\\2\\1/")"

echo "Original text: $text"
echo "Shift value: $shift"

# Encrypt
encrypted=$(echo "$text" | tr "$alpha" "$shifted")
echo "Encrypted: $encrypted"

# Decrypt
decrypted=$(echo "$encrypted" | tr "$shifted" "$alpha")
echo "Decrypted: $decrypted"`;

import { jdoodleAPI, languageConfigs } from '@/lib/jdoodle';

export const runBashCode = async (code: string) => {
  try {
    const result = await jdoodleAPI.executeCode(
      code,
      languageConfigs.bash.language,
      languageConfigs.bash.versionIndex
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

const BashPlayground = () => {
  const [code, setCode] = useState(bashStarterCode);
  const [inputText, setInputText] = useState('Hello World!');
  const [shift, setShift] = useState(3);
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [customOutput, setCustomOutput] = useState<string | null>(null);

  const caesarEncrypt = (text: string, shiftValue: number) => {
    return text.split('').map(char => {
      if (char.match(/[A-Za-z]/)) {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.toLowerCase().charCodeAt(0);
        const shifted = ((charCode - 97 + shiftValue) % 26 + 26) % 26 + 97;
        const newChar = String.fromCharCode(shifted);
        return isUpperCase ? newChar.toUpperCase() : newChar;
      }
      return char;
    }).join('');
  };

  const caesarDecrypt = (text: string, shiftValue: number) => {
    return caesarEncrypt(text, -shiftValue);
  };

  const handleEncrypt = () => {
    const encrypted = caesarEncrypt(inputText, shift);
    setEncryptedText(encrypted);
  };

  const handleDecrypt = () => {
    if (encryptedText) {
      const decrypted = caesarDecrypt(encryptedText, shift);
      setDecryptedText(decrypted);
    }
  };

  const resetDemo = () => {
    setInputText('Hello World!');
    setShift(3);
    setEncryptedText('');
    setDecryptedText('');
  };

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };
  // ...existing code...
  const runCode = async () => {
  const result = await runBashCode(code);
  // When running code, clear the right panel and show only output
  setCustomOutput(result.output);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-background rounded border">
        <h3 className="font-semibold mb-4 flex items-center"><img src={BashLogo} alt="Bash" className="w-8 h-8 mr-2" /> Bash Playground</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div className="w-full min-h-[500px] h-auto border rounded-lg overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
            <div className="w-full h-full min-h-[500px] bg-[#1e1e1e]">
              <textarea
                className="w-full h-full p-4 font-mono text-sm bg-[#1e1e1e] text-white resize-none focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
            <div className="flex justify-between gap-2 p-2 bg-white backdrop-blur-sm  border-t border-[#404040]">
              <Button
                onClick={() => {
                  setCode(bashStarterCode);
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
          {/* Live Preview or Output */}
          <div className="space-y-4">
            {customOutput === null ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input Text:</label>
                    <Input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter text to encrypt"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shift Value:</label>
                    <Input
                      type="number"
                      value={shift}
                      onChange={(e) => setShift(Number(e.target.value))}
                      min="1"
                      max="25"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEncrypt} className="bg-primary flex items-center">
                    <img src={BashLogo} alt="Bash" className="w-5 h-5 mr-2" />Encrypt
                  </Button>
                  <Button onClick={handleDecrypt} variant="outline" disabled={!encryptedText} className="flex items-center">
                    <img src={BashLogo} alt="Bash" className="w-5 h-5 mr-2" />Decrypt
                  </Button>
                  <Button onClick={resetDemo} variant="ghost" className="flex items-center">
                    <img src={BashLogo} alt="Bash" className="w-5 h-5 mr-2" />Reset
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg border">
                  <div className="text-sm font-medium mb-2">Terminal Output:</div>
                  <div className="bg-card text-card-foreground p-3 rounded font-mono text-sm border">
                    <div className="text-primary">$ ./caesar_cipher.sh</div>
                    <div>Original: "{inputText}"</div>
                    <div>Shift: {shift}</div>
                    {encryptedText && (
                      <>
                        <div className="text-green-600 mt-2">Encrypted: "{encryptedText}"</div>
                        <div className="text-muted-foreground">Length: {encryptedText.length} characters</div>
                      </>
                    )}
                    {decryptedText && (
                      <>
                        <div className="text-blue-600 mt-2">Decrypted: "{decryptedText}"</div>
                        <div className="text-muted-foreground">✅ Decryption successful!</div>
                      </>
                    )}
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
export default BashPlayground;