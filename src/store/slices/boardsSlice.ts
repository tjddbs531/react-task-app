import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard, IList, ITask } from "../../types"; // 누락된 타입 추가

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

    addList: (state, { payload }: PayloadAction<TAddListAction>) => {
      state.boardArray = state.boardArray.map((board) =>
        board.boardId === payload.boardId
          ? {
              ...board,
              lists: [...board.lists, payload.list], // ✅ 불변성 유지
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
                      tasks: [...list.tasks, payload.task], // ✅ 불변성 유지
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
  },
});

// 🔹 Actions & Reducer export
export const {
  addBoard,
  deleteList,
  setModalActive,
  addLog,
  addTask,
  addList,
} = boardsSlice.actions;

export const boardsReducer = boardsSlice.reducer;
