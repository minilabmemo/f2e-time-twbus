
import styled from '@emotion/styled';
import { Key, useState } from 'react';
import pet from '../images/pet.svg';
import girl_pet from '../images/girl_pet.png';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';


interface QAItemProps {
  question: string;
  answer: string | JSX.Element;
}


const QAComponent = () => {
  const [questions] = useState([
    {
      id: 1,
      question: '起源',
      answer: '本站是用來顯示台灣的收容中心流浪動物，希望可以提供一個便利的查詢與暫存平台。',
    },
    {
      id: 2,
      question: '資料來源',
      answer: '本站資料來源來自行政院農業委員會資料開放平台”(Public OpenData exchange) 。',
    },
    {
      id: 3,
      question: '問題回報',
      answer: (
        <span>
          如果有遇到任何問題，歡迎上本站程式碼儲存庫提出（在 <a href='https://github.com/minilabmemo/f2e-time-twbus/issues'>  issue </a>新增問題）或是寄信到下方聯絡信箱，感謝。
        </span>
      ),
    },

  ]);

  return (
    <div>
      {questions.map((qa) => (
        <QAItem key={qa.id} question={qa.question} answer={qa.answer} />
      ))}
    </div>
  );
};
const QAItem = ({ question, answer }: QAItemProps) => {


  return (
    <div className="qa-item">
      <div className="qa-question">{question}</div>
      <div className="qa-answer">{answer}</div>
    </div>
  );
};

export const About = () => {
  const textRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const handleCopy = async () => {
    try {
      const textToCopy = textRef.current.innerText;
      await navigator.clipboard.writeText(textToCopy);
      alert(textToCopy + ' 已複製！');
    } catch (error) {
      console.error('複製文字時發生錯誤:', error);
      alert('複製文字失敗。請手動複製文字。');
    }
  };

  return (
    <>

      <div className='title-box'>
        <img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />
        <span className="title-text">關於本站 | About</span>

      </div>
      <QAComponent></QAComponent>

      <div className='title-box' style={{ marginTop: "30px" }}>
        <img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />
        <span className="title-text">關於我 | Contact</span>

      </div>
      <div className="qa-item">
        <div className="qa-question">聯絡信箱</div>
        <div className="qa-answer" ref={textRef}> minilabmemo+petfinder@gmail.com
          <span style={{ marginLeft: '16px' }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faClipboard} />
          </span></div>

      </div>
      <img className="about-image" width="300px" height="300px" src={girl_pet} alt="girl_pet" />



    </>
  );
};


