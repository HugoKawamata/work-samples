import * as React from "react";
import * as moment from 'moment';
import DatePicker from "react-datepicker";

import { Container, Input, Button, Header, Table, Modal, Icon, Popup, Label } from "semantic-ui-react";

export default class Punct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment("2013-09-15"),
      endDate: moment("2013-09-22"),
      rosters: [],
      shifts: [],
      modalActive: false
    }
  }

  componentDidMount() {
    this.getNewRosters(this.state.startDate, this.state.endDate);
  }

  getNewRosters = (start, end) => {
    var self = this;
    fetch("http://localhost:4567/rosters/" + start.format("YYYY-MM-DD") + "/" + end.format("YYYY-MM-DD"), 
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
    fetch("http://localhost:4567/shifts/" + start.format("YYYY-MM-DD") + "/" + end.format("YYYY-MM-DD"), 
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
    this.setState(obj);
    if (name == "startDate") {
      this.getNewRosters(date, this.state.endDate);
    } else if (name == "endDate") {
      this.getNewRosters(this.state.startDate, date);
    }
  }


  render() {
    let dayInfo = [];
    // Take the min of the two lengths, in case one is fetched before the other.
    for (let i = 0; i < Math.min(this.state.rosters.length, this.state.shifts.length); i++) {
      const date = moment(this.state.rosters[i].date);
      const rosterStartDate = moment(this.state.rosters[i].start);
      const rosterFinishDate = moment(this.state.rosters[i].finish);
      const shiftStartDate = moment(this.state.shifts[i].start);
      const shiftFinishDate = moment(this.state.shifts[i].finish);
      dayInfo.push({
        date: date,
        rosterStart: rosterStartDate,
        rosterFinish: rosterFinishDate,
        shiftStart: shiftStartDate,
        shiftFinish: shiftFinishDate
      })
    }
    const tableRows = dayInfo.map((day) => (
        <Table.Row key={day.date}>
          <Table.Cell>{day.date.format("MMMM Do YYYY")}</Table.Cell>
          <Table.Cell>{day.rosterStart.format("h:mma")}</Table.Cell>
          <Popup content={day.shiftStart.format("h:mma")}
            trigger={(
              <Table.Cell>
                {
                  (day.shiftStart.diff(day.rosterStart)) <= 0 ?
                  "on time" :
                  (<div>
                    started late
                    <span className="badge red-badge">
                      {moment.duration(day.shiftStart.diff(day.rosterStart)).humanize()}
                    </span>
                  </div>)
                }
              </Table.Cell>
            )}
          />
          <Table.Cell>
            {day.rosterFinish.format("h:mma")}
          </Table.Cell>
          <Popup content={day.shiftFinish.format("h:mma")}
            trigger={
              <Table.Cell>
                {
                  (day.rosterFinish.diff(day.shiftFinish)) <= 0 ?
                  "on time" :
                  (<div>
                    left early
                    <span className="badge red-badge">
                      {moment.duration(day.rosterFinish.diff(day.shiftFinish)).humanize()}
                    </span>
                  </div>)
                }
              </Table.Cell>
            }
          />
        </Table.Row>
      )
    );

    return (
      <Container className="profile">
        <Header image="mike.png" as="h1" content="Mike Wazowski, Scare Assistant" />
        <Modal
          trigger={(
            <Button icon labelPosition="left" toggle={true} onClick={() => this.setState({modalActive: !this.state.modalActive})}>
              <Icon name="caret down"/>
              Choose pay period
            </Button>
          )}
          closeIcon
        >
          <Modal.Header>Choose a start and end date for the pay period.</Modal.Header>
          <Modal.Content>
            <Container className="datepickers-container">
              <div className="datepicker-container">
                <h5>Starting date:</h5>
                <div className="ui input">
                  <DatePicker 
                    selected={moment(this.state.startDate)}
                    className="start-date"
                    onChange={(date) => this.changeDate(date, "startDate")}
                  />
                </div>
              </div>
              <div className="datepicker-container">
                <h5>Ending date:</h5>
                <div className="ui input">
                  <DatePicker
                    selected={moment(this.state.endDate)}
                    className="end-date"
                    onChange={(date) => this.changeDate(date, "endDate")}
                  />
                </div>
              </div>
            </Container>
          </Modal.Content>
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
          <Table.Body>
            {tableRows}
          </Table.Body>
        </Table>

        
      </Container>
    )
  }
}