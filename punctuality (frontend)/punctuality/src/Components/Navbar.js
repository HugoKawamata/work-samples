import * as React from "react";
import { Icon } from "semantic-ui-react";

export default class Navbar extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="navbar">
        <div className="nav-left">
          <div className="logo-image">
            <img className="logo" src="logo.png"/>
          </div>
          <div className="logo-title">
            <h1>Monsters, Inc.</h1>
            <h3>Employee Portal</h3>
          </div>
        </div>
        <div className="nav-right">
          <ul className="nav-ul">
            <li>Home</li>
            <li className="active">Profile</li>
            <li>Help</li>
            <li>Logout<Icon name="sign out"/></li>
          </ul>
        </div>
      </div>
    );
  }
}