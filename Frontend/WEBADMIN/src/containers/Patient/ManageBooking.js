import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageBooking.scss";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";
import {
  cancelBookingService,
  getAllBookingByPatient,
} from "../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class ManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      emailSearch: "",
      isVerified: false,
      loading: true,
      activeTab: "upcoming", 
    };
  }

  async componentDidMount() {
    if (this.props.isLoggedIn && this.props.userInfo) {
      this.fetchBookings(this.props.userInfo.email);
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isLoggedIn !== prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.fetchBookings(this.props.userInfo.email);
    }
  }

  fetchBookings = async (email) => {
    this.setState({ loading: true });
    let res = await getAllBookingByPatient(email);
    if (res && res.errCode === 0) {
      this.setState({
        bookings: res.data,
        emailSearch: email,
        isVerified: true,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
      toast.error(res.errMessage || "Không thể lấy danh sách lịch hẹn!");
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
        // Refresh lại danh sách
        this.fetchBookings(this.props.userInfo.email);
      } else {
        toast.error("Hủy lịch thất bại!");
      }
    }
  };

  handleTabClick = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  renderSkeleton = () => {
    let skeletons = [1, 2, 3];
    return skeletons.map((item) => (
      <div className="skeleton-card" key={item}>
        <div className="sk-left">
          <div className="sk-anim sk-badge"></div>
          <div className="sk-anim sk-time"></div>
          <div className="sk-anim sk-date"></div>
        </div>
        <div className="sk-right">
          <div className="sk-anim sk-line sk-line-1"></div>
          <div className="sk-anim sk-line sk-line-2"></div>
          <div className="sk-anim sk-btn"></div>
        </div>
      </div>
    ));
  };

  render() {
    let { bookings, emailSearch, isVerified, loading, activeTab } = this.state;

    let filteredBookings = bookings.filter((item) => {
      if (activeTab === "upcoming")
        return item.statusId === "S1" || item.statusId === "S2";
      if (activeTab === "completed") return item.statusId === "S3";
      if (activeTab === "cancelled") return item.statusId === "S4";
      return false;
    });

    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="patient-booking-container">
          <div className="container">
            {!this.props.isLoggedIn ? (
              <div className="verify-email-wrapper">
                <div className="verify-card" style={{ padding: "40px", textAlign: "center" }}>
                  <div className="icon-box">
                    <i className="fas fa-user-lock"></i>
                  </div>
                  <h3>Quản lý lịch hẹn</h3>
                  <p>Vui lòng đăng nhập để xem danh sách lịch hẹn của bạn.</p>
                  <button
                    className="btn-request"
                    style={{ marginTop: "20px", width: "100%", height: "40px", borderRadius: "5px", border: "none", backgroundColor: "#45c3d2", color: "white", fontWeight: "600" }}
                    onClick={() => this.props.history.push('/patient-login')}
                  >
                    Đăng nhập / Đăng ký
                  </button>
                </div>
              </div>
            ) : (
              <div className="booking-list-wrapper">
                <div className="title-page">Danh sách lịch hẹn của bạn</div>
                <div className="patient-info-summary">
                  <i className="fas fa-user-circle"></i> Email:{" "}
                  <strong>{emailSearch}</strong>
                </div>

                <div className="booking-tabs">
                  <div
                    className={`tab-item ${activeTab === "upcoming" ? "active" : ""}`}
                    onClick={() => this.handleTabClick("upcoming")}
                  >
                    Sắp tới
                  </div>
                  <div
                    className={`tab-item ${activeTab === "completed" ? "active" : ""}`}
                    onClick={() => this.handleTabClick("completed")}
                  >
                    Đã hoàn thành
                  </div>
                  <div
                    className={`tab-item ${activeTab === "cancelled" ? "active" : ""}`}
                    onClick={() => this.handleTabClick("cancelled")}
                  >
                    Đã hủy
                  </div>
                </div>

                <div className="booking-list">
                  {loading ? (
                    this.renderSkeleton()
                  ) : filteredBookings && filteredBookings.length > 0 ? (
                    filteredBookings.map((item, index) => (
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
                      {activeTab === "upcoming" && "Bạn hiện không có lịch hẹn sắp tới nào."}
                      {activeTab === "completed" && "Bạn chưa có lịch hẹn nào đã hoàn thành."}
                      {activeTab === "cancelled" && "Không có lịch hẹn nào đã hủy."}
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

const mapStateToProps = (state) => ({ 
  language: state.app.language,
  isLoggedIn: state.user.isLoggedIn,
  userInfo: state.user.userInfo
});
export default connect(mapStateToProps)(ManageBooking);
