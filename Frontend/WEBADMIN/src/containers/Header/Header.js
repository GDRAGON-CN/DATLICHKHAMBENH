import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES } from "../../utils";
import _ from "lodash";
import { USER_ROLE } from "../../utils";
import { changeLanguageApp } from "../../store/actions";
import { FormattedMessage } from "react-intl";

class Header extends Component {
  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }
  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
    }
    this.setState({
      menuApp: menu,
    });
  }
  render() {
    const { processLogout, userInfo, language } = this.props;

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>

        <div className="right-content">
          <div className="languages">
            <span className="welcome">
              {" "}
              Welcome{" "}
              {userInfo && userInfo.roleId === USER_ROLE.ADMIN
                ? "Admin"
                : "Doctor"}{" "}
            </span>
            <span
              className={
                language === LANGUAGES.VI
                  ? "languages-vi active"
                  : "languages-vi"
              }
              onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
            >
              VN
            </span>
            <span
              className={
                language === LANGUAGES.EN
                  ? "languages-en active"
                  : "languages-en"
              }
              onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
            >
              EN
            </span>
            <div className="btn btn-logout" onClick={processLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </div>
          </div>

          {/* nút logout */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
