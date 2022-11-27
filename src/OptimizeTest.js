import React, { useState, useEffect } from 'react';

const CounterA = React.memo(({ count }) => {
  // 상태값 변화가 없으므로 콘솔로그 안찍힘
  useEffect(() => {
    console.log(`CounterA Update - count: ${count}`);
  });
  return <div>{count}</div>;
});

const CounterB = ({ obj }) => {
  // 상태값 변화가 없으므로 콘솔로그 안찍혀야 하는데 찍힘
  // why? javascript에서는 객체 비교시 얕은 비교(주소값을 비교)를 하기 때문! -> areEqual 함수의 필요성
  useEffect(() => {
    console.log(`CounterB Update - count: ${obj.count}`);
  });
  return <div>{obj.count}</div>;
};

const areEqual = (provProps, nextProps) => {
  // if (provProps.obj.count === nextProps.obj.count) {
  //   return true; // 이전 props와 현재 props 같음 -> 리렌더링 x
  // }
  // return false; // 이전 props와 현재 props 다름 -> 리렌더링 일으킴!!!

  // 코드 리팩토링
  // 이전과 다음 props가 동일하면 true: 리렌더링 x
  // 다르면 false: 리렌더링 일으킴!!
  return provProps.obj.count === nextProps.obj.count;
};

// CounterB 컴포넌트는 areEqual 함수의 판단에 따라 리렌더링 여부 판단
// MomoizedCounter: 고차 컴포넌트
const MomoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  // 의도적으로 상태값을 1로 고정시킴
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button
          onClick={() => {
            setCount(count);
          }}
        >
          A button
        </button>
      </div>
      <div>
        <h2>Counter B</h2>
        {/* <CounterB obj={obj} /> */}
        <MomoizedCounterB obj={obj} />
        <button
          onClick={() =>
            setObj({
              count: obj.count,
            })
          }
        >
          B button
        </button>
      </div>
    </div>
  );
};

export default OptimizeTest;
