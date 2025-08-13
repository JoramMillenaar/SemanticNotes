import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'
import { Button } from "@/components/ui/button.tsx";

interface FileEntry {
  name: string
  path: string
  isDirectory: boolean
}

interface DirResult {
  path: string
  parent: string
  items: FileEntry[]
}

function App() {
  const [markdown, setMarkdown] = useState('')
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [currentDir, setCurrentDir] = useState('')
  const [parentDir, setParentDir] = useState<string | null>(null)

  const openDirectory = async () => {
    const dir = await window.ipcRenderer.invoke('dialog:openDirectory')
    if (dir) {
      await loadDirectory(String(dir))
    }
  }

  const loadDirectory = async (dir: string) => {
    const result: DirResult = await window.ipcRenderer.invoke('fs:readDir', dir)
    setEntries(result.items)
    setCurrentDir(result.path)
    setParentDir(result.parent === result.path ? null : result.parent)
  }

  const openFile = async (filePath: string) => {
    const text = await window.ipcRenderer.invoke('fs:readFile', filePath)
    if (text) setMarkdown(String(text))
  }

  const goUp = async () => {
    if (parentDir) {
      await loadDirectory(parentDir)
    }
  }

  return (
    <div className="p-4">
      <Button className="mb-4 rounded bg-blue-500 px-4 py-2 text-white" onClick={openDirectory}>Open Directory</Button>
      {currentDir && (
        <div className="filetree">
          <p>Current directory: {currentDir}</p>
          {parentDir && <button onClick={goUp}>Up</button>}
          <ul>
            {entries.map((entry) => (
              <li key={entry.path}>
                {entry.isDirectory ? (
                  <button onClick={() => loadDirectory(entry.path)}>{entry.name}/</button>
                ) : (
                  <button onClick={() => openFile(entry.path)}>{entry.name}</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default App
