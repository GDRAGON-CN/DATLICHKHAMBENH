import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./PatientProfile.scss";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";
import {
  updatePatientProfileService,
  changePasswordService,
  getAllBookingByPatient,
  getMedicalHistoryByPatient,
  getAllCodeService,
  cancelBookingService
} from "../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import { LANGUAGES, CommonUtils } from "../../utils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";


class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "personal",
      // Personal Info
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
      address: "",
      gender: "",
      avatar: "",
      previewImgURL: "",
      isOpenLightbox: false,
      genderArr: [],

      // Password
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",

      // Lists
      bookings: [],
      medicalHistories: [],
      loading: false,
    };
  }

  async componentDidMount() {
    if (this.props.isLoggedIn && this.props.userInfo) {
      this.initData();
    }
    this.fetchGenders();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLoggedIn !== prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.initData();
    }
  }

  initData = () => {
    let { userInfo } = this.props;
    let imageBase64 = "";
    if (userInfo && userInfo.image) {
      if (typeof userInfo.image === "string") {
        imageBase64 = userInfo.image;
      } else {
        // Handle Buffer from Sequelize
        imageBase64 = Buffer.from(userInfo.image, "base64").toString("binary");
      }
    }
    this.setState({
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      email: userInfo.email || "",
      phonenumber: userInfo.phonenumber || "",
      address: userInfo.address || "",
      gender: userInfo.gender || "",
      avatar: imageBase64,
      previewImgURL: imageBase64,
    });
  };

  fetchGenders = async () => {
    let res = await getAllCodeService("GENDER");
    if (res && res.errCode === 0) {
      this.setState({
        genderArr: res.data,
      });
    }
  };

  handleTabClick = (tabId) => {
    this.setState({ activeTab: tabId }, () => {
      if (tabId === "bookings") {
        this.fetchBookings();
      } else if (tabId === "history") {
        this.fetchMedicalHistories();
      }
    });
  };

  fetchBookings = async () => {
    this.setState({ loading: true });
    let res = await getAllBookingByPatient(this.props.userInfo.email);
    if (res && res.errCode === 0) {
      this.setState({ bookings: res.data, loading: false });
    } else {
      this.setState({ loading: false });
    }
  };

  fetchMedicalHistories = async () => {
    this.setState({ loading: true });
    let res = await getMedicalHistoryByPatient(this.props.userInfo.id);
    if (res && res.errCode === 0) {
      this.setState({ medicalHistories: res.data, loading: false });
    } else {
      this.setState({ loading: false });
    }
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({ ...copyState });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
      });
    }
  };

  handleUpdateProfile = async () => {
    let { firstName, lastName, address, phonenumber, gender, avatar, email } = this.state;
    let res = await updatePatientProfileService({
      id: this.props.userInfo.id,
      email: email,
      firstName,
      lastName,
      address,
      phonenumber,
      gender,
      avatar,
    });

    if (res && res.errCode === 0) {
      toast.success("Cập nhật thông tin thành công!");
      // Optionally refresh user info in redux if possible, but for now we just show success
    } else {
      toast.error(res.errMessage || "Cập nhật thất bại!");
    }
  };

  handleChangePassword = async () => {
    let { oldPassword, newPassword, confirmPassword } = this.state;
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp!");
      return;
    }
    let res = await changePasswordService({
      id: this.props.userInfo.id,
      oldPassword,
      newPassword,
    });

    if (res && res.errCode === 0) {
      toast.success("Đổi mật khẩu thành công!");
      this.setState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(res.errMessage || "Đổi mật khẩu thất bại!");
    }
  };

  handleCancelBooking = async (item) => {
    if (window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
      let res = await cancelBookingService({
        bookingId: item.id,
        doctorId: item.doctorId,
        patientId: item.patientId,
        timeType: item.timeType,
        date: item.date,
      });
      if (res && res.errCode === 0) {
        toast.success("Hủy lịch thành công!");
        this.fetchBookings();
      } else {
        toast.error("Hủy lịch thất bại!");
      }
    }
  };

  renderPersonalTab = () => {
    let { firstName, lastName, email, phonenumber, address, gender, genderArr, previewImgURL } = this.state;
    let { language } = this.props;
    console.log("THIS STATE", this.state);
    return (
      <div className="personal-info-tab">
        <div className="row">
          <div className="col-4 text-center">
            <div className="avatar-preview-container">
              <div
                className="avatar-image"
                style={{ backgroundImage: `url(${previewImgURL || ""})` }}
                onClick={() => this.setState({ isOpenLightbox: true })}
              ></div>
              <input type="file" id="avatar-input" hidden onChange={(e) => this.handleOnChangeImage(e)} />
              <label htmlFor="avatar-input" className="btn-upload-avatar">
                <i className="fas fa-camera"></i> Thay đổi ảnh
              </label>
            </div>
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-6 form-group">
                <label>Họ</label>
                <input type="text" className="form-control" value={lastName} onChange={(e) => this.handleOnChangeInput(e, "lastName")} />
              </div>
              <div className="col-6 form-group">
                <label>Tên</label>
                <input type="text" className="form-control" value={firstName} onChange={(e) => this.handleOnChangeInput(e, "firstName")} />
              </div>
              <div className="col-12 form-group">
                <label>Email (Không thể thay đổi)</label>
                <input type="email" className="form-control" value={email} disabled />
              </div>
              <div className="col-6 form-group">
                <label>Số điện thoại</label>
                <input type="text" className="form-control" value={phonenumber} onChange={(e) => this.handleOnChangeInput(e, "phonenumber")} />
              </div>
              <div className="col-6 form-group">
                <label>Giới tính</label>
                <select className="form-control" value={gender} onChange={(e) => this.handleOnChangeInput(e, "gender")}>
                  {genderArr && genderArr.length > 0 && genderArr.map((item, index) => (
                    <option key={index} value={item.keyMap}>
                      {item.valueVi}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 form-group">
                <label>Địa chỉ</label>
                <input type="text" className="form-control" value={address} onChange={(e) => this.handleOnChangeInput(e, "address")} />
              </div>
              <div className="col-12 mt-3">
                <button className="btn btn-primary px-4" onClick={() => this.handleUpdateProfile()}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderBookingTab = () => {
    let { bookings, loading } = this.state;
    return (
      <div className="booking-history-tab">
        <h5 className="mb-4">Lịch sử đặt khám</h5>
        {loading ? (
          <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x"></i></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover custom-table">
              <thead>
                <tr>
                  <th>Ngày khám</th>
                  <th>Thời gian</th>
                  <th>Bác sĩ</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((item, index) => (
                    <tr key={index}>
                      <td>{moment(Number(item.date)).format("DD/MM/YYYY")}</td>
                      <td>{item.timeTypeDataPatient ? item.timeTypeDataPatient.valueVi : ""}</td>
                      <td>{item.doctorData.lastName} {item.doctorData.firstName}</td>
                      <td>
                        <span className={`badge badge-${item.statusId === "S3" ? "success" : item.statusId === "S4" ? "danger" : "warning"}`}>
                          {item.statusId === "S1" && "Chờ xác nhận"}
                          {item.statusId === "S2" && "Đã xác nhận"}
                          {item.statusId === "S3" && "Đã khám xong"}
                          {item.statusId === "S4" && "Đã hủy"}
                        </span>
                      </td>
                      <td>
                        {(item.statusId === "S1" || item.statusId === "S2") && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => this.handleCancelBooking(item)}>Hủy</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center">Không có lịch hẹn nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  renderHistoryTab = () => {
    let { medicalHistories, loading } = this.state;
    return (
      <div className="medical-history-tab">
        <h5 className="mb-4">Kết quả khám bệnh</h5>
        {loading ? (
          <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x"></i></div>
        ) : (
          <div className="row">
            {medicalHistories && medicalHistories.length > 0 ? (
              medicalHistories.map((item, index) => {
                let imageBase64 = item.files || "";
                return (
                  <div className="col-12 mb-4" key={index}>
                    <div className="history-card shadow-sm rounded border-0">
                      <div className="history-header d-flex justify-content-between align-items-center p-3">
                        <span className="history-date">
                          <i className="fas fa-calendar-check mr-2"></i>
                          Ngày khám: {moment(item.createdAt).format("DD/MM/YYYY")}
                        </span>
                        <span className="history-doctor">
                          <i className="fas fa-user-md mr-2"></i>
                          Bác sĩ: {item.doctorDataHistory.lastName} {item.doctorDataHistory.firstName}
                        </span>
                        <button 
                          className="btn btn-sm btn-outline-primary px-3"
                          onClick={() => this.props.history.push(`/detail-doctor/${item.doctorId}`)}
                        >
                          <i className="fas fa-star mr-1"></i> Đánh giá
                        </button>
                      </div>
                      <div className="history-body p-3">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <div className="info-label text-uppercase small font-weight-bold text-muted mb-1">Chuẩn đoán</div>
                            <div className="info-value text-dark p-2 bg-light rounded">{item.diagnosis || "Chưa có thông tin"}</div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="info-label text-uppercase small font-weight-bold text-muted mb-1">Đơn thuốc</div>
                            <div className="info-value text-dark p-2 bg-light rounded">{item.prescription || "Chưa có thông tin"}</div>
                          </div>
                        </div>
                        {imageBase64 && (
                          <div className="history-attachment mt-3">
                            <div className="info-label text-uppercase small font-weight-bold text-muted mb-2">Hóa đơn / Đơn thuốc chi tiết</div>
                            <div 
                              className="attachment-preview rounded border"
                              style={{ backgroundImage: `url(${imageBase64})` }}
                              onClick={() => this.setState({ isOpenLightbox: true, previewImgURL: imageBase64 })}
                            >
                                <div className="preview-overlay">
                                    <i className="fas fa-search-plus"></i>
                                </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-4">Chưa có lịch sử khám bệnh</div>
            )}
          </div>
        )}
      </div>
    );
  };

  renderPasswordTab = () => {
    let { oldPassword, newPassword, confirmPassword } = this.state;
    return (
      <div className="password-tab">
        <h5 className="mb-4">Đổi mật khẩu</h5>
        <div className="col-md-6 offset-md-3">
          <div className="form-group">
            <label>Mật khẩu cũ</label>
            <input type="password" name="oldPassword" className="form-control" value={oldPassword} onChange={(e) => this.handleOnChangeInput(e, "oldPassword")} />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input type="password" name="newPassword" className="form-control" value={newPassword} onChange={(e) => this.handleOnChangeInput(e, "newPassword")} />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" name="confirmPassword" className="form-control" value={confirmPassword} onChange={(e) => this.handleOnChangeInput(e, "confirmPassword")} />
          </div>
          <button className="btn btn-warning w-100 mt-3 font-weight-bold" onClick={() => this.handleChangePassword()}>Cập nhật mật khẩu</button>
        </div>
      </div>
    );
  };

  render() {
    let { activeTab, isOpenLightbox, previewImgURL } = this.state;
    let { isLoggedIn } = this.props;

    if (!isLoggedIn) {
      return (
        <div className="p-5 text-center">
            <h3>Vui lòng đăng nhập để xem hồ sơ</h3>
            <button className="btn btn-primary mt-3" onClick={() => this.props.history.push('/patient-login')}>Đăng nhập</button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="patient-profile-container">
          <div className="container py-5">
            <div className="pp-wrapper shadow-lg rounded">
              <div className="row no-gutters">
                <div className="col-md-3 pp-sidebar">
                  <div className="pp-sidebar-header text-center">
                    <div className="pp-profile-img" style={{ backgroundImage: `url(${this.state.avatar || ""})` }}></div>
                    <div className="pp-profile-name">{this.state.lastName} {this.state.firstName}</div>
                    <div className="pp-profile-email">{this.state.email}</div>
                  </div>
                  <nav className="pp-profile-nav">
                    <div className={`pp-nav-item ${activeTab === "personal" ? "active" : ""}`} onClick={() => this.handleTabClick("personal")}>
                      <i className="fas fa-user-edit"></i> Thông tin cá nhân
                    </div>
                    <div className={`pp-nav-item ${activeTab === "bookings" ? "active" : ""}`} onClick={() => this.handleTabClick("bookings")}>
                      <i className="fas fa-calendar-alt"></i> Lịch sử đặt khám
                    </div>
                    <div className={`pp-nav-item ${activeTab === "history" ? "active" : ""}`} onClick={() => this.handleTabClick("history")}>
                      <i className="fas fa-notes-medical"></i> Kết quả khám bệnh
                    </div>
                    <div className={`pp-nav-item ${activeTab === "password" ? "active" : ""}`} onClick={() => this.handleTabClick("password")}>
                      <i className="fas fa-key"></i> Đổi mật khẩu
                    </div>
                  </nav>
                </div>
                <div className="col-md-9 pp-content">
                  {activeTab === "personal" && this.renderPersonalTab()}
                  {activeTab === "bookings" && this.renderBookingTab()}
                  {activeTab === "history" && this.renderHistoryTab()}
                  {activeTab === "password" && this.renderPasswordTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <HomeFooter />

        {isOpenLightbox && (
          <Lightbox mainSrc={previewImgURL} onCloseRequest={() => this.setState({ isOpenLightbox: false })} />
        )}


      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
  userInfo: state.user.userInfo,
  language: state.app.language,
});

export default connect(mapStateToProps)(PatientProfile);
