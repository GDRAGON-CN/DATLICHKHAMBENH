import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp, processLogout } from "../../store/actions";
import { withRouter } from "react-router-dom";
import { getSearchSuggestionsService } from "../../services/userService";
class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      listSuggest: [],
      showSuggest: false,
    };
    this.searchRef = React.createRef();
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.searchRef.current &&
      !this.searchRef.current.contains(event.target)
    ) {
      this.setState({ showSuggest: false });
    }
  };
  handleOnChangeInput = async (event) => {
    let value = event.target.value;
    this.setState({ keyword: value });

    if (value.length > 1) {
      let res = await getSearchSuggestionsService(value);
      if (res && res.errCode === 0) {
        this.setState({
          listSuggest: res.data,
          showSuggest: true,
        });
      }
    } else {
      this.setState({ listSuggest: [], showSuggest: false });
    }
  };
  handleOnClickSuggest = (item) => {
    this.setState({ keyword: "", showSuggest: false });
    if (item.type === "SPECIALTY") {
      this.props.history.push(`/detail-specialty/${item.id}`);
    } else if (item.type === "CLINIC") {
      this.props.history.push(`/detail-clinic/${item.id}`);
    } else if (item.type === "DOCTOR") {
      this.props.history.push(`/detail-doctor/${item.id}`);
    }
  };
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  handleLogout = () => {
    this.props.processLogout();
  };
  render() {
    let language = this.props.language;
    let { isLoggedIn, userInfo } = this.props;
    let { keyword, listSuggest, showSuggest } = this.state;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <div
                className="header-logo"
                onClick={() => this.props.history.push("/home")}
              >
                {" "}
              </div>
            </div>
            <div className="center-content">
              <div
                className="child-content"
                onClick={() => this.props.history.push("/all-specialty")}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.specialty" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.searchdoctor" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.props.history.push("/all-doctor")}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.doctor" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-doctor" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.props.history.push("/all-handbook")}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.health-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-room" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id="homeheader.support" />
              </div>
              <div className="languages">
                <div
                  className={
                    language === LANGUAGES.VI
                      ? "language-vi active"
                      : "language-vi"
                  }
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                    VN
                  </span>
                </div>
                <div
                  className={
                    language === LANGUAGES.EN
                      ? "language-en active"
                      : "language-en"
                  }
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                    EN
                  </span>
                </div>
              </div>

              {isLoggedIn && userInfo ? (
                <div className="user-actions">
                  <div
                    className="child-content profile-btn"
                    onClick={() =>
                      this.props.history.push("/patient/profile")
                    }
                  >
                    <i className="fas fa-user-circle"></i>
                    <b>Hồ sơ</b>
                  </div>
                  <div
                    className="child-content logout-btn"
                    onClick={this.handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </div>
                </div>
              ) : (
                <div
                  className="child-content login-btn"
                  onClick={() =>
                    this.props.history.push("/patient-login")
                  }
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <b>Đăng nhập</b>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <b>
                  <FormattedMessage id="banner.title2" />
                </b>
              </div>
              <div className="search" ref={this.searchRef}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  value={keyword}
                  placeholder={
                    language === LANGUAGES.VI
                      ? "Tìm chuyên khoa, bác sĩ, bệnh viện..."
                      : "Search specialty, doctor, hospital..."
                  }
                  onChange={(event) => this.handleOnChangeInput(event)}
                />

                {showSuggest && listSuggest && listSuggest.length > 0 && (
                  <div className="search-result-dropdown">
                    {listSuggest.map((item, index) => {
                      let icon = "fas fa-user-md";
                      if (item.type === "SPECIALTY") icon = "fas fa-flask";
                      if (item.type === "CLINIC") icon = "fas fa-hospital";

                      return (
                        <div
                          className="suggest-item"
                          key={index}
                          onClick={() => this.handleOnClickSuggest(item)}
                        >
                          <i className={icon}></i>
                          <div className="info">
                            <div className="name">{item.name}</div>
                            <div className="type">{item.type}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div
                  className="option-child"
                  onClick={() => this.props.history.push("/all-specialty")}
                >
                  <div className="icon-child">
                    <i className="fas fa-flask"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child1" />
                  </div>
                </div>
                <div
                  className="option-child"
                  onClick={() => this.props.history.push("/all-doctor")}
                >
                  <div className="icon-child">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child2" />
                  </div>
                </div>
                <div
                  className="option-child"
                  onClick={() => this.props.history.push("/all-handbook")}
                >
                  <div className="icon-child">
                    <i className="far fa-hospital"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    processLogout: () => dispatch(processLogout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader),
);
