import React, { useEffect, useState } from 'react';

// 자식 컴포넌트
// 반드시 한 파일에 한 컴포넌트만 존재해야하는 것은 아님.
const UnmountTest = () => {
  // 특정값의 변경 여부 추적 가능
  useEffect(() => {
    // Mount 시점에 실행
    console.log('Mount!');

    // Unmount 시점에 실행
    return () => {
      console.log('Unmount!');
    };
  }, []);

  return <div>Unmount Testing Component</div>;
};

const LifeCycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={toggle}>ON/OFF</button>
      {/* 
        단락회로 평가 
        - isVisible = true; UnmountTest 렌더링
        - isVisible = false; 단락회로 평가 발생 ->  UnmountTest 렌더링 X
      */}
      {isVisible && <UnmountTest />}
    </div>
  );
};

export default LifeCycle;
