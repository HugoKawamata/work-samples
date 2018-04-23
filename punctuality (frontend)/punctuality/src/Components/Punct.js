import * as React from "react";
import { Segment, Input, Button, Header, Table } from "semantic-ui-react";

export default class Punct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "2013-09-15",
      endDate: "2013-09-22",
      rosters: [],
      shifts: []
    }
  }

  componentDidMount() {
    var self = this;
    fetch("localhost:4567/rosters/" + startDate + "/" + endDate, 
      {
        method: "POST",
        credentials: "same-origin"
      }
    ).then(function(response) {
      if (response.status !== 200) {
        console.log("Error " +
        response.status);
        return;
      }

      response.json().then(function(json) {
        self.setState({
          rosters: json
        });
        console.log("rosters")
        console.log(rosters)
      });
    });
    fetch("localhost:4567/shifts/" + startDate + "/" + endDate, 
      {
        method: "POST",
        credentials: "same-origin"
      }
    ).then(function(response) {
      if (response.status !== 200) {
        console.log("Error " +
        response.status);
        return;
      }

      response.json().then(function(json) {
        self.setState({
          shifts: json
        });
        console.log("shifts");
        console.log(shifts);
      });
    });
  }


  render() {
    return (
      <Segment>
        <Header image="mike.png" as="h1" content="Mike Wazowski, Scare Assistant" />
        <Table striped={true}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Rostered Start</Table.HeaderCell>
              <Table.HeaderCell>Actual Start</Table.HeaderCell>
              <Table.HeaderCell>Rostered Finish</Table.HeaderCell>
              <Table.HeaderCell>Actual Finish</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

        </Table>

        
      </Segment>
    )
  }
}