import React, { FC, ChangeEvent, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useTypedDispatch } from '../../../hooks/redux';
import { addList, addTask, addLog } from '../../../store/slices/boardsSlice';
import { button, buttons, input, listForm, taskForm, close } from './DropDownForm.css';

type TDropDownFormProps = {
  boardId: string;
  listId: string;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  list?: boolean;
};

const DropDownForm: FC<TDropDownFormProps> = ({
  boardId,
  list,
  listId,
  setIsFormOpen
}) => {
  const dispatch = useTypedDispatch();
  const [text, setText] = useState('');

  const formPlaceholder = list
    ? '리스트의 제목을 입력하세요.'
    : '일의 제목을 입력하세요.';

  const buttonTitle = list ? '리스트 추가하기' : '일 추가하기';

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleButtonClick = () => {
    if (!text.trim()) return;

    if (list) {
      dispatch(
        addList({
          boardId,
          list: { listId: uuidv4(), listName: text, tasks: [] }
        })
      );
      dispatch(
        addLog({
          logId: uuidv4(),
          logMessage: `리스트 생성하기: ${text}`,
          logAuthor: 'User',
          logTimestamp: String(Date.now())
        })
      );
    } else {
      dispatch(
        addTask({
          boardId,
          listId,
          task: {
            taskId: uuidv4(),
            taskName: text,
            taskDescription: '',
            taskOwner: 'User'
          }
        })
      );
      dispatch(
        addLog({
          logId: uuidv4(),
          logMessage: `일 생성하기: ${text}`,
          logAuthor: 'User',
          logTimestamp: String(Date.now())
        })
      );
    }

    setIsFormOpen(false); // 폼 닫기
  };

  return (
    <div className={list ? listForm : taskForm}>
      <textarea
        className={input}
        value={text}
        onChange={handleTextChange}
        autoFocus
        placeholder={formPlaceholder}
        onBlur={() => setIsFormOpen(false)} // 필요 없으면 제거 가능
      />
      <div className={buttons}>
        <button
          className={button}
          onMouseDown={handleButtonClick}>
          {buttonTitle}
        </button>
        <FiX className={close} onClick={() => setIsFormOpen(false)} />
      </div>
    </div>
  );
};

export default DropDownForm;
