import React, { FC } from 'react';
import { ILogItem } from '../../../types';
import { BsFillPersonFill } from 'react-icons/bs';
import { author, date, logItemWrap, message } from './LogItem.css';

type TLogItemProps = {
  logItem: ILogItem; // ✅ 오타 수정
};

const LogItem: FC<TLogItemProps> = ({ logItem }) => {
  const diff = Date.now() - Number(logItem.logTimestamp);
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const showOffsetTime =
    minutes > 0
      ? `${minutes}m ${seconds}s ago`
      : seconds > 0
      ? `${seconds}s ago`
      : 'just now';

  return (
    <div className= {logItemWrap}>
      <div className= {author}>
        <BsFillPersonFill />
        {logItem.logAuthor}
      </div>
      <div className={message}>{logItem.logMessage}</div>
      <div className={date}>{showOffsetTime}</div>
    </div>
  );
};

export default LogItem;
