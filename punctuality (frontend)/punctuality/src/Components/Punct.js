import * as React from "react";
import * as moment from 'moment';
import DatePicker from "react-datepicker";

import { Container, Button, Header, Table, Modal, Icon, Popup } from "semantic-ui-react";

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
    // Get the roster and shift info when the page loads
    this.getNewRosters(this.state.startDate, this.state.endDate);
  }

  /*
    A function which takes a start and end date and fetches the roster and shift information
    for that time period, and then sets these to the state's startDate and endDate attributes.
  */
  getNewRosters = (start, end) => {
    var self = this;
    // AJAX request rosters information
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
        // Set state with the json we got
        self.setState({
          rosters: json
        });
      });
    });

    // AJAX request shift information
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
        // Set state with the json we got
        self.setState({
          shifts: json
        });
      });
    });
  }

  /*
    Whenever we change the date, we should also get a new set of roster and
    shift information. This function is called when the DatePicker objects
    are used.
  */
  changeDate(date, name) {
    let obj = {};
    obj[name] = date;
    this.setState(obj);
    if (name === "startDate") {
      this.getNewRosters(date, this.state.endDate);
    } else if (name === "endDate") {
      this.getNewRosters(this.state.startDate, date);
    }
  }

  /* "That darn paperwork... Wouldn't it be easier if it all just blew away?"

  Of course, Mike Wazowski is going to need some help filing his paperwork.
  This function downloads a latex file with the information displayed on the web module,
  so that it can be signed off and put through the rigorous bureaucracy that is
  Monsters, Inc.

  */
  filePaperwork = () => {
    let dayInfo = this.generateDayInfo();

    let latexFile = "";
    // Set up the document and header row of the table
    latexFile +=
      "\\documentclass{article}\n" +
      "\\title{\\bf Shift Paperwork " + 
      this.state.startDate.format("DD/MM/YYYY") + " - " + 
      this.state.endDate.format("DD/MM/YYYY") + "}\n" +
      "\\author{Mike Wazowski, EMP20073}\n" +
      "\\begin{document}\n" +
      "\\maketitle\n" +
      "\\begin{center}\n" +
      "\\centerline{\n" +
      "\\begin{tabular}{| c | c | c | c | c |}\n" +
      "\\hline\n" +
      "Date & Rostered Start & Actual Start & Rostered Finish & Actual Finish\\\\\n" +
      "\\hline\n";

    // Print each row of the table to the file.
    for (let i = 0; i < dayInfo.length; i++) {
      latexFile += dayInfo[i].date.format("MMMM Do YYYY") + " & ";
      latexFile += dayInfo[i].rosterStart.format("h:mma") + " & ";
      latexFile += dayInfo[i].shiftStart.isValid() ?
          dayInfo[i].shiftStart.format("h:mma") + " & " : 
          "No Record &";
      latexFile += dayInfo[i].rosterFinish.format("h:mma") + " & ";
      latexFile += dayInfo[i].shiftFinish.isValid() ?
          dayInfo[i].shiftFinish.format("h:mma") + " \\\\\n" :
          "No Record \\\\\n";
      latexFile += "\\hline\n";
    }

    // Close table and add a signature line, then close document
    latexFile += "\\end{tabular}\n" +
      "}" +
      "\\end{center}\n" +
      "\\vspace{3cm}\n" +
      "Signed: \\hrulefill\n\n" +
      "\\hspace*{0mm}\\phantom{Signed: }Mike Wazowski\n\n" +
      "\\hspace*{0mm}\\phantom{Signed: }Scare Assistant to James P. Sullivan\n\n" +
      "\\end{document}";

    // Hacky way of implementing client side file download.
    // Creates a hidden element that downloads the file onClick, then clicks it and removes it.
    let download = document.createElement('a');
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(latexFile));
    download.setAttribute('download', "paperwork_" + this.state.startDate.format("DD-MM-YY") + "_" + this.state.endDate.format("DD-MM-YY") + ".tex");
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }

  /* 
    Generates an array of objects consisting of dates and the associated shift and roster times for that date.
  */
  generateDayInfo = () => {
    let dayInfo = [];

    // These offsets will be used in the case of entire shift records being missed/rosters not being completed.
    // When a shift is missing, instead of getting the correct shift, we get the next shift that was completed.
    // So, our "roster index" is one behind. In this case, we want to add one to rostersOffset so that it can
    // "catch up".
    let rostersOffset = 0;
    let shiftsOffset = 0;

    // Take the min of the two lengths, in case one is fetched before the other.
    for (let i = 0;
        // The biggest index should not be bigger than the smallest array
        Math.max(i+rostersOffset, i+shiftsOffset) < 
        Math.min(this.state.rosters.length, this.state.shifts.length);
        i++) {

      // Initialise all these boys
      let rosterDate = moment(this.state.rosters[i + rostersOffset].date);
      let shiftDate = moment(this.state.shifts[i + shiftsOffset].date);
      let rosterStartDate;
      let rosterFinishDate;
      let shiftStartDate;
      let shiftFinishDate;

      // If there is no roster for a particular shift (should not occur), deal with it, then add one to shiftsOffset
      if (rosterDate.diff(shiftDate, "days") > 0) {
        rosterStartDate = moment("-");
        rosterFinishDate = moment("-");
        shiftStartDate = moment(this.state.shifts[i + shiftsOffset].start);
        shiftFinishDate = moment(this.state.shifts[i + shiftsOffset].finish);

        shiftsOffset += 1;

      // If there is no shift record for a particular roster, deal with it, then add one to rostersOffset
      } else if (rosterDate.diff(shiftDate, "days") < 0) {
        rosterStartDate = moment(this.state.rosters[i + rostersOffset].start);
        rosterFinishDate = moment(this.state.rosters[i + rostersOffset].finish);
        shiftStartDate = moment("-");
        shiftFinishDate = moment("-");

        rostersOffset += 1;

      // Everything went ok! Get the dates normally.
      } else {
        rosterStartDate = moment(this.state.rosters[i + rostersOffset].start);
        rosterFinishDate = moment(this.state.rosters[i + rostersOffset].finish);
        shiftStartDate = moment(this.state.shifts[i + shiftsOffset].start);
        shiftFinishDate = moment(this.state.shifts[i + shiftsOffset].finish);
      }
      // Add the info we got to the table, no matter what it was (empty shift or good shift)
      dayInfo.push({
        date: rosterDate,
        rosterStart: rosterStartDate,
        rosterFinish: rosterFinishDate,
        shiftStart: shiftStartDate,
        shiftFinish: shiftFinishDate
      })
    }

    return dayInfo;
  }

  render() {
    // dayInfo is the array of objects (table rows, basically)
    let dayInfo = this.generateDayInfo();

    // Generate an actual array of table rows from the table row information
    const tableRows = dayInfo.map((day) => (
        <Table.Row key={day.date}>
          <Table.Cell>{day.date.format("MMMM Do YYYY")}</Table.Cell>
          <Table.Cell>{day.rosterStart.format("h:mma")}</Table.Cell>
          {/* On hover, show actual time */}
          <Popup content={day.shiftStart.format("h:mma")}
            trigger={(
              <Table.Cell>
                {
                  // If Mike started before the roster, print "on time"
                  (day.shiftStart.diff(day.rosterStart)) <= 0 ?
                  "on time" :
                  // Otherwise, print an appropriate message with a red badge
                  // showing a late he was.
                  (<div>
                    {!day.shiftStart.isValid() ? "not clocked" : "started late"}
                    <span className="badge red-badge">
                      {
                        moment.duration(day.shiftStart.diff(day.rosterStart)).isValid() ? 
                        moment.duration(day.shiftStart.diff(day.rosterStart)).humanize() :
                        "Invalid time"
                      }
                    </span>
                  </div>)
                }
              </Table.Cell>
            )}
          />
          <Table.Cell>
            {day.rosterFinish.format("h:mma")}
          </Table.Cell>
          {/* On hover, show actual time */}
          <Popup content={day.shiftFinish.format("h:mma")}
            trigger={
              <Table.Cell>
                {
                  (day.rosterFinish.diff(day.shiftFinish)) <= 0 ?
                  "on time" :
                  (<div>
                    {!day.shiftFinish.isValid() ? "not clocked" : "left early"}
                    <span className="badge red-badge">
                      {
                        moment.duration(day.rosterFinish.diff(day.shiftFinish)).isValid() ?
                        moment.duration(day.rosterFinish.diff(day.shiftFinish)).humanize() :
                        "Invalid time"
                      }
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
          open={this.state.modalActive}
          trigger={(
            <Button icon labelPosition="left" toggle={true} onClick={() => this.setState({modalActive: !this.state.modalActive})}>
              <Icon name="caret down"/>
              Choose pay period
            </Button>
          )}
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
          <Modal.Actions>
            <Button color='green' onClick={() => this.setState({modalActive: !this.state.modalActive})} inverted>
              <Icon name='checkmark' /> Done
            </Button>
          </Modal.Actions>
        </Modal>

        <Button
          className="paperwork-button"
          onClick={this.filePaperwork}>
            Download paperwork (LaTeX)
        </Button>

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
            {/* The generated table rows go here */}
            {tableRows}
          </Table.Body>
        </Table>

        
      </Container>
    )
  }
}