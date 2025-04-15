import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard, IList, ITask } from "../../types";

// 🔹 로그 타입 정의
type TLog = {
  logId: string;
  logMessage: string;
  logAuthor: string;
  logTimestamp: string;
};

// 🔹 전체 상태 타입
type TBoardsState = {
  modalActive: boolean;
  boardArray: IBoard[];
  logs: TLog[];
};

// 🔹 액션 타입 정의
type TAddBoardAction = {
  board: IBoard;
};

type TDeleteListAction = {
  boardId: string;
  listId: string;
};

type TAddListAction = {
  boardId: string;
  list: IList;
};

type TAddTaskAction = {
  boardId: string;
  listId: string;
  task: ITask;
};

type TDeleteTaskAction = {
  boardId: string;
  listId: string;
  taskId: string;
};

type TDeleteBoardAction = {
  boardId: string;
};

type TSortAction = {
  boardId: string;
  droppableIdStart: string;
  droppableIdEnd: string;
  droppableIndexStart: number;
  droppableIndexEnd: number;
  draggableId: string;
};

// 🔹 초기 상태
const initialState: TBoardsState = {
  modalActive: false,
  boardArray: [
    {
      boardId: "board-0",
      boardName: "첫번째 게시물",
      lists: [
        {
          listId: "list-0",
          listName: "List 1",
          tasks: [
            {
              taskId: "task-0",
              taskName: "Task 1",
              taskDescription: "Description",
              taskOwner: "John",
            },
            {
              taskId: "task-1",
              taskName: "Task 2",
              taskDescription: "Description",
              taskOwner: "John",
            },
          ],
        },
        {
          listId: "list-1",
          listName: "List 2",
          tasks: [
            {
              taskId: "task-3",
              taskName: "Task 3",
              taskDescription: "description",
              taskOwner: "John",
            },
          ],
        },
      ],
    },
  ],
  logs: [],
};

// 🔹 Slice 정의
const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (state, { payload }: PayloadAction<TAddBoardAction>) => {
      state.boardArray.push(payload.board);
    },

    deleteBoard: (state, { payload }: PayloadAction<TDeleteBoardAction>) => {
      state.boardArray = state.boardArray.filter(
        (board) => board.boardId !== payload.boardId
      );
    },

    addList: (state, { payload }: PayloadAction<TAddListAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: [...board.lists, payload.list],
            }
          : board
      );
    },

    addTask: (state, { payload }: PayloadAction<TAddTaskAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.listId === payload.listId
                  ? {
                      ...list,
                      tasks: [...list.tasks, payload.task],
                    }
                  : list
              ),
            }
          : board
      );
    },

    updateTask: (state, { payload }: PayloadAction<TAddTaskAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.listId === payload.listId
                  ? {
                      ...list,
                      tasks: list.tasks.map((task) =>
                        task.taskId === payload.task.taskId
                          ? payload.task
                          : task
                      ),
                    }
                  : list
              ),
            }
          : board
      );
    },

    deleteTask: (state, { payload }: PayloadAction<TDeleteTaskAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.listId === payload.listId
                  ? {
                      ...list,
                      tasks: list.tasks.filter(
                        (task) => task.taskId !== payload.taskId
                      ),
                    }
                  : list
              ),
            }
          : board
      );
    },

    deleteList: (state, { payload }: PayloadAction<TDeleteListAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: board.lists.filter(
                (list) => list.listId !== payload.listId
              ),
            }
          : board
      );
    },

    setModalActive: (state, { payload }: PayloadAction<boolean>) => {
      state.modalActive = payload;
    },

    addLog: (state, { payload }: PayloadAction<TLog>) => {
      state.logs.push(payload);
    },

    sort: (state, { payload }: PayloadAction<TSortAction>) => {
      const {
        boardId,
        droppableIdStart,
        droppableIdEnd,
        droppableIndexStart,
        droppableIndexEnd,
      } = payload;

      const board = state.boardArray.find((b) => b.boardId === boardId);
      if (!board) return;

      const startList = board.lists.find((l) => l.listId === droppableIdStart);
      const endList = board.lists.find((l) => l.listId === droppableIdEnd);
      if (!startList || !endList) return;

      // 같은 리스트 내 이동
      if (droppableIdStart === droppableIdEnd) {
        const [movedTask] = startList.tasks.splice(droppableIndexStart, 1);
        startList.tasks.splice(droppableIndexEnd, 0, movedTask);
      } else {
        // 리스트 간 이동
        const [movedTask] = startList.tasks.splice(droppableIndexStart, 1);
        endList.tasks.splice(droppableIndexEnd, 0, movedTask);
      }
    },
  },
});

// 🔹 Actions & Reducer export
export const {
  deleteBoard,
  addBoard,
  deleteList,
  deleteTask,
  updateTask,
  setModalActive,
  addLog,
  addTask,
  addList,
  sort,
} = boardsSlice.actions;

export const boardsReducer = boardsSlice.reducer;
