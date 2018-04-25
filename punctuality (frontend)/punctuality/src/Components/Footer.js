import * as React from "react";
import { Container, Button, Icon } from "semantic-ui-react";

export default class Footer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="footer">
        <div className="copyright">
          Copyright 2018 © Monsters Incorporated
        </div>
        <div className="links">
          <a href="https://www.facebook.com/hugo.kawamata">
            <Icon size="big" name="facebook square"/>
          </a>
          <a href="https://github.com/HugoKawamata">
            <Icon size="big" name="github"/>
          </a>
        </div>
      </div>
    )
  }
}