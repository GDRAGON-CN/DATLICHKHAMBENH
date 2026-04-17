import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import ManagePatient from "../containers/System/Doctor/ManagePatient";
// Import Sidebar thay vì Header
import Sidebar from "../containers/Header/Sidebar";

class Doctor extends Component {
  render() {
    const { isLoggedIn } = this.props;
    return (
      <React.Fragment>
        <div
          className="system-main-container"
          style={{ display: "flex", minHeight: "100vh" }}
        >
          {/* SIDEBAR CHO BÁC SĨ */}
          {isLoggedIn && <Sidebar />}

          <div
            className="system-content"
            style={{
              flex: 1,
              marginLeft: isLoggedIn ? "250px" : "0px",
              transition: "all 0.3s",
            }}
          >
            <div className="system-list">
              <Switch>
                <Route
                  path="/doctor/manage-schedule"
                  component={ManageSchedule}
                />
                <Route
                  path="/doctor/manage-patient"
                  component={ManagePatient}
                />
                <Redirect to="/doctor/manage-schedule" />
              </Switch>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

export default connect(mapStateToProps, null)(Doctor);
