import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import Home from "../routes/Home";
import Login from "./Auth/Login";
import System from "../routes/System";
import { CustomToastCloseButton } from "../components/CustomToast";
import HomePage from "./HomePage/HomePage.js";
import DetailDoctor from "../containers/Patient/Doctor/DetailDoctor.js";
import CustomScrollbars from "../components/CustomScrollbars.js";
import Doctor from "../routes/Doctor.js";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty.js";
import DetailHandbook from "./Patient/Handbook/DetailHandbook";
import VerifyEmail from "./Patient/VerifyEmail.js";
import AllSpecialty from "./Patient/All-List/AllSpecialty.js";
import AllHandbook from "./Patient/All-List/AllHandbook.js";
import AllDoctor from "./Patient/All-List/AllDoctor.js";

import PatientLogin from "./Patient/Auth/PatientLogin.js";
import PatientRegister from "./Patient/Auth/PatientRegister.js";
import PatientProfile from "./Patient/PatientProfile.js";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={HomePage} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route
                    path={path.DETAIL_DOCTOR}
                    component={DetailDoctor}
                  />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.DETAIL_HANDBOOK} component={DetailHandbook} />
                  <Route path={path.ALL_SPECIALTY} component={AllSpecialty} />
                  <Route path={path.ALL_DOCTOR} component={AllDoctor} />
                  <Route path={path.ALL_HANDBOOK} component={AllHandbook} />
                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route path={"/patient-login"} component={PatientLogin} />
                  <Route path={"/patient-register"} component={PatientRegister} />

                  <Route path={"/patient/profile"} component={PatientProfile} />
                </Switch>
              </CustomScrollbars>
            </div>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
