import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserRedux from "../containers/System/Admin/UserRedux";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";
// Thay Header bằng Sidebar (Giả sử bạn đã tạo Sidebar.js ở thư mục Header)
import Sidebar from "../containers/Header/Sidebar";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import ManageSpecialty from "../containers/System/Admin/ManageSpecialty";
import ManageClinic from "../containers/System/Admin/ManageClinic";
import ManageDoneBooking from "../containers/System/Admin/ManageDoneBooking";

class System extends Component {
  render() {
    const { isLoggedIn, userInfo } = this.props;

    // Nếu là bác sĩ, tự động chuyển hướng sang trang quản lý lịch của bác sĩ
    if (userInfo && userInfo.roleId === "R2") {
      return <Redirect to="/doctor/manage-schedule" />;
    }

    return (
      <React.Fragment>
        <div
          className="system-main-container"
          style={{ display: "flex", minHeight: "100vh" }}
        >
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
                <Route path="/system/user-redux" component={UserRedux} />
                <Route path="/system/manage-doctor" component={ManageDoctor} />
                <Route path="/system/manage-clinic" component={ManageClinic} />
                <Route
                  path="/system/manage-specialty"
                  component={ManageSpecialty}
                />
                <Route
                  path="/system/manage-done-booking"
                  component={ManageDoneBooking}
                />
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
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps, null)(System);
