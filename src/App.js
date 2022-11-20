import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const dummyList = [
  {
    id: 1,
    author: 'Sean',
    content: 'hihi',
    emotion: 5,
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: 'Jake',
    content: 'bye',
    emotion: 3,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: 'Woon',
    content: 'wow',
    emotion: 4,
    created_date: new Date().getTime(),
  },
];

function App() {
  return (
    <div className="App">
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;
