import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { createNewUserService } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { toast } from "react-toastify";
import "./PatientAuth.scss";

class PatientRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phonenumber: "",
      address: "",
      gender: "1",
      isShowPassword: false,
      errMessage: "",
    };
  }

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["email", "password", "firstName", "lastName", "phonenumber", "address"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        this.setState({ errMessage: "Vui lòng nhập đầy đủ: " + arrInput[i] });
        break;
      }
    }
    return isValid;
  };

  handleRegister = async () => {
    this.setState({ errMessage: "" });
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    try {
      let data = {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phonenumber: this.state.phonenumber,
        address: this.state.address,
        gender: this.state.gender,
        roleId: "R3", 
      };

      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        this.setState({ errMessage: response.errMessage });
      } else {
        toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        this.props.navigate("/patient-login");
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

  render() {
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="patient-auth-background" style={{ height: "auto", padding: "50px 0" }}>
          <div className="patient-auth-container" style={{ width: "500px" }}>
            <div className="patient-auth-content row">
              <div className="col-12 text-login">Đăng ký Tài khoản</div>

              <div className="col-12 form-group auth-input">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeInput(event, "email")}
                />
              </div>

              <div className="col-12 form-group auth-input custom-input-password">
                <label>Mật khẩu</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    type={this.state.isShowPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={this.state.password}
                    onChange={(event) => this.handleOnChangeInput(event, "password")}
                  />
                  <span className="show-hide-pass" onClick={this.handleShowHidePassWord}>
                    <i className={this.state.isShowPassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                  </span>
                </div>
              </div>

              <div className="col-6 form-group auth-input">
                <label>Họ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Họ"
                  value={this.state.firstName}
                  onChange={(event) => this.handleOnChangeInput(event, "firstName")}
                />
              </div>

              <div className="col-6 form-group auth-input">
                <label>Tên</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên"
                  value={this.state.lastName}
                  onChange={(event) => this.handleOnChangeInput(event, "lastName")}
                />
              </div>

              <div className="col-6 form-group auth-input">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số điện thoại"
                  value={this.state.phonenumber}
                  onChange={(event) => this.handleOnChangeInput(event, "phonenumber")}
                />
              </div>

              <div className="col-6 form-group auth-input">
                <label>Giới tính</label>
                <select
                  className="form-control"
                  value={this.state.gender}
                  onChange={(event) => this.handleOnChangeInput(event, "gender")}
                >
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </select>
              </div>

              <div className="col-12 form-group auth-input">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Địa chỉ"
                  value={this.state.address}
                  onChange={(event) => this.handleOnChangeInput(event, "address")}
                />
              </div>

              <div className="col-12 err-message">{this.state.errMessage}</div>

              <div className="col-12">
                <button className="btn-login" onClick={this.handleRegister}>
                  Đăng ký
                </button>
              </div>

              <div className="col-12 register-redirect">
                <span>Đã có tài khoản? </span>
                <span className="text-register" onClick={() => this.props.navigate('/patient-login')}>Đăng nhập ngay</span>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientRegister);
