import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const languageFacts = [
  { 
    language: "Python",
    facts: [
      "Python was named after the TV show 'Monty Python's Flying Circus', not the snake!",
      "Python's philosophy emphasizes code readability with its notable use of significant whitespace",
      "The Python Package Index (PyPI) hosts over 300,000 Python packages"
    ],
    snippets: [
      {
        title: "List Comprehension",
        code: "# Create a list of squares\nnumbers = [1, 2, 3, 4, 5]\nsquares = [n**2 for n in numbers]\nprint(squares)  # [1, 4, 9, 16, 25]"
      },
      {
        title: "Context Manager",
        code: "# Automatically handle file closing\nwith open('file.txt', 'r') as file:\n    content = file.read()\n    print(content)"
      }
    ]
  },
  {
    language: "JavaScript",
    facts: [
      "JavaScript was created in just 10 days in May 1995 by Brendan Eich",
      "Despite the name, JavaScript has nothing to do with Java",
      "JavaScript is the only language that can run natively in browsers"
    ],
    snippets: [
      {
        title: "Array Methods",
        code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers\n  .map(n => n * 2)\n  .filter(n => n > 5);\nconsole.log(doubled);  // [6, 8, 10]"
      },
      {
        title: "Async/Await",
        code: "async function fetchData() {\n  try {\n    const response = await fetch('api/data');\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error(error);\n  }\n}"
      }
    ]
  },
  {
    language: "Java",
    facts: [
      "Java's original name was 'Oak', named after a tree outside James Gosling's office",
      "Java's 'write once, run anywhere' capability made it revolutionary",
      "Android's primary development language is Java"
    ],
    snippets: [
      {
        title: "Stream API",
        code: "List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);\nList<Integer> doubled = numbers.stream()\n    .map(n -> n * 2)\n    .collect(Collectors.toList());\nSystem.out.println(doubled);  // [2, 4, 6, 8, 10]"
      },
      {
        title: "Optional Usage",
        code: "Optional<String> optional = Optional.of(\"hello\");\nString result = optional\n    .map(String::toUpperCase)\n    .orElse(\"EMPTY\");\nSystem.out.println(result);  // HELLO"
      }
    ]
  },
  {
    language: "C++",
    facts: [
      "C++ was originally called 'C with Classes' before it was renamed in 1983",
      "C++ directly influenced many other languages including Java and C#",
      "C++ is widely used in game development and high-performance applications"
    ],
    snippets: [
      {
        title: "Smart Pointers",
        code: "#include <memory>\n\nauto ptr = std::make_unique<int>(42);\nstd::cout << *ptr << std::endl;  // 42\n// No need to delete, memory is automatically managed"
      },
      {
        title: "Lambda Expression",
        code: "auto add = [](int a, int b) { return a + b; };\nstd::vector<int> nums = {1, 2, 3, 4, 5};\nstd::for_each(nums.begin(), nums.end(),\n    [](int& n) { n *= 2; });"
      }
    ]
  },
  {
    language: "Dart",
    facts: [
      "Dart was originally designed to replace JavaScript before becoming the language of Flutter",
      "Dart can compile to native code or JavaScript",
      "Dart's hot reload feature makes it perfect for UI development"
    ],
    snippets: [
      {
        title: "Async/Await",
        code: "Future<void> fetchData() async {\n  try {\n    final response = await http.get(Uri.parse('api/data'));\n    final data = jsonDecode(response.body);\n    print(data);\n  } catch (e) {\n    print('Error: $e');\n  }\n}"
      },
      {
        title: "Null Safety",
        code: "String? nullableName;\nString nonNullName = 'John';\n\n// Safe call with ?\nprint(nullableName?.length);\n\n// Null check with ??\nprint(nullableName ?? 'Default');"
      }
    ]
  },
  {
    language: "React",
    facts: [
      "React was first used in 2011 for Facebook's News Feed feature",
      "React introduced the concept of the Virtual DOM to web development",
      "Instagram's web application is built entirely with React"
    ],
    snippets: [
      {
        title: "Hooks Usage",
        code: "function Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count: {count}\n    </button>\n  );\n}"
      },
      {
        title: "Custom Hook",
        code: "function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    return JSON.parse(\n      localStorage.getItem(key) ?? JSON.stringify(initialValue)\n    );\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}"
      }
    ]
  }
];

const Header = () => {
  const [fact, setFact] = useState(languageFacts[0]);
  const [isOpen, setIsOpen] = useState(false);

  const getRandomFact = () => {
    const newFact = languageFacts[Math.floor(Math.random() * languageFacts.length)];
    setFact(newFact);
    setIsOpen(true);
  };

  return (
    <header className="bg-header text-header-foreground px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Code Playground</h1>
          <motion.img 
            src="/balloon.svg" 
            alt="Balloon" 
            className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform" 
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={getRandomFact}
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">{fact.language} Facts</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <AnimatePresence mode="wait">
                <motion.div
                  key={fact.language}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Did you know?</h3>
                    <ul className="space-y-3">
                      {fact.facts.map((factItem, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-primary">•</span>
                          <span>{factItem}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Code Snippets</h3>
                    <div className="grid gap-4">
                      {fact.snippets.map((snippet, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="rounded-lg border bg-card p-4"
                        >
                          <h4 className="font-medium mb-2">{snippet.title}</h4>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                            <code>{snippet.code}</code>
                          </pre>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-sm text-header-foreground/80">
          Interactive coding environment
        </div>
      </div>
    </header>
  );
};

export default Header;