import React, { useState, useEffect } from 'react';

// 부모 컴포넌트 OptimizeTest에서 count or text 변경시
// TextView, CountView 컴포넌트 모두 리랜더링하는 비효율 발생!!
// props가 변경되지 않으면 리랜더 하지 않도록 React.memo() 감싸기
const TextView = React.memo(({ text }) => {
  useEffect(() => {
    console.log(`Update :: Text : ${text}`);
  });
  return <div>{text}</div>;
});

const CountView = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`Update :: Count : ${count}`);
  });
  return <div>{count}</div>;
});

const OptimizeTest = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>count</h2>
        <CountView count={count} />
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h2>text</h2>
        <TextView text={text} />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default OptimizeTest;
