import React from "react";
import "./App.css";
import axios from "axios";

//import from 'npm install --save material-ui axios react-tap-event-plugin'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import DatePicker from "material-ui/DatePicker";

class UserHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visits: [],
      visits_ForContactTrace: [],
      contactTraceVisits: [],
      isRegisterFormDisplayed: false,
      isContactTraceFormDisplayed: false,
    };
  }

  handleGetAllClick = () => {
    //reset all previous visits & forms displayed
    this.setState({
      visits: [],
      visits_ForContactTrace: [],
      contactTraceVisits: [],
      isRegisterFormDisplayed: false,
      isContactTraceFormDisplayed: false,
    });

    const apiGetAllURL = "http://localhost:5000/visits/";

    axios
      .get(apiGetAllURL)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            visits: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Get all failed");
      })
      .finally(() => {
        this.hideRegisterVisitForm();
        this.hideContactTraceForm();
      });
  };

  renderGetAllVisits = () => {
    return this.state.visits.map((visit) => {
      const visitDate = new Date(visit.visitDateTime);

      const visitDateString = visitDate.toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const visitTimeString = visitDate.toLocaleTimeString("en-SG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return (
        <div key={visit._id}>
          <br />
          <b>Date: </b>
          {visitDateString} , <b>Time: </b>
          {visitTimeString},
          <br />
          <b>NRIC: </b>
          {visit.nric}, <b>Contact: </b>
          {visit.contactNo}
        </div>
      );
    });
  };

  showRegisterVisitForm = () => {
    this.setState({
      isRegisterFormDisplayed: true,

      //reset all previous visits & forms displayed
      visits: [],
      visits_ForContactTrace: [],
      contactTraceVisits: [],
      isContactTraceFormDisplayed: false,
    });
  };

  hideRegisterVisitForm = () => {
    this.setState({
      isRegisterFormDisplayed: false,
    });
  };

  showContactTraceForm = () => {
    this.setState({
      isContactTraceFormDisplayed: true,

      //reset all previous visits & forms displayed
      visits: [],
      visits_ForContactTrace: [],
      contactTraceVisits: [],
      isRegisterFormDisplayed: false,
    });
  };

  hideContactTraceForm = () => {
    this.setState({
      isContactTraceFormDisplayed: false,
    });
  };

  renderRegisterVisitForm = () => {
    return (
      <div>
        <TextField floatingLabelText="NRIC" onChange={this.handleNricChange} />
        <br />
        <TextField
          floatingLabelText="Contact No"
          onChange={this.handleContactnoChange}
        />
        <br />
        <TextField
          floatingLabelText="Visit Date/Time"
          disabled={true}
          value={new Date().toLocaleTimeString("en-SG", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        />
        <br />
        <br />
        <RaisedButton
          label="Register New Visit"
          secondary={true}
          onClick={this.handleRegisterVisitClick}
        />
        &nbsp;&nbsp;
        <RaisedButton
          label="Cancel"
          secondary={true}
          onClick={this.hideRegisterVisitForm}
        />
      </div>
    );
  };

  handleNricChange = (event, newValue) => {
    this.setState({
      nric: newValue,
    });
  };

  handleContactnoChange = (event, newValue) => {
    this.setState({
      contactNo: newValue,
    });
  };

  handleRegisterVisitClick = () => {
    const apiCreateUserURL = "http://localhost:5000/visits/register";

    const payload = {
      visitDateTime: new Date(),
      nric: this.state.nric,
      contactNo: this.state.contactNo,
    };
    console.log(payload);
    axios
      .post(apiCreateUserURL, payload)
      .then((response) => {
        if (response.status === 201) {
          alert("Your visit is successfully registered.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Register new visit failed");
      })
      .finally(() => {
        this.hideRegisterVisitForm();
        this.hideContactTraceForm();
      });
  };

  renderContactTraceForm = () => {
    return (
      <div>
        <TextField
          floatingLabelText="Trace NRIC"
          onChange={this.handleContactTraceNricChange}
        />
        <br />
        <DatePicker
          onChange={this.handleContactTraceDateChange}
          floatingLabelText="Trace Date"
        />
        <br />
        <br />
        <RaisedButton
          label="Trace Visits"
          secondary={true}
          onClick={this.handleContactTraceClick}
        />
        &nbsp;&nbsp;
        <RaisedButton
          label="Cancel"
          secondary={true}
          onClick={this.hideContactTraceForm}
        />
      </div>
    );
  };

  handleContactTraceNricChange = (event, newValue) => {
    this.setState({
      contactTraceNric: newValue,
    });
  };

  handleContactTraceDateChange = (event, newValue) => {
    this.setState({
      contactTraceDate: newValue,
    });
  };

  handleContactTraceClick = () => {
    // Step 1: Get all visits
    const apiGetAllURL = "http://localhost:5000/visits/";

    axios
      .get(apiGetAllURL)
      .then((response) => {
        if (response.status === 200) {
          // add a new 'isTraced' to the returned visits array
          const visits = response.data.map((visit) => {
            visit.isTraced = false;
            visit.isInfected = false;
            return visit;
          });

          this.setState({
            visits_ForContactTrace: visits,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Contact Trace - Get all failed");
      })
      .finally(() => {
        this.hideContactTraceForm();
        this.hideContactTraceForm();
      });

    // Step 2: Get contact trace visits, from infected NRIC + visit date/time

    const contactTraceDay = this.state.contactTraceDate.getDate();
    const contactTraceMonth = this.state.contactTraceDate.getMonth() + 1;
    const contactTraceYear = this.state.contactTraceDate.getFullYear();

    const contactTraceDateURL =
      "?contactTraceDate=" +
      contactTraceYear +
      "-" +
      contactTraceMonth +
      "-" +
      contactTraceDay;

    const apiContactTraceURL =
      "http://localhost:5000/visits/nric/" +
      this.state.contactTraceNric +
      "/trace" +
      contactTraceDateURL;

    console.log(apiContactTraceURL);

    axios
      .get(apiContactTraceURL)
      .then((response) => {
        if (response.status === 200) {
          alert("Contact trace successful");
          this.setState({
            contactTraceVisits: response.data,
          });

          const newVisits = this.state.visits_ForContactTrace.map((visit) => {
            visit.isTraced = false;
            visit.isInfected = false;
            return visit;
          });

          //compare the 2 arrays
          newVisits.forEach((visit) => {
            response.data.forEach((contactTraceVisit) => {
              if (visit._id === contactTraceVisit._id) {
                visit.isTraced = true;

                //check if this is the infected visitor and visit
                if (contactTraceVisit.nric === this.state.contactTraceNric) {
                  visit.isInfected = true;
                }
              }
            });
          }); // end of 'forEach' loop

          //set 'main contact trace visits to display' to the temporary newVisits with traced flags
          this.setState({
            visits_ForContactTrace: newVisits,
          });
        } //end of 'if' loop
      })
      .catch((error) => {
        console.log(error);
        alert(error);
        alert("Contact trace failed");
      })
      .finally(() => {
        this.hideContactTraceForm();
        this.hideRegisterVisitForm();
      });
  };

  renderGetAllVisitsWithTrace = () => {
    return this.state.visits_ForContactTrace.map((visit) => {
      const visitDate = new Date(visit.visitDateTime);

      const visitDateString = visitDate.toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const visitTimeString = visitDate.toLocaleTimeString("en-SG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      //if it is a traced and infected visitor, set a background color + underline
      if (visit.isTraced === true && visit.isInfected === true) {
        return (
          <div
            key={visit._id}
            style={{
              backgroundColor: "#ff5733",
              textDecorationLine: "underline",
              fontSize: "18px",
            }}
          >
            <br />
            <b>Date: </b>
            {visitDateString} , <b>Time: </b>
            {visitTimeString},
            <br />
            <b>NRIC: </b>
            {visit.nric}, <b>Contact: </b>
            {visit.contactNo}
          </div>
        );
      }
      //else if it is a traced and not infected visit, set a background color only
      else if (visit.isTraced === true && visit.isInfected === false) {
        return (
          <div key={visit._id} style={{ backgroundColor: "#ffbd33" }}>
            <br />
            <b>Date: </b>
            {visitDateString} , <b>Time: </b>
            {visitTimeString},
            <br />
            <b>NRIC: </b>
            {visit.nric}, <b>Contact: </b>
            {visit.contactNo}
          </div>
        );
      }
      //if visit is untraced
      else {
        return (
          <div key={visit._id}>
            <br />
            <b>Date: </b>
            {visitDateString} , <b>Time: </b>
            {visitTimeString},
            <br />
            <b>NRIC: </b>
            {visit.nric}, <b>Contact: </b>
            {visit.contactNo}
          </div>
        );
      }
    });
  };

  handleLogoutClick = () => {
    const apiLogoutURL = "http://localhost:5000/users/logout";

    axios
      .post(apiLogoutURL)
      .then((response) => {
        console.log(response.data + " " + response.status);
        if (response.status === 200) {
          alert("You are successfully logged out.");
          this.props.logout();
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Logout failed");
      });
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar title="User Homepage" />
            <br />
            <RaisedButton
              label="Get All Visits"
              primary={true}
              onClick={this.handleGetAllClick}
            />
            &nbsp;&nbsp;
            <RaisedButton
              label="Contact Trace Visit"
              primary={true}
              onClick={this.showContactTraceForm}
            />
            &nbsp;&nbsp;
            <RaisedButton
              label="Register Visit"
              primary={true}
              onClick={this.showRegisterVisitForm}
            />
            &nbsp;&nbsp;
            <RaisedButton label="Logout" onClick={this.handleLogoutClick} />
            <br />
            {this.state.isRegisterFormDisplayed &&
              this.renderRegisterVisitForm()}
            <br />
            {this.state.isContactTraceFormDisplayed &&
              this.renderContactTraceForm()}
            <br />
            {this.renderGetAllVisits()}
            {this.renderGetAllVisitsWithTrace()}
            <br />
            <br />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default UserHomepage;