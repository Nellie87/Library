import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' for React 18+
import './index.css';
import App from './App';
import Customcss from './Customcss';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { ContextProvider } from './helpers/MyContext';

console.log('index loaded');

// Render Customcss component
const cssRoot = ReactDOM.createRoot(document.getElementById('css'));
cssRoot.render(
  <React.StrictMode>
    <Customcss />
  </React.StrictMode>
);

// Render App component inside ContextProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
reportWebVitals();
