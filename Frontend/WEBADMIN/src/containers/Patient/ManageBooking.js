import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageBooking.scss";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";
import {
  cancelBookingService,
  requestMagicLink, // Thêm mới
  verifyMagicLink, // Thêm mới
} from "../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class ManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      emailSearch: "",
      isVerified: false, // Flag kiểm tra đã click link từ mail chưa
      loading: false,
    };
  }

  async componentDidMount() {
    // 1. Kiểm tra xem trên URL có token và email không (trường hợp click từ mail)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (token && email) {
      this.handleVerifyAccess(token, email);
    }
  }

  // Hàm xử lý xác thực khi click từ link email
  handleVerifyAccess = async (token, email) => {
    this.setState({ loading: true });
    let res = await verifyMagicLink({ token, email });
    if (res && res.errCode === 0) {
      this.setState({
        bookings: res.data,
        isVerified: true,
        emailSearch: email,
        loading: false,
      });
      toast.success("Xác thực thành công!");
    } else {
      this.setState({ loading: false });
      toast.error(res.errMessage || "Link xác thực không hợp lệ hoặc hết hạn!");
    }
  };

  // Hàm xử lý khi nhấn "Gửi link truy cập"
  handleRequestLink = async () => {
    let { emailSearch } = this.state;
    if (!emailSearch) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    let res = await requestMagicLink(emailSearch);
    if (res && res.errCode === 0) {
      toast.success(
        "Link truy cập đã được gửi vào email của bạn. Vui lòng kiểm tra!",
      );
    } else {
      toast.error(res.errMessage || "Có lỗi xảy ra!");
    }
  };

  handleCancelBooking = async (item) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch này?")) {
      let data = {
        bookingId: item.id,
        doctorId: item.doctorId,
        patientId: item.patientId,
        timeType: item.timeType,
        date: item.date,
      };

      let res = await cancelBookingService(data);
      if (res && res.errCode === 0) {
        toast.success("Hủy lịch thành công!");
        // Refresh lại danh sách (Dùng lại hàm verify để lấy data mới nhất)
        const urlParams = new URLSearchParams(window.location.search);
        this.handleVerifyAccess(urlParams.get("token"), urlParams.get("email"));
      } else {
        toast.error("Hủy lịch thất bại!");
      }
    }
  };

  render() {
    let { bookings, emailSearch, isVerified, loading } = this.state;
    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="patient-booking-container">
          <div className="container">
            {!isVerified ? (
              /* GIAO DIỆN KHI CHƯA XÁC THỰC - ĐƯA RA GIỮA */
              <div className="verify-email-wrapper">
                <div className="verify-card">
                  <div className="icon-box">
                    <i className="fas fa-envelope-open-text"></i>
                  </div>
                  <h3>Quản lý lịch hẹn</h3>
                  <p>
                    Vui lòng nhập email để nhận link xác thực truy cập danh sách
                    lịch hẹn của bạn.
                  </p>
                  <div className="input-group">
                    <input
                      type="email"
                      value={emailSearch}
                      placeholder="example@gmail.com"
                      onChange={(e) =>
                        this.setState({ emailSearch: e.target.value })
                      }
                    />
                    <button
                      className="btn-request"
                      disabled={loading}
                      onClick={() => this.handleRequestLink()}
                    >
                      {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "Gửi link xác thực"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* GIAO DIỆN KHI ĐÃ XÁC THỰC THÀNH CÔNG */
              <div className="booking-list-wrapper">
                <div className="title-page">Danh sách lịch hẹn của bạn</div>
                <div className="patient-info-summary">
                  <i className="fas fa-user-circle"></i> Email:{" "}
                  <strong>{emailSearch}</strong>
                </div>

                <div className="booking-list">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((item, index) => (
                      <div className="booking-card" key={index}>
                        <div className="card-left">
                          <div className="status-badge">LỊCH HẸN</div>
                          <div className="time">
                            <i className="far fa-clock"></i>
                            {item.timeTypeDataPatient
                              ? item.timeTypeDataPatient.valueVi
                              : ""}
                          </div>
                          <div className="date">
                            <i className="far fa-calendar-alt"></i>
                            {moment(Number(item.date)).format("DD/MM/YYYY")}
                          </div>
                        </div>

                        <div className="card-right">
                          <div className="doctor-info">
                            <span className="label">Bác sĩ:</span>
                            <span className="dr-name">
                              {item.doctorData.firstName}{" "}
                              {item.doctorData.lastName}
                            </span>
                          </div>
                          <div className="status-info">
                            <span className="label">Trạng thái:</span>
                            <span className={`status st-${item.statusId}`}>
                              {item.statusId === "S1" && "Chờ xác nhận"}
                              {item.statusId === "S2" && "Đã xác nhận"}
                              {item.statusId === "S3" && "Đã thăm khám"}
                              {item.statusId === "S4" && "Đã hủy"}
                            </span>
                          </div>
                          <div className="btn-container">
                            {(item.statusId === "S1" ||
                              item.statusId === "S2") && (
                              <button
                                className="btn-cancel"
                                onClick={() => this.handleCancelBooking(item)}
                              >
                                Hủy lịch ngay
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">
                      Bạn hiện không có lịch hẹn nào.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ language: state.app.language });
export default connect(mapStateToProps)(ManageBooking);
