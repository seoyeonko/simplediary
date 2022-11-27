import React, { useEffect, useState } from 'react';

const LifeCycle = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // useEffect(callback[, dependency_array])
  // callback: func
  // dependency_array (의존성 배열): 해당 배열 값이 변하면 callback 함수 실행
  //  - []: 빈배열 -> Mount 시에만 동작
  //  - 생략 -> Mount & Update 시 동작
  //  - [data]: 해당 데이터 update시 동작
  useEffect(() => {
    console.log('Mount!');
  }, []);

  useEffect(() => {
    console.log('Update!');
  });

  useEffect(() => {
    console.log(`count is update: ${count}`);
    if (count > 5) {
      alert('countr가 5를 넘었습니다. 따라서 1로 초기화합니다.');
      setCount(1);
    }
  }, [count]);

  useEffect(() => {
    console.log(`text is update: ${text}`);
  }, [text]);

  return (
    <div style={{ padding: '20px' }}>
      <div>
        {count}
        <button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          +
        </button>
      </div>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LifeCycle;
