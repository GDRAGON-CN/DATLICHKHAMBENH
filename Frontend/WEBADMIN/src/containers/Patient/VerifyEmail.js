import React, { Component } from "react";
import { connect } from "react-redux";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss"; // Nhớ import file scss này

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");

      let res = await postVerifyBookAppointment({
        token: token,
        doctorId: doctorId,
      });

      if (res && res.errCode === 0) {
        this.setState({ statusVerify: true, errCode: 0 });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res && res.errCode ? res.errCode : -1,
        });
      }
    }
  }

  render() {
    let { statusVerify, errCode } = this.state;
    return (
      <div className="verify-email-container">
        <HomeHeader />
        <div className="verify-email-body">
          {statusVerify === false ? (
            <div className="loading-data">
              <div className="spinner-border text-primary" role="status"></div>
              <p>Đang xác thực dữ liệu, vui lòng đợi giây lát...</p>
            </div>
          ) : (
            <div className="verify-content">
              {+errCode === 0 ? (
                <div className="verify-result success">
                  <i className="fas fa-check-circle"></i>
                  <div className="result-text">
                    Xác nhận lịch hẹn thành công!
                  </div>
                  <p>
                    Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Thông tin chi
                    tiết đã được gửi vào email.
                  </p>
                  <button
                    className="btn-home"
                    onClick={() => this.props.history.push("/home")}
                  >
                    Quay lại trang chủ
                  </button>
                </div>
              ) : (
                <div className="verify-result failed">
                  <i className="fas fa-exclamation-triangle"></i>
                  <div className="result-text">Xác nhận không thành công!</div>
                  <p>
                    Lịch hẹn này không tồn tại hoặc đã được xác nhận trước đó.
                  </p>
                  <button
                    className="btn-home"
                    onClick={() => this.props.history.push("/home")}
                  >
                    Về trang chủ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(null, null)(VerifyEmail);
