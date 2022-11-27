import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useReducer,
} from 'react';
// React: 이름 바꾸기 가능 (export defualt 만 괄호 없이 불러오기 가능)
// {useXXX, useXXX, ...}: 비구조화 할당을 통해 import 하므로 이름 변경 불가능
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

// 상태 변화를 처리하는 함수 (컴포넌트로부터 state 분리)
const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };

      // 새로운 아이템 +  기존 아이템
      return [newItem, ...state];
    }
    case 'REMOVE':
      return state.filter((it) => it.id !== action.targetId);
    case 'EDIT': {
      return state.map((it) =>
        it.id === action.targetId
          ? { ...it, content: action.newContent }
          : { it }
      );
    }
    default:
      return state;
  }
};

// Context API
// why not "export default"?
// export default : 파일 당 하나만 가능
// export : 여러 개 가능
// data state 전달용
export const DiaryStateContext = React.createContext();
// onCreate, onRemove, onEdit func 전달용
export const DiaryDispatchContext = React.createContext();

const App = () => {
  // DirayEditor, DiaryList 컴포넌트가 함께 사용할 일기 데이터
  // const [data, setData] = useState([]); // 빈 배열: 일기 0개
  const [data, dispatch] = useReducer(reducer, []);

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
    // setData(initData); // setData -> reducer
    // dispatch(): 상태변화를 일으킴
    // action의 type: INIT, action의 data: initData
    dispatch({ type: 'INIT', data: initData });
  };

  useEffect(() => {
    getData();
  }, []);

  // useCallback(callback, dependency_array): 함수의 재생성
  // - callback
  // - dependency_array: [] 빈배열 -> 마운트되는 첫번째 시점에만 함수를 만듦
  //    Issue! 일기 등록시 목록 사라지고 하나의 일기만 남게됨.. 두번째 인자의 빈배열 때문.. -> ** 함수형 업데이트 사용
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: 'CREATE',
      data: { author, content, emotion, id: dataId.current },
    });
    // dataid 증가
    dataId.current += 1;
    // ...data: 원래 data
    // newItem: 새로 추가되는 item
    // ** 함수형 업데이트: setState() 함수에 함수를 전달
    // (함수의 재생성하면서 항상 최신의 state를 참조할 수 있음)
    // : 항상 최신의 데이터를 인자를 통해 업데이트 함
    // setData((data) => [newItem, ...data]);
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: 'REMOVE', targetId });

    // // console.log(`${targetId}가 삭제되었습니다.`); // test
    // const newDiaryList = data.filter((it) => it.id !== targetId);
    // // console.log(newDiaryList); test
    // setData(newDiaryList);

    // setState에 전달되는 파라미터에 최신 data가 전달되므로 다음과 같이 수정
    // setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: 'EDIT', targetId, newContent });
    // setData((data) =>
    //   data.map((it) =>
    //     // 수정 대상 아이디 맞음; 원본 데이터 불러오고, content 값 변경
    //     // 수정 대상 아이디 아님; 원본 데이터
    //     it.id === targetId ? { ...it, content: newContent } : it
    //   )
    // );
  }, []);

  // useMemo를 이용해 재생성되지 않도록 처리후 객체 반환
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

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
    // Issue! Provider도 '컴포넌트' 이기 때문에 data와 함께 onCreate, onRemove, onEdit 을 같이 내려주면,
    //    data state가 변경될 때 마다 리렌더링 발생하여 결론적으로 최적화가 다 풀려버림..
    // Solution! Provider 중첩!
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          {/* <LifeCycle /> */}
          {/* <OptimizeTest /> */}
          <DiaryEditor />

          <div>전체 일기: {data.length}</div>
          <div>기분 좋은 일기 개수: {goodCount}</div>
          <div>기분 나쁜 일기 개수: {badCount}</div>
          <div>기분 좋은 일기 비율: {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;
