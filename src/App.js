import React, {useState, useCallback} from 'react';
import './App.css';
import Splash from './components/Splash'
import Question from './components/Question'
import Result from './components/Result'

function App() {
  const [content, setContent] = useState(0);
  const [correctNumber, setCorrectNumber] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const [size, setSize] = useState([0,0]);

  const findingSize = useCallback(node => {
    if (node !== null) {
      setSize([node.getBoundingClientRect().width,node.getBoundingClientRect().height]);
    }
  }, []);

  return (
    <div className="App">
      <div className="card" ref={findingSize}>
        {content === 0 && <Splash callback={setContent}/>}
        {content === 1 && <Question callback={setContent} correctCb={setCorrectNumber} timeCb={setTimeUsed} size={size}/>}
        {content === 2 && <Result score={correctNumber} time={timeUsed} callback={setContent} correctCb={setCorrectNumber} timeCb={setTimeUsed}/>}
      </div>
    </div>
  );
}

export default App;
