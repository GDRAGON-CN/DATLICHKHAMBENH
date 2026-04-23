import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Sidebar.scss";
import * as actions from "../../store/actions";
import { USER_ROLE } from "../../utils";
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }

  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    if (userInfo && userInfo.roleId) {
      let role = userInfo.roleId;
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      } else if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
    }
    this.setState({
      menuApp: menu,
    });
  }

  render() {
    const { menuApp } = this.state;

    return (
      <div className="sidebar-container">
        <div className="sidebar-logo">BOOKINGCARE DOCTOR</div>
        <div className="sidebar-menu">
          {menuApp &&
            menuApp.length > 0 &&
            menuApp.map((group, index) => (
              <div key={index} className="menu-group">
                <div className="group-name">{group.name}</div>
                {group.menus.map((item, idx) => (
                  <div
                    key={idx}
                    className="menu-item"
                    onClick={() => this.props.navigate(item.link)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="sidebar-footer">
          <div
            className="btn-logout"
            onClick={this.props.processLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="logout-text">Đăng xuất</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo, 
  };
};

const mapDispatchToProps = (dispatch) => ({
  navigate: (path) => dispatch(push(path)),
  processLogout: () => dispatch(actions.processLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
