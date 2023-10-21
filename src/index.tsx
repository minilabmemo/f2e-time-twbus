import React from 'react';
import ReactDOM from 'react-dom/client';

import './style/normalize.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import whyDidYouRender from '@welldone-software/why-did-you-render';
console.info("NODE_ENV:", process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  console.warn("using whyDidYouRender ")
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <App />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
