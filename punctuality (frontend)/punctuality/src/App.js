import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Punct from "./Components/Punct";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="main">
        <Route path="/" component={Navbar} />
        <Route path="/" component={Punct} />
        <Route path="/" component={Footer} />
      </div>
    );
  }
}

export default App;
