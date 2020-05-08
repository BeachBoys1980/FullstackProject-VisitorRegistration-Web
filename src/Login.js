import React from "react";
import "./styles/App.css";
import axios from "./utils/axios";

//import from 'npm install --save material-ui axios react-tap-event-plugin'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLogin: false,
    };
  }

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

  handleClick = () => {
    const apiLoginURL = "/users/login";

    const payload = {
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .post(apiLoginURL, payload, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          this.props.login(true, response.data.userType);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Login failed");
      });
  };

  render() {
    return (
      <div className="loginpageLayout">
        <MuiThemeProvider>
          <div>
            <AppBar title="VISITOR REGISTRATION SYSTEM" />

            <TextField
              floatingLabelText="Username"
              onChange={this.handleUsernameChange}
            />
            <br />

            <TextField
              type="password"
              floatingLabelText="Password"
              onChange={this.handlePasswordChange}
            />
            <br />
            <br />
            <br />
            <RaisedButton
              label="Submit"
              primary={true}
              onClick={this.handleClick}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Login;
