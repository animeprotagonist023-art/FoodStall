import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { FoodStallProvider } from './store';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <FoodStallProvider>
        <App />
      </FoodStallProvider>
    </HashRouter>
  </React.StrictMode>,
);
