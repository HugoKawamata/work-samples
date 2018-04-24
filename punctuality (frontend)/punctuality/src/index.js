import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./Styles/style.css";
import { BrowserRouter } from "react-router-dom";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
