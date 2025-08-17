import DartLogo from '../../../public/Logos/dart-playground.svg';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { jdoodleAPI } from "@/lib/jdoodle";

export const dartDescription = "A client-optimized language from Google for developing fast apps on any platform.";

export const runDartCode = async (code: string) => {
  try {
    const result = await jdoodleAPI.executeCode(code, "dart");
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

export const dartStarterCode = `import 'dart:io';

void main() {
  var game = TicTacToe();
  game.start();
}

class TicTacToe {
  List<String?> board = List.filled(9, null);
  bool isXNext = true;
  String? winner;

  String? calculateWinner(List<String?> squares) {
    final lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (var line in lines) {
      if (squares[line[0]] != null &&
          squares[line[0]] == squares[line[1]] &&
          squares[line[0]] == squares[line[2]]) {
        return squares[line[0]];
      }
    }
    return null;
  }

  void makeMove(int position) {
    if (position < 0 || position > 8) {
      print('Invalid position! Choose 0-8');
      return;
    }

    if (board[position] != null) {
      print('Position already taken! Try again');
      return;
    }

    if (winner != null) {
      print('Game already finished! Final board:');
      printBoard();
      return;
    }

    board[position] = isXNext ? 'X' : 'O';
    isXNext = !isXNext;
    winner = calculateWinner(board);
    
    printBoard();
    
    if (winner != null) {
      print('Player \${winner} wins!');
    } else if (board.every((cell) => cell != null)) {
      print('Game is a draw!');
    } else {
      print('Next player: \${isXNext ? 'X' : 'O'}');
    }
  }

  void printBoard() {
    print('');
    for (int row = 0; row < 3; row++) {
      String line = '';
      for (int col = 0; col < 3; col++) {
        final index = row * 3 + col;
        line += board[index] ?? ' ';
        if (col < 2) line += ' | ';
      }
      print(line);
      if (row < 2) print('---------');
    }
    print('');
  }

  void start() {
    print('Welcome to Tic Tac Toe!\\n');
    print('Board positions:');
    print('0 | 1 | 2');
    print('---------');
    print('3 | 4 | 5');
    print('---------');
    print('6 | 7 | 8\\n');
    
    printBoard();
    print('Player X starts! Enter position (0-8):');

    while (winner == null && board.contains(null)) {
      final input = stdin.readLineSync();
      if (input == null || input.isEmpty) continue;

      try {
        final position = int.parse(input);
        makeMove(position);
      } catch (e) {
        print('Please enter a valid number (0-8)');
      }
    }

    print('\\nGame Over!');
    if (winner != null) {
      print('🎉 Congratulations Player \${winner}!');
    } else {
      print('It\\'s a draw!');
    }
  }
}`;

const TicTacToeGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || calculateWinner(board)) return;
    
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  const status = winner 
    ? `Winner: ${winner}` 
    : isDraw 
      ? "Game is a draw!" 
      : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-semibold mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((square, i) => (
          <button
            key={i}
            className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <Button
        onClick={resetGame}
        variant="outline"
        size="sm"
        className="mt-4"
      >
        Reset Game
      </Button>
    </div>
  );
};

const DartPlayground = () => {
  const [code, setCode] = useState(dartStarterCode);
  const [output, setOutput] = useState<string | null>(null);

  const runCode = async () => {
    const result = await runDartCode(code);
    setOutput(result.output || 'No output');
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-background rounded border">
        <h3 className="font-semibold mb-2 flex items-center">
          <img src={DartLogo} alt="Dart" className="w-8 h-8 mr-2" /> Tic Tac Toe Game
        </h3>
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
            <div className="flex justify-between gap-2 p-2 bg-white backdrop-blur-sm border-t border-[#404040]">
              <Button
                onClick={() => {
                  setCode(dartStarterCode);
                  setOutput(null);
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
          {/* Output Section */}
          <div className="flex flex-col h-full">
            <div className="bg-muted p-4 rounded-lg border flex-1 flex flex-col">
              <div className="text-sm font-medium mb-2">
                {output === null ? 'Interactive Demo:' : 'Code Output:'}
              </div>
              {output === null ? (
                <div className="flex-1 flex items-center justify-center">
                  <TicTacToeGame />
                </div>
              ) : (
                <pre className="bg-card text-card-foreground p-3 rounded font-mono text-sm border whitespace-pre flex-1 overflow-auto">
                  {output}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-4">
        💡 Edit the code on the left to modify the cipher implementation. The right panel shows the current running version.
      </div>
    </div>
  );
};

export default DartPlayground;