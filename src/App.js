import React from "react";
import "./styles/App.css";
import Login from "./Login";
import AdminHomepage from "./AdminHomepage";
import UserHomepage from "./UserHomepage";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      userType: "",
    };
  }

  login = (isLogin, userType) => {
    this.setState({ isLogin, userType });
  };

  logout = () => {
    this.setState({ isLogin: false });
  };

  renderRouter = () => {
    if (this.state.userType === "ADMIN" && this.state.isLogin) {
      return (
        <div>
          <Switch>
            <Route
              path="/adminHomepage"
              render={() => <AdminHomepage logout={this.logout} />}
            />
            <Redirect to="/adminHomepage" />
          </Switch>
        </div>
      );
    } else if (this.state.userType === "USER" && this.state.isLogin) {
      return (
        <div>
          <Switch>
            <Route
              path="/userHomepage"
              render={() => <UserHomepage logout={this.logout} />}
            />
            <Redirect to="/userHomepage" />
          </Switch>
        </div>
      );
    } else {
      return (
        <div>
          <Switch>
            <Route path="/login" render={() => <Login login={this.login} />} />
            <Redirect to="/login" />
          </Switch>
        </div>
      );
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div>{this.renderRouter()}</div>
      </BrowserRouter>
    );
  }
}

export default App;
