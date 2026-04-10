import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageBooking.scss";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";
import {
  getAllBookingByPatient,
  cancelBookingService,
} from "../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class ManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      emailSearch: "",
    };
  }

  async componentDidMount() {
    let savedEmail = localStorage.getItem("PATIENT_EMAIL");
    if (savedEmail) {
      this.setState({ emailSearch: savedEmail }, () => {
        this.getDataBooking();
      });
    }
  }

  getDataBooking = async () => {
    let { emailSearch } = this.state;
    if (!emailSearch) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    let res = await getAllBookingByPatient(emailSearch);
    if (res && res.errCode === 0) {
      this.setState({ bookings: res.data });
      if (res.data.length === 0) {
        toast.info("Email này chưa có lịch hẹn nào.");
      }
    } else {
      toast.error("Lỗi lấy dữ liệu");
    }
  };

  handleCancelBooking = async (item) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch này?")) {
      // Backend cần một API xử lý việc xóa/hủy dựa trên ID booking
      let data = {
        bookingId: item.id,
        doctorId: item.doctorId,
        patientId: item.patientId,
        timeType: item.timeType,
        date: item.date,
      };

      console.log(">>> Data gửi lên BE:", data);

      let res = await cancelBookingService(data);

      console.log(">>> Response từ BE:", res);
      if (res && res.errCode === 0) {
        toast.success("Hủy lịch thành công!");
        this.getDataBooking();
      } else {
        toast.error("Hủy lịch thất bại!");
      }
    }
  };

  render() {
    let { bookings, emailSearch } = this.state;
    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="patient-booking-container">
          <div className="container">
            <div className="search-section">
              <input
                type="text"
                value={emailSearch}
                placeholder="Nhập email đã dùng đặt lịch..."
                onChange={(e) => this.setState({ emailSearch: e.target.value })}
              />
              <button
                className="btn-search"
                onClick={() => this.getDataBooking()}
              >
                Tìm kiếm lịch hẹn
              </button>
            </div>

            <div className="title-page">Danh sách lịch hẹn khám</div>

            <div className="booking-list">
              {bookings && bookings.length > 0 ? (
                bookings.map(
                  (item, index) => (
                    console.log("ITEM", item),
                    (
                      <div className="booking-card" key={index}>
                        <div className="card-left">
                          <div className="doctor-img">
                            <i className="fas fa-user-md"></i>
                          </div>
                          <div className="status-label">LỊCH HẸN</div>
                          <div className="time">
                            <i className="far fa-clock"></i>{" "}
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
                          <div className="info-item">
                            <span className="label">Bác sĩ:</span>{" "}
                            <span className="dr-name">
                              {item.doctorData.firstName}{" "}
                              {item.doctorData.lastName}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label">Trạng thái:</span>{" "}
                            <span className={`status st-${item.statusId}`}>
                              {item.statusId === "S1" && "Chờ xác nhận"}
                              {item.statusId === "S2" && "Đã xác nhận"}
                              {item.statusId === "S3" && "Đã thăm khám"}
                              {item.statusId === "S4" && "Đã Hủy"}
                            </span>
                          </div>
                          <div className="btn-container">
                            {item.statusId === "S1" ||
                            item.statusId === "S2" ? (
                              <button
                                className="btn-cancel"
                                onClick={() => this.handleCancelBooking(item)}
                              >
                                Hủy lịch
                              </button>
                            ) : (
                              <button className="btn-status">Hoàn tất</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ),
                )
              ) : (
                <div className="no-data">
                  Không tìm thấy lịch hẹn nào cho email này.
                </div>
              )}
            </div>
          </div>
        </div>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({ language: state.app.language });
export default connect(mapStateToProps)(ManageBooking);
