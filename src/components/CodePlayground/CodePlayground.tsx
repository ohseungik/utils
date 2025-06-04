"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Play, Save, Upload, RotateCcw, Maximize2 } from "lucide-react"
import { toast } from "sonner"

interface CodeState {
  html: string
  css: string
  js: string
}

const defaultCode: CodeState = {
  html: `<div id="app">
  <h1>Hello World!</h1>
  <p>코드를 수정해보세요.</p>
  <button onclick="handleClick()">클릭해보세요</button>
</div>`,
  css: `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

#app {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background: #ff5252;
}`,
  js: `function handleClick() {
  alert('안녕하세요! 코드 플레이그라운드입니다.');
}

// React 예제
function App() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>React Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '10px' }}>
        감소
      </button>
    </div>
  );
}

// React 컴포넌트를 사용하려면 아래 주석을 해제하세요
// ReactDOM.render(<App />, document.getElementById('app'));`,
}

const examples = {
  basic: {
    name: "기본 HTML",
    code: defaultCode,
  },
  react: {
    name: "React 컴포넌트",
    code: {
      html: `<div id="root"></div>`,
      css: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
}

.todo-item.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.add-todo {
  display: flex;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.add-todo button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`,
      js: `function TodoApp() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: '코드 플레이그라운드 사용해보기', completed: false },
    { id: 2, text: 'React 컴포넌트 만들기', completed: true }
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="add-todo">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="새 할일을 입력하세요"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <div>
        {todos.map(todo => (
          <div key={todo.id} className={\`todo-item \${todo.completed ? 'completed' : ''}\`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<TodoApp />, document.getElementById('root'));`,
    },
  },
  animation: {
    name: "CSS 애니메이션",
    code: {
      html: `<div class="animation-container">
  <div class="box box1"></div>
  <div class="box box2"></div>
  <div class="box box3"></div>
  <h2>CSS 애니메이션 예제</h2>
</div>`,
      css: `body {
  margin: 0;
  padding: 20px;
  background: #1a1a2e;
  color: white;
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}

.animation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.box {
  width: 100px;
  height: 100px;
  margin: 20px;
  border-radius: 10px;
}

.box1 {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  animation: rotate 2s infinite linear;
}

.box2 {
  background: linear-gradient(45deg, #48dbfb, #0abde3);
  animation: bounce 1.5s infinite ease-in-out;
}

.box3 {
  background: linear-gradient(45deg, #ff9ff3, #f368e0);
  animation: pulse 2s infinite ease-in-out;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

h2 {
  text-align: center;
  font-size: 2em;
  margin-top: 40px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`,
      js: `// 애니메이션 제어
document.addEventListener('DOMContentLoaded', function() {
  const boxes = document.querySelectorAll('.box');
  
  boxes.forEach((box, index) => {
    box.addEventListener('click', function() {
      this.style.animationPlayState = 
        this.style.animationPlayState === 'paused' ? 'running' : 'paused';
    });
  });
  
  console.log('애니메이션이 시작되었습니다! 박스를 클릭하면 애니메이션을 일시정지할 수 있습니다.');
});`,
    },
  },
}

export default function CodePlayground() {
  const [code, setCode] = useState<CodeState>(defaultCode)
  const [previewCode, setPreviewCode] = useState<CodeState>(defaultCode)
  const [activeTab, setActiveTab] = useState("html")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const updateCode = useCallback((type: keyof CodeState, value: string) => {
    setCode((prev) => ({ ...prev, [type]: value }))
  }, [])

  const runCode = useCallback(() => {
    setPreviewCode({ ...code })
    toast("코드가 성공적으로 실행되었습니다.")
  }, [code])

  const generatePreview = useCallback(() => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        ${previewCode.css}
    </style>
</head>
<body>
    ${previewCode.html}
    <script type="text/babel">
        ${previewCode.js}
    </script>
    <script>
        window.onerror = function(msg, url, line, col, error) {
            console.error('Error:', msg, 'at line', line);
            return false;
        };
    </script>
</body>
</html>`

    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
  }, [previewCode])

  const saveCode = () => {
    try {
      localStorage.setItem("code-playground-saved", JSON.stringify(code))
      toast("코드가 성공적으로 저장되었습니다.")
    } catch (error) {
      toast("코드 저장 중 오류가 발생했습니다.")
    }
  }

  const loadCode = () => {
    try {
      const saved = localStorage.getItem("code-playground-saved")
      if (saved) {
        const parsedCode = JSON.parse(saved)
        setCode(parsedCode)
        setPreviewCode(parsedCode) // 미리보기도 업데이트
        toast("저장된 코드를 불러왔습니다.")
      } else {
        toast("저장된 코드가 없습니다.")
      }
    } catch (error) {
      toast("코드 불러오기 중 오류가 발생했습니다.")
    }
  }

  const loadExample = (exampleKey: keyof typeof examples) => {
    const exampleCode = examples[exampleKey].code
    setCode(exampleCode)
    setPreviewCode(exampleCode) // 미리보기도 업데이트
    toast(`${examples[exampleKey].name} 예제를 불러왔습니다.`)
  }

  const resetCode = () => {
    setCode(defaultCode)
    setPreviewCode(defaultCode) // 미리보기도 업데이트
    toast("코드가 초기 상태로 리셋되었습니다.")
  }

  return (
    <div className={`h-[calc(100vh-4rem)] flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      {/* 헤더 */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">코드 플레이그라운드</h1>
            <p className="text-muted-foreground">HTML, CSS, React 코드를 실시간으로 테스트해보세요</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveCode}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button variant="outline" size="sm" onClick={loadCode}>
              <Upload className="h-4 w-4 mr-2" />
              불러오기
            </Button>
            <Button variant="outline" size="sm" onClick={resetCode}>
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize2 className="h-4 w-4 mr-2" />
              {isFullscreen ? "축소" : "전체화면"}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 코드 에디터 */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">코드 에디터</h2>
              <div className="flex gap-2">
                {Object.entries(examples).map(([key, example]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(key as keyof typeof examples)}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <Badge variant="secondary">HTML</Badge>
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center gap-2">
                  <Badge variant="secondary">CSS</Badge>
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center gap-2">
                  <Badge variant="secondary">JS/React</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="html" className="h-full m-0 p-0">
                <Textarea
                  value={code.html}
                  onChange={(e) => updateCode("html", e.target.value)}
                  placeholder="HTML 코드를 입력하세요..."
                  className="h-full min-h-[600px] resize-none border-0 rounded-none font-mono text-sm p-4"
                />
              </TabsContent>
              <TabsContent value="css" className="h-full m-0 p-0">
                <Textarea
                  value={code.css}
                  onChange={(e) => updateCode("css", e.target.value)}
                  placeholder="CSS 코드를 입력하세요..."
                  className="h-full min-h-[600px] resize-none border-0 rounded-none font-mono text-sm p-4"
                />
              </TabsContent>
              <TabsContent value="js" className="h-full m-0 p-0">
                <Textarea
                  value={code.js}
                  onChange={(e) => updateCode("js", e.target.value)}
                  placeholder="JavaScript/React 코드를 입력하세요..."
                  className="h-full min-h-[600px] resize-none border-0 rounded-none font-mono text-sm p-4"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Play className="h-5 w-5" />
              미리보기
            </h2>
            <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              실행하기
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={generatePreview()}
              className="w-full h-full border-0"
              title="Code Preview"
              sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
