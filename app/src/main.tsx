import React from 'react';
import ReactDOM from 'react-dom/client';

// Глобальные стили и токены дизайн-системы Точки
import '@tds/assets/Style/color.css';
import '@tds/assets/Style/font.css';
import '@tds/assets/Style/radius.css';
import '@tds/assets/Style/spacing.css';
import '@tds/assets/Style/shadow.css';
import '@tds/assets/Icon/icon.css';

import './styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
