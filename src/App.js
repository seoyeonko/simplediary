import { useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import LifeCycle from './Lifecycle';

// const dummyList = [
//   {
//     id: 1,
//     author: 'Sean',
//     content: 'hihi',
//     emotion: 5,
//     created_date: new Date().getTime(),
//   },
//   {
//     id: 2,
//     author: 'Jake',
//     content: 'bye',
//     emotion: 3,
//     created_date: new Date().getTime(),
//   },
//   {
//     id: 3,
//     author: 'Woon',
//     content: 'wow',
//     emotion: 4,
//     created_date: new Date().getTime(),
//   },
// ];

function App() {
  // DirayEditor, DiaryList 컴포넌트가 함께 사용할 일기 데이터
  const [data, setData] = useState([]); // 빈 배열: 일기 0개

  // useRef()를 통해 만든 객체 안의 current 값이 실제 엘리먼트 가르킴
  const dataId = useRef(0);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    // dataid 증가
    dataId.current += 1;
    // ...data: 원래 data
    // newItem: 새로 추가되는 item
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
    // console.log(`${targetId}가 삭제되었습니다.`); // test
    const newDiaryList = data.filter((it) => it.id !== targetId);
    // console.log(newDiaryList); test
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        // 수정 대상 아이디 맞음; 원본 데이터 불러오고, content 값 변경
        // 수정 대상 아이디 아님; 원본 데이터
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

  return (
    <div className="App">
      <LifeCycle />
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}

export default App;
