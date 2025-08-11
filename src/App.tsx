import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState('')

  const openFile = async () => {
    const text = await window.ipcRenderer.invoke('dialog:openFile')
    if (text) setMarkdown(String(text))
  }

  return (
    <div>
      <button onClick={openFile}>Open Markdown File</button>
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default App
