import React from "react";
import "./App.css";
import axios from "axios";

//import from 'npm install --save material-ui axios react-tap-event-plugin'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import Subheader from "material-ui/Subheader";

const styles = {
  block: {
    maxWidth: 200,
  },
  radioButton: {
    marginBottom: 16,
  },
};

class AdminHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isCreateFormDisplayed: false,
      username: "",
      password: "",
      userType: "",
    };
  }

  handleGetAllClick = () => {
    const apiGetAllURL = "http://localhost:5000/users/";

    axios
      .get(apiGetAllURL)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            users: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Get all failed");
      })
      .finally(() => {
        this.hideCreateUserForm();
      });
  };

  renderGetAllUsers = () => {
    return this.state.users.map((user) => (
      <div key={user.username}>
        User Name: {user.username}, User Type: {user.userType}
      </div>
    ));
  };

  showCreateUserForm = () => {
    this.setState({
      isCreateFormDisplayed: true,

      //reset all previous users & forms displayed
      users: [],
    });
  };

  hideCreateUserForm = () => {
    this.setState({
      isCreateFormDisplayed: false,
    });
  };

  renderCreateUserForm = () => {
    return (
      <div>
        <TextField
          floatingLabelText="Username"
          onChange={this.handleUsernameChange}
        />
        <br />
        <TextField
          floatingLabelText="Password"
          onChange={this.handlePasswordChange}
        />
        <br /> <br />
        <Subheader>User Type</Subheader>
        <RadioButtonGroup
          name="userType"
          style={styles.block}
          onChange={this.handleUserTypeChange}
        >
          <RadioButton value="ADMIN" label="Admin" style={styles.radioButton} />
          <RadioButton value="USER" label="User" style={styles.radioButton} />
        </RadioButtonGroup>
        <br />
        <br />
        <RaisedButton
          label="Create New User"
          secondary={true}
          onClick={this.handleCreateUserClick}
        />
        &nbsp;&nbsp;
        <RaisedButton
          label="Cancel"
          secondary={true}
          onClick={this.hideCreateUserForm}
        />
      </div>
    );
  };

  handleUsernameChange = (event, newValue) => {
    this.setState({
      username: newValue,
    });
  };

  handlePasswordChange = (event, newValue) => {
    this.setState({
      password: newValue,
    });
  };

  handleUserTypeChange = (event, newValue) => {
    this.setState({
      userType: newValue,
    });
  };

  handleCreateUserClick = () => {
    const apiCreateUserURL = "http://localhost:5000/users/create";

    const payload = {
      username: this.state.username,
      password: this.state.password,
      userType: this.state.userType,
    };
    console.log(payload);
    axios
      .post(apiCreateUserURL, payload)
      .then((response) => {
        if (response.status === 201) {
          alert("Your new user is successfully created.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error);
        alert("Create new user failed");
      })
      .finally(() => {
        this.hideCreateUserForm();
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
            <AppBar title="Admin Homepage" />
            <br />
            <RaisedButton
              label="Get All Users"
              primary={true}
              onClick={this.handleGetAllClick}
            />
            &nbsp; &nbsp;
            <RaisedButton
              label="Create User"
              primary={true}
              onClick={this.showCreateUserForm}
            />
            &nbsp; &nbsp;
            <RaisedButton label="Logout" onClick={this.handleLogoutClick} />
            {this.state.isCreateFormDisplayed && this.renderCreateUserForm()}
            {this.renderGetAllUsers()}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AdminHomepage;
