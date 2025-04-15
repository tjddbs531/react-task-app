import { DragDropContext } from '@hello-pangea/dnd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  appContainer,
  board,
  buttons,
  deleteBoardButton,
  loggerButton,
} from './App.css';
import BoardList from './components/BoardList/BoardList';
import EditModal from './components/EditModal/EditModal';
import ListsContainer from './components/ListsContainer/ListsContainer';
import LoggerModal from './components/LoggerModal/LoggerModal';
import { useTypedDispatch, useTypedSelector } from './hooks/redux';
import { addLog, deleteBoard, sort } from './store/slices/boardsSlice';

function App() {
  const dispatch = useTypedDispatch();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState('board-0');

  const modalActive = useTypedSelector((state) => state.boards.modalActive);
  const boards = useTypedSelector((state) => state.boards.boardArray);
  const getActiveBoard = boards.find(
    (board) => board.boardId === activeBoardId
  );

  if (!getActiveBoard) {
    return <div>선택한 게시판이 존재하지 않습니다.</div>;
  }

  const lists = getActiveBoard.lists;

  const handleDeleteBoard = () => {
    if (boards.length > 1) {
      dispatch(deleteBoard({ boardId: getActiveBoard.boardId }));

      dispatch(
        addLog({
          logId: uuidv4(),
          logMessage: `게시판 지우기: ${getActiveBoard.boardName}`,
          logAuthor: 'User',
          logTimestamp: String(Date.now()),
        })
      );

      const newIndexToSet = () => {
        const indexToBeDeleted = boards.findIndex(
          (board) => board.boardId === activeBoardId
        );
        return indexToBeDeleted === 0
          ? indexToBeDeleted + 1
          : indexToBeDeleted - 1;
      };

      setActiveBoardId(boards[newIndexToSet()].boardId);
    } else {
      alert('최소 게시판 개수는 한 개입니다.');
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceList = lists.find((list) => list.listId === source.droppableId);
    const destList = lists.find((list) => list.listId === destination.droppableId);
    const movedTask = sourceList?.tasks.find(task => task.taskId === draggableId);

    if (!sourceList || !destList || !movedTask) return;

    dispatch(
      sort({
        boardId: activeBoardId,
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId,
      })
    );

    dispatch(
      addLog({
        logId: uuidv4(),
        logMessage: `리스트 "${sourceList.listName}"에서 "${destList.listName}"으로 ${movedTask.taskName}을 옮김.`,
        logAuthor: 'User',
        logTimestamp: String(Date.now()),
      })
    );
  };

  return (
    <div className={appContainer}>
      {isLoggerOpen && <LoggerModal setIsLoggerOpen={setIsLoggerOpen} />}
      {modalActive && <EditModal />}

      <BoardList
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
      />

      <div className={board}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <ListsContainer lists={lists} boardId={getActiveBoard.boardId} />
        </DragDropContext>
      </div>

      <div className={buttons}>
        <button className={deleteBoardButton} onClick={handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button
          className={loggerButton}
          onClick={() => setIsLoggerOpen(!isLoggerOpen)}
        >
          {isLoggerOpen ? '활동 목록 숨기기' : '활동 목록 보이기'}
        </button>
      </div>
    </div>
  );
}

export default App;
