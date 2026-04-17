import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
    };
  }
  handleOnChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };
  handleOnChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };
  handleLogin = async () => {
    this.setState({ errMessage: "" });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({ errMessage: data.message });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({ errMessage: error.response.data.message });
      }
    }
  };
  handleShowHidePassWord = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.handleLogin();
    }
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Login</div>

            {/* Username Input */}
            <div
              className={`col-12 form-group login-input ${this.state.errMessage ? "has-error" : ""}`}
            >
              <label>Username</label>
              <div className="input-group">
                <i className="fas fa-user input-icon"></i> {/* Icon User */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={(event) => this.handleOnChangeUsername(event)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div
              className={`col-12 form-group login-input custom-input-password ${this.state.errMessage ? "has-error" : ""}`}
            >
              <label>Password</label>
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i> {/* Icon Lock */}
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={(event) => this.handleOnChangePassword(event)}
                  onKeyDown={(event) => this.handleKeyDown(event)}
                />
                <span
                  className="show-hide-pass"
                  onClick={this.handleShowHidePassWord}
                >
                  <i
                    className={
                      this.state.isShowPassword
                        ? "far fa-eye"
                        : "far fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>

            {/* Error Message */}
            <div className="col-12 err-message">{this.state.errMessage}</div>

            {/* Login Button */}
            <div className="col-12">
              <button className="btn-login" onClick={this.handleLogin}>
                Sign In
              </button>
            </div>

            {/* Forgot Password */}
            <div className="col-12">
              <span
                className="forgot-password"
                onClick={() =>
                  alert(
                    "Vui lòng liên hệ bộ phận IT hoặc Admin hệ thống để cấp lại mật khẩu!",
                  )
                }
              >
                Forgot your password?
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
