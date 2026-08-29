import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/app.scss';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}