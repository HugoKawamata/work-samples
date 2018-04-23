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
    fetch("http://localhost:4567/rosters/" + this.state.startDate + "/" + this.state.endDate, 
      {
        method: "GET",
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
        console.log("rosters");
        console.log(self.state.rosters);
      });
    });
    fetch("http://localhost:4567/shifts/" + this.state.startDate + "/" + this.state.endDate, 
      {
        method: "GET",
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
        console.log(self.state.shifts);
      });
    });
  }


  render() {
    var dayInfo = [];
    for (var i = 0; i < this.state.rosters.length; i++) {
      dayInfo.push({
        date: this.state.rosters[i].date,
        rosterStart: this.state.rosters[i].start,
        rosterFinish: this.state.rosters[i].finish,
        shiftStart: this.state.shifts[i].start,
        shiftFinish: this.state.shifts[i].finish,
      })
    }
    const tableRows = dayInfo.map((day) => (
        <Table.Row>
          <Table.Cell>{day.date}</Table.Cell>
          <Table.Cell>{day.rosterStart}</Table.Cell>
          <Table.Cell>{day.shiftStart}</Table.Cell>
          <Table.Cell>{day.rosterFinish}</Table.Cell>
          <Table.Cell>{day.shiftFinish}</Table.Cell>
        </Table.Row>
      )
    );

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
          {tableRows}
        </Table>

        
      </Segment>
    )
  }
}