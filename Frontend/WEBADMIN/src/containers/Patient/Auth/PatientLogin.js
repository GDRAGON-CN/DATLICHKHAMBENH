import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../../store/actions";
import { handleLoginApi } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./PatientAuth.scss";

class PatientLogin extends Component {
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
        this.props.navigate("/home");
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
      <>
        <HomeHeader isShowBanner={false} />
        <div className="patient-auth-background">
          <div className="patient-auth-container">
            <div className="patient-auth-content row">
              <div className="col-12 text-login">Đăng nhập Bệnh Nhân</div>

              <div className={`col-12 form-group auth-input ${this.state.errMessage ? "has-error" : ""}`}>
                <label>Email</label>
                <div className="input-group">
                  <i className="fas fa-envelope input-icon"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập email của bạn"
                    value={this.state.username}
                    onChange={(event) => this.handleOnChangeUsername(event)}
                  />
                </div>
              </div>

              <div className={`col-12 form-group auth-input custom-input-password ${this.state.errMessage ? "has-error" : ""}`}>
                <label>Mật khẩu</label>
                <div className="input-group">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    className="form-control"
                    type={this.state.isShowPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={this.state.password}
                    onChange={(event) => this.handleOnChangePassword(event)}
                    onKeyDown={(event) => this.handleKeyDown(event)}
                  />
                  <span
                    className="show-hide-pass"
                    onClick={this.handleShowHidePassWord}
                  >
                    <i className={this.state.isShowPassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                  </span>
                </div>
              </div>

              <div className="col-12 err-message">{this.state.errMessage}</div>

              <div className="col-12">
                <button className="btn-login" onClick={this.handleLogin}>
                  Đăng nhập
                </button>
              </div>

              <div className="col-12 register-redirect">
                <span>Chưa có tài khoản? </span>
                <span className="text-register" onClick={() => this.props.navigate('/patient-register')}>Đăng ký ngay</span>
              </div>
            </div>
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientLogin);
