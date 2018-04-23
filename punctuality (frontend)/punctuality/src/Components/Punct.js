import * as React from "react";
import DatePicker from "react-date-picker";
import * as moment from 'moment';
import { Segment, Input, Button, Header, Table, Modal, Icon, Label } from "semantic-ui-react";

export default class Punct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "2013-09-15",
      endDate: "2013-09-22",
      rosters: [],
      shifts: [],
      modalActive: false
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

  changeDate(date, name) {
    let obj = {};
    obj[name] = date;
    this.setState(obj)
  }


  render() {
    var dayInfo = [];
    // Take the min of the two lengths, in case one is fetched before the other.
    for (var i = 0; i < Math.min(this.state.rosters.length, this.state.shifts.length); i++) {
      var date = this.state.rosters[i].date;
      dayInfo.push({
        date: moment(date).format("MMMM Do YYYY"),
        rosterStart: this.state.rosters[i].start,
        rosterFinish: this.state.rosters[i].finish,
        shiftStart: this.state.shifts[i].start,
        shiftFinish: this.state.shifts[i].finish,
      })
    }
    const tableRows = dayInfo.map((day) => (
        <Table.Row key={day.date}>
          <Table.Cell>{day.date}</Table.Cell>
          <Table.Cell>{day.rosterStart}</Table.Cell>
          <Table.Cell>
            {day.shiftStart}
            <Label pointing>{day.shiftStart}</Label>
          </Table.Cell>
          <Table.Cell>{day.rosterFinish}</Table.Cell>
          <Table.Cell>
            {typeof day.shiftFinish}
            <Label pointing>{day.shiftFinish}</Label>
          </Table.Cell>
        </Table.Row>
      )
    );
    const modal = this.state.modalActive ? (
      <Modal open={this.state.modalActive}>
        <Modal.Header>Choose a start and end date for the pay period.</Modal.Header>
        <DatePicker 
          //value={this.state.startDate}
          className="start-date"
          name="startDate"
          onChange={(date) => this.changeDate(date, "startDate")}
        />
        <DatePicker
          value={this.state.endDate}
          className="end-date"
          name="endDate"
          onChange={(date) => this.changeDate(date, "endDate")}
        />
      </Modal>
    ) : <div/>;
    

    return (
      <Segment>
        <Header image="mike.png" as="h1" content="Mike Wazowski, Scare Assistant" />
        <Modal
          trigger={(
            <Button icon labelPosition="left" toggle={true} onClick={() => this.setState({modalActive: !this.state.modalActive})}>
              <Icon name="caret down"/>
              Choose pay period
            </Button>
          )}
        >
          <Modal.Header>Choose a start and end date for the pay period.</Modal.Header>
          <DatePicker 
            value={this.state.startDate}
            className="start-date"
            name="startDate"
            onChange={(date) => this.changeDate(date, "startDate")}
          />
          <DatePicker
            value={this.state.endDate}
            className="end-date"
            name="endDate"
            onChange={(date) => this.changeDate(date, "endDate")}
          />
        </Modal>
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