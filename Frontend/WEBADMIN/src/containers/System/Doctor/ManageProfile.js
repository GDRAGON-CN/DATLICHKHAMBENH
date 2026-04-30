import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "./ManageProfile.scss";
import {
  getProfileInforDoctorById,
  editUserService,
  changePasswordService,
} from "../../../services/userService";

class ManageProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // --- Thông tin cơ bản ---
      isLoading: true,
      isSavingProfile: false,

      // Fields hiển thị / edit
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
      address: "",
      gender: "",
      positionName: "",
      specialtyName: "",
      previewImgURL: "",
      avatarBase64: "",

      // --- Đổi mật khẩu ---
      isSavingPassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOld: false,
      showNew: false,
      showConfirm: false,
      passwordStrength: "",
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    await this.fetchDoctorProfile();
  }

  fetchDoctorProfile = async () => {
    const { userInfo } = this.props;
    if (!userInfo || !userInfo.id) return;
    this.setState({ isLoading: true });
    try {
      let res = await getProfileInforDoctorById(userInfo.id);
      if (res && res.errCode === 0 && res.data) {
        const d = res.data;
        const doctorInfor = d.Doctor_Infor || {};
        const positionData = doctorInfor.positionData || {};
        const specialtyData = doctorInfor.specialtyData || {};

        this.setState({
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          email: d.email || "",
          phonenumber: d.phonenumber || "",
          address: d.address || "",
          gender: d.gender || "",
          positionName: positionData.valueVi || positionData.valueEn || "Chưa cập nhật",
          specialtyName: specialtyData.name || "Chưa cập nhật",
          previewImgURL: d.image || "",
        });
      }
    } catch (e) {
      toast.error("Lỗi khi tải thông tin hồ sơ!");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // ── Avatar upload ──────────────────────────────────────
  handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.warning("Vui lòng chọn file ảnh!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        previewImgURL: reader.result,
        avatarBase64: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  // ── Lưu thông tin cơ bản ──────────────────────────────
  handleSaveProfile = async () => {
    const { userInfo } = this.props;
    const { firstName, lastName, phonenumber, address, gender, avatarBase64 } = this.state;

    if (!firstName.trim() || !lastName.trim()) {
      toast.warning("Họ và tên không được để trống!");
      return;
    }

    this.setState({ isSavingProfile: true });
    try {
      let payload = {
        id: userInfo.id,
        firstName,
        lastName,
        phonenumber,
        address,
        gender: gender || "M",
        roleId: userInfo.roleId,
      };
      if (avatarBase64) {
        payload.avatar = avatarBase64;
      }

      let res = await editUserService(payload);
      if (res && res.errCode === 0) {
        toast.success("✅ Cập nhật thông tin thành công!");
        this.setState({ avatarBase64: "" });
      } else {
        toast.error("Cập nhật thất bại: " + (res.errMessage || "Lỗi không xác định"));
      }
    } catch (e) {
      toast.error("Lỗi kết nối server!");
    } finally {
      this.setState({ isSavingProfile: false });
    }
  };

  // ── Đổi mật khẩu ─────────────────────────────────────
  checkPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "weak";
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2 && pwd.length >= 8) return "strong";
    return "medium";
  };

  handleNewPasswordChange = (e) => {
    const val = e.target.value;
    this.setState({ newPassword: val, passwordStrength: this.checkPasswordStrength(val) });
  };

  handleChangePassword = async () => {
    const { userInfo } = this.props;
    const { oldPassword, newPassword, confirmPassword } = this.state;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning("Vui lòng điền đầy đủ các trường mật khẩu!");
      return;
    }
    if (newPassword.length < 6) {
      toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (oldPassword === newPassword) {
      toast.warning("Mật khẩu mới không được trùng mật khẩu cũ!");
      return;
    }

    this.setState({ isSavingPassword: true });
    try {
      let res = await changePasswordService({
        id: userInfo.id,
        oldPassword,
        newPassword,
      });
      if (res && res.errCode === 0) {
        toast.success("🔐 Đổi mật khẩu thành công!");
        this.setState({ oldPassword: "", newPassword: "", confirmPassword: "", passwordStrength: "" });
      } else if (res && res.errCode === 2) {
        toast.error("Mật khẩu cũ không đúng!");
      } else {
        toast.error("Đổi mật khẩu thất bại: " + (res.errMessage || "Lỗi không xác định"));
      }
    } catch (e) {
      toast.error("Lỗi kết nối server!");
    } finally {
      this.setState({ isSavingPassword: false });
    }
  };

  renderStrengthBar = () => {
    const { passwordStrength } = this.state;
    if (!passwordStrength) return null;
    const labelMap = { weak: "Yếu", medium: "Trung bình", strong: "Mạnh" };
    return (
      <>
        <div className="strength-bar">
          <div className={`strength-fill ${passwordStrength}`} />
        </div>
        <div className={`password-strength ${passwordStrength}`}>
          Độ mạnh: {labelMap[passwordStrength]}
        </div>
      </>
    );
  };

  renderSkeleton = () => (
    <div className="manage-profile-container">
      <div className="mp-title"><i className="fas fa-user-circle" />Hồ sơ của tôi</div>
      <div className="profile-card">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="form-group"><div className="skeleton" /></div>
        ))}
      </div>
    </div>
  );

  render() {
    const {
      isLoading,
      isSavingProfile,
      isSavingPassword,
      firstName, lastName, email, phonenumber, address, gender,
      positionName, specialtyName,
      previewImgURL,
      oldPassword, newPassword, confirmPassword,
      showOld, showNew, showConfirm,
    } = this.state;

    if (isLoading) return this.renderSkeleton();

    return (
      <div className="manage-profile-container">
        <div className="mp-title">
          <i className="fas fa-user-circle" /> Hồ sơ của tôi
        </div>

        <div className="container">
          <div className="row">
            {/* ── CỘT TRÁI: Ảnh + thông tin chuyên môn ── */}
            <div className="col-md-4">
              {/* Avatar Card */}
              <div className="profile-card">
                <div className="card-header-section">
                  <i className="fas fa-camera" />
                  <h5>Ảnh đại diện</h5>
                </div>
                <div className="avatar-section">
                  {previewImgURL ? (
                    <img
                      src={previewImgURL}
                      alt="Avatar"
                      className="avatar-preview"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user-md" />
                    </div>
                  )}
                  <div className="avatar-label">Ảnh đại diện bác sĩ</div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={this.fileInputRef}
                    style={{ display: "none" }}
                    onChange={this.handleAvatarChange}
                    id="avatar-upload"
                  />
                  <button
                    className="btn-upload-avatar"
                    onClick={() => this.fileInputRef.current.click()}
                  >
                    <i className="fas fa-upload" /> Chọn ảnh
                  </button>
                </div>

                {/* Thông tin chuyên môn (chỉ đọc) */}
                <div style={{ marginTop: "20px" }}>
                  <div className="card-header-section">
                    <i className="fas fa-stethoscope" />
                    <h5>Thông tin chuyên môn</h5>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-briefcase-medical" />Chức vụ</span>
                    <span className="info-value">
                      <span className="badge-role">{positionName}</span>
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-hospital" />Chuyên khoa</span>
                    <span className="info-value">
                      <span className="badge-specialty">{specialtyName}</span>
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-envelope" />Email</span>
                    <span className="info-value">{email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CỘT PHẢI: Form chỉnh sửa ── */}
            <div className="col-md-8">
              {/* Thông tin cá nhân */}
              <div className="profile-card">
                <div className="card-header-section">
                  <i className="fas fa-user-edit" />
                  <h5>Thông tin cá nhân</h5>
                </div>

                <div className="row">
                  <div className="col-6 form-group">
                    <label><i className="fas fa-signature" />Họ</label>
                    <input
                      id="doctor-lastname"
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => this.setState({ lastName: e.target.value })}
                      placeholder="Nhập họ..."
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label><i className="fas fa-signature" />Tên</label>
                    <input
                      id="doctor-firstname"
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => this.setState({ firstName: e.target.value })}
                      placeholder="Nhập tên..."
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 form-group">
                    <label><i className="fas fa-phone-alt" />Số điện thoại</label>
                    <input
                      id="doctor-phone"
                      type="text"
                      className="form-control"
                      value={phonenumber}
                      onChange={(e) => this.setState({ phonenumber: e.target.value })}
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label><i className="fas fa-venus-mars" />Giới tính</label>
                    <select
                      id="doctor-gender"
                      className="form-control"
                      value={gender}
                      onChange={(e) => this.setState({ gender: e.target.value })}
                    >
                      <option value="M">Nam</option>
                      <option value="F">Nữ</option>
                      <option value="O">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label><i className="fas fa-map-marker-alt" />Địa chỉ</label>
                  <input
                    id="doctor-address"
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => this.setState({ address: e.target.value })}
                    placeholder="Nhập địa chỉ..."
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-envelope" />Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    readOnly
                  />
                </div>

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <button
                    id="btn-save-profile"
                    className="btn-save-profile"
                    onClick={this.handleSaveProfile}
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? (
                      <><i className="fas fa-spinner fa-spin" /> Đang lưu...</>
                    ) : (
                      <><i className="fas fa-save" /> Lưu thông tin</>
                    )}
                  </button>
                </div>
              </div>

              {/* Đổi mật khẩu */}
              <div className="password-card">
                <div className="card-header-section">
                  <i className="fas fa-lock" />
                  <h5>Đổi mật khẩu</h5>
                </div>

                <div className="form-group">
                  <label><i className="fas fa-key" />Mật khẩu hiện tại</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="old-password"
                      type={showOld ? "text" : "password"}
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => this.setState({ oldPassword: e.target.value })}
                      placeholder="Nhập mật khẩu hiện tại..."
                      style={{ paddingRight: "40px" }}
                    />
                    <i
                      className={`fas ${showOld ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => this.setState({ showOld: !showOld })}
                      style={{
                        position: "absolute", right: "13px", top: "50%",
                        transform: "translateY(-50%)", cursor: "pointer", color: "#999"
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label><i className="fas fa-lock" />Mật khẩu mới</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      className="form-control"
                      value={newPassword}
                      onChange={this.handleNewPasswordChange}
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                      style={{ paddingRight: "40px" }}
                    />
                    <i
                      className={`fas ${showNew ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => this.setState({ showNew: !showNew })}
                      style={{
                        position: "absolute", right: "13px", top: "50%",
                        transform: "translateY(-50%)", cursor: "pointer", color: "#999"
                      }}
                    />
                  </div>
                  {this.renderStrengthBar()}
                </div>

                <div className="form-group">
                  <label><i className="fas fa-check-double" />Xác nhận mật khẩu mới</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới..."
                      style={{ paddingRight: "40px" }}
                    />
                    <i
                      className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => this.setState({ showConfirm: !showConfirm })}
                      style={{
                        position: "absolute", right: "13px", top: "50%",
                        transform: "translateY(-50%)", cursor: "pointer", color: "#999"
                      }}
                    />
                  </div>
                  {confirmPassword && newPassword && (
                    <div style={{ fontSize: "12px", marginTop: "4px", fontWeight: 600 }}>
                      {newPassword === confirmPassword ? (
                        <span style={{ color: "#27ae60" }}>✅ Mật khẩu khớp</span>
                      ) : (
                        <span style={{ color: "#e74c3c" }}>❌ Mật khẩu không khớp</span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                  <button
                    id="btn-change-password"
                    className="btn-change-password"
                    onClick={this.handleChangePassword}
                    disabled={isSavingPassword}
                  >
                    {isSavingPassword ? (
                      <><i className="fas fa-spinner fa-spin" /> Đang xử lý...</>
                    ) : (
                      <><i className="fas fa-key" /> Đổi mật khẩu</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
  language: state.app.language,
});

export default connect(mapStateToProps)(ManageProfile);
