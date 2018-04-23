import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import logo from './logo.svg';
import Punct from "./Components/Punct"
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="main">
        <Route path="/" component={Punct} />
      </div>
    );
  }
}

export default App;
