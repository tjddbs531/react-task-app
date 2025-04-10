import { appContainer } from './App.css'
import { board } from './App.css'
import {buttons} from './App.css'
function App() {
  return (
    <>
      <div className={appContainer}>
        <div className = {board}>
        </div>
        <div className={buttons}>
          <button>
            이 게시판 삭제하기
          </button>
        </div>
      </div>
    </>
  )
}

export default App
