import React, { useEffect, useRef, useState } from 'react';

const DiaryItem = ({
  onEidt,
  onRemove,
  id,
  author,
  content,
  emotion,
  created_date,
}) => {
  useEffect(() => {
    console.log(`${id}번째 아이템 렌더!`);
  });

  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);

  // 수정 기능의 변경될 content 값
  const [localContent, setLocalContent] = useState(content);
  const localContnetInput = useRef();

  const handleRemove = () => {
    if (window.confirm(`${id}번째 일기를 정말 삭제할까요? `)) {
      onRemove(id);
    }
  };

  // 이슈: textarea 입력 -> [수정 취소] 클릭 -> [수정하기] 클릭 -> 수정 취소 했던 content 값이 남아있음.
  // 해결: 수정 취소시 원래 content 값을 갖도록 하는 핸들러 정의
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  const handleEdit = () => {
    // 글자수 조건 미충족
    if (localContent.length < 5) {
      localContnetInput.current.focus();
      return;
    }

    if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
      onEidt(id, localContent);
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자: {author} | 감정점수: {emotion}
        </span>
        <br />
        <span>{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContnetInput}
              value={localContent}
              onChange={(e) => {
                setLocalContent(e.target.value);
              }}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
