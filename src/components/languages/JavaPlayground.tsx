import JavaLogo from '../../../public/Logos/java-playground.svg';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export const javaDescription = "A versatile, object-oriented programming language designed to be platform-independent.";

export const javaStarterCode = `public class Calculator {
    private double previousValue;
    private double currentValue;
    private String operation;
    private boolean waitingForOperand;
    
    public Calculator() {
        previousValue = 0;
        currentValue = 0;
        operation = null;
        waitingForOperand = false;
    import JavaLogo from '../../../public/Logos/java-playground.svg';
    }
    
      <h3 className="font-semibold mb-2 flex items-center"><img src={JavaLogo} alt="Java" className="w-8 h-8 mr-2" /> Java Calculator</h3>
        if (waitingForOperand) {
            currentValue = Double.parseDouble(num);
            waitingForOperand = false;
        } else {
            currentValue = currentValue * 10 + Double.parseDouble(num);
        }
        System.out.println("Current value: " + currentValue);
    }
    
    public void inputOperation(String nextOperation) {
        if (previousValue == 0) {
            previousValue = currentValue;
        } else if (operation != null) {
            calculate();
        }
        
        operation = nextOperation;
        waitingForOperand = true;
        System.out.println("Operation: " + operation);
    }
    
    public void calculate() {
        double result = 0;
        
        switch (operation) {
            case "+":
                result = previousValue + currentValue;
                break;
            case "-":
                result = previousValue - currentValue;
                break;
            case "×":
                result = previousValue * currentValue;
                break;
            case "÷":
                if (currentValue != 0) {
                    result = previousValue / currentValue;
                } else {
                    System.out.println("Error: Division by zero");
                    return;
                }
                break;
        }
        
        System.out.println(previousValue + " " + operation + " " + currentValue + " = " + result);
        previousValue = result;
        currentValue = 0;
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        // Example calculation: 5 + 3 = 8
        calc.inputNumber("5");
        calc.inputOperation("+");
        calc.inputNumber("3");
        calc.calculate();
    }
}`;

import { jdoodleAPI, languageConfigs } from '@/lib/jdoodle';

export const runJavaCode = async (code: string) => {
  try {
    const result = await jdoodleAPI.executeCode(
      code,
      languageConfigs.java.language,
      languageConfigs.java.versionIndex
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

const JavaPlayground = () => {
  const [code, setCode] = useState(javaStarterCode);
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [customOutput, setCustomOutput] = useState<string | null>(null);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = currentValue / inputValue;
          break;
      }

      setPreviousValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      let result = 0;
      
      switch (operation) {
        case '+':
          result = previousValue + inputValue;
          break;
        case '-':
          result = previousValue - inputValue;
          break;
        case '*':
          result = previousValue * inputValue;
          break;
        case '/':
          result = previousValue / inputValue;
          break;
      }
      
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const runCode = async () => {
  const result = await runJavaCode(code);
  setCustomOutput(result.output);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-background rounded border">
        <h3 className="font-semibold mb-2 flex items-center"><img src={JavaLogo} alt="Java" className="w-8 h-8 mr-2" /> Java Calculator</h3>
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
                  setCode(javaStarterCode);
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
              <div className="max-w-xs mx-auto bg-muted p-4 rounded-lg border-2 border-border shadow-lg">
                <div className="bg-card text-card-foreground p-3 rounded mb-3 text-right text-xl font-mono border min-h-[50px] flex items-center justify-end">
                  {display}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Button onClick={clear} className="col-span-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center">
                    Clear
                  </Button>
                  <Button onClick={() => inputOperation('/')} variant="outline">÷</Button>
                  <Button onClick={() => inputOperation('*')} variant="outline">×</Button>
                  <Button onClick={() => inputNumber('7')} variant="secondary">7</Button>
                  <Button onClick={() => inputNumber('8')} variant="secondary">8</Button>
                  <Button onClick={() => inputNumber('9')} variant="secondary">9</Button>
                  <Button onClick={() => inputOperation('-')} variant="outline">-</Button>
                  <Button onClick={() => inputNumber('4')} variant="secondary">4</Button>
                  <Button onClick={() => inputNumber('5')} variant="secondary">5</Button>
                  <Button onClick={() => inputNumber('6')} variant="secondary">6</Button>
                  <Button onClick={() => inputOperation('+')} variant="outline">+</Button>
                  <Button onClick={() => inputNumber('1')} variant="secondary">1</Button>
                  <Button onClick={() => inputNumber('2')} variant="secondary">2</Button>
                  <Button onClick={() => inputNumber('3')} variant="secondary">3</Button>
                  <Button onClick={calculate} className="row-span-2 bg-primary text-primary-foreground hover:bg-primary/90">=</Button>
                  <Button onClick={() => inputNumber('0')} variant="secondary" className="col-span-2">0</Button>
                  <Button onClick={() => inputNumber('.')} variant="secondary">.</Button>
                </div>
              </div>
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
}
export default JavaPlayground;