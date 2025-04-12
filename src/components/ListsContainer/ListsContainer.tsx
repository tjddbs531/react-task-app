import React, { FC } from 'react';
import { IList } from '../../types';
import { listsContainer } from './ListsContainer.css';
import List from '../List/List'; // 경로 확인 필요
import ActionButton from '../ActionButton/ActionButton'; // 경로 확인 필요

type TListsContainerProps = {
  boardId: string;
  lists: IList[];
};

const ListsContainer: FC<TListsContainerProps> = ({
  lists,
  boardId,
}) => {
  return (
    <div className={listsContainer}>
      {lists.map((list) => (
        <List
          key={list.listId}
          list={list}
          boardId={boardId}
        />
      ))}
      <ActionButton 
      boardId={boardId}
      listId={""}
      list
      />
    </div>
  );
};

export default ListsContainer;
