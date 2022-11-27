import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
// import OptimizeTest from './OptimizeTest';
// import LifeCycle from './Lifecycle';

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

// https://jsonplaceholder.typicode.com/comments

const App = () => {
  // DirayEditor, DiaryList 컴포넌트가 함께 사용할 일기 데이터
  const [data, setData] = useState([]); // 빈 배열: 일기 0개

  // useRef()를 통해 만든 객체 안의 current 값이 실제 엘리먼트 가르킴
  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json());
    // console.log(res); // test

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  // useCallback(callback, dependency_array): 함수의 재생성
  // - callback
  // - dependency_array: [] 빈배열 -> 마운트되는 첫번째 시점에만 함수를 만듦
  //    Issue! 일기 등록시 목록 사라지고 하나의 일기만 남게됨.. 두번째 인자의 빈배열 때문.. -> ** 함수형 업데이트 사용
  const onCreate = useCallback((author, content, emotion) => {
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
    // ** 함수형 업데이트: setState() 함수에 함수를 전달
    // (함수의 재생성하면서 항상 최신의 state를 참조할 수 있음)
    // : 항상 최신의 데이터를 인자를 통해 업데이트 함
    setData((data) => [newItem, ...data]);
  }, []);

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

  // useMemo: 연산을 최적화 하고 싶은 함수를 감싸주면 됨!
  // useMemo(callback, dependency_array)
  // - callback: 콜백함수의 return 값을 최적화함
  // - dependency_array: 해당 배열 값이 변경될 때만 callback 수행
  // **주의! useMemo는 첫번째 인자 callback함수의 값을 리턴함. 즉 값을 리턴함으로 함수가 아님!!
  const getDiaryAnalysis = useMemo(() => {
    // 2번 찍힘 -> why? 맨 처음 데이터 불러오기 전에 (즉, 빈배열일 때) 1회, 데이터 불러오고 난 후 2회
    // 새로운 일기가 추가될 때마다 콘솔에 찍힘
    // 하지만! [수정] 작업에서도 콘솔에 찍힘 -> 감정은 수정 불가능하기 때문에 불필요한 연산 발생
    // console.log('일기 분석 시작'); // test

    const goodCount = data.filter((it) => it.emotion > 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;

    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  // const { goodCount, badCount, goodRatio } = getDiaryAnalysis();
  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; // **주의! useMemo로 감싸져 있으니 함수가 아닌 값으로 사용해야 함!!

  return (
    <div className="App">
      {/* <LifeCycle /> */}
      {/* <OptimizeTest /> */}
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기: {data.length}</div>
      <div>기분 좋은 일기 개수: {goodCount}</div>
      <div>기분 나쁜 일기 개수: {badCount}</div>
      <div>기분 좋은 일기 비율: {goodRatio}%</div>
      <DiaryList diaryList={data} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
};

export default App;
