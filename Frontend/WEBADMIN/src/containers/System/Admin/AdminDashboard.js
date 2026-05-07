import React, { Component } from "react";
import { connect } from "react-redux";
import "./AdminDashboard.scss";
import {
  getDashboardStats,
  getTopDoctorHomeService,
  getAllBookingForAdmin
} from "../../../services/userService";
import moment from "moment";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCount: {},
      topDoctors: [],
      recentBookings: [],
      doctorsByPosition: {},
      doctorsBySpecialty: {},
      averageRating: 0,
      handbookCount: 0,
      roleCounts: {
        R1: 0,
        R2: 0,
        R3: 0
      }
    };
  }

  async componentDidMount() {
    this.fetchDashboardData();
  }

  fetchDashboardData = async () => {
    try {
      let res = await getDashboardStats();
      if (res && res.errCode === 0) {
        this.setState({ 
          statusCount: res.data.statusCount || {},
          doctorsByPosition: res.data.doctorsByPosition || {},
          doctorsBySpecialty: res.data.doctorsBySpecialty || {},
          averageRating: res.data.averageRating || 0,
          handbookCount: res.data.handbookCount || 0,
          roleCounts: res.data.roleCounts || { R1: 0, R2: 0, R3: 0 }
        });
      }

      let resDoctors = await getTopDoctorHomeService(5);
      if (resDoctors && resDoctors.errCode === 0) {
        this.setState({ topDoctors: resDoctors.data });
      }

      let resBookings = await getAllBookingForAdmin('ALL');
      if (resBookings && resBookings.errCode === 0) {
        let data = resBookings.data || [];
        let sorted = data.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        this.setState({ recentBookings: sorted.slice(0, 5) });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    let { statusCount, topDoctors, recentBookings, doctorsByPosition, doctorsBySpecialty, averageRating, handbookCount, roleCounts } = this.state;

    return (
      <div className="admin-dashboard-container p-4">
        <div className="title mb-4 font-weight-bold text-primary" style={{ fontSize: "24px" }}>Dashboard Thống Kê Tổng Quan</div>

        <div className="dashboard-content">
          {/* ─── Thẻ người dùng ─────────────────────────── */}
          <div className="row mb-4">
            <div className="col-xl-4 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Tổng số bệnh nhân
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {roleCounts.R3 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-user-injured fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Tổng số bác sĩ
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {roleCounts.R2 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-user-md fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-12 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Quản trị viên
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {roleCounts.R1 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-user-shield fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Thẻ tóm tắt ─────────────────────────── */}
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Lịch mới (S1)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {statusCount.S1 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Đã xác nhận (S2)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {statusCount.S2 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Đã hoàn thành (S3)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {statusCount.S3 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-check fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-danger shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                        Đã hủy (S4)
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {statusCount.S4 || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-times-circle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Số liệu thống kê bổ sung ─────────────────────────── */}
          <div className="row mb-4">
            <div className="col-xl-6 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Điểm Đánh Giá Trung Bình Y Bác Sĩ
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {averageRating} <i className="fas fa-star text-warning"></i>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-star-half-alt fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-6 col-md-6 mb-4">
              <div className="card border-left-secondary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                        Số Bài Viết Cẩm Nang
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {handbookCount} Bài Viết
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-book-medical fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            {/* ─── Số lượng Bác sĩ theo Chức danh ─────────────────────────── */}
            <div className="col-xl-6 col-lg-6 mb-4">
              <div className="card shadow mb-4 h-100">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-user-md text-primary mr-2"></i>Số lượng bác sĩ theo chức danh</h6>
                </div>
                <div className="card-body">
                   <ul className="list-group list-group-flush">
                     {Object.keys(doctorsByPosition).length > 0 ? Object.keys(doctorsByPosition).map((pos, index) => {
                        return (
                          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                             {pos}
                             <span className="badge badge-primary badge-pill">{doctorsByPosition[pos]}</span>
                          </li>
                        )
                     }) : <div>Chưa có dữ liệu</div>}
                   </ul>
                </div>
              </div>
            </div>

            {/* ─── Số lượng Chuyên gia theo Chuyên khoa ─────────────────────────── */}
            <div className="col-xl-6 col-lg-6 mb-4">
              <div className="card shadow mb-4 h-100">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-briefcase-medical text-success mr-2"></i>Số lượng chuyên gia theo chuyên khoa</h6>
                </div>
                <div className="card-body">
                   <ul className="list-group list-group-flush" style={{maxHeight: '300px', overflowY: 'auto'}}>
                     {Object.keys(doctorsBySpecialty).length > 0 ? Object.keys(doctorsBySpecialty).map((spec, index) => {
                        return (
                          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                             {spec}
                             <span className="badge badge-success badge-pill">{doctorsBySpecialty[spec]}</span>
                          </li>
                        )
                     }) : <div>Chưa có dữ liệu</div>}
                   </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Bảng phụ ─────────────────────────── */}
          <div className="row">
            <div className="col-xl-6 col-lg-6 mb-4">
              <div className="card shadow mb-4 h-100">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-star text-warning mr-2"></i>Top 5 Bác sĩ Nổi Bật</h6>
                </div>
                <div className="card-body">
                   <ul className="list-group list-group-flush">
                     {topDoctors && topDoctors.length > 0 ? topDoctors.map((item, index) => {
                        let positionData = item.Doctor_Infor ? item.Doctor_Infor.positionData : null;
                        let positionVi = positionData ? positionData.valueVi : "";
                        let nameVi = `${positionVi}, ${item.lastName} ${item.firstName}`;
                        let imageBase64 = "";
                        if (item.image) {
                          imageBase64 = new Buffer(item.image, "base64").toString("binary");
                        }
                        return (
                          <li className="list-group-item d-flex align-items-center" key={index}>
                             <div className="mr-3" style={{width: "40px", height: "40px", borderRadius: "50%", backgroundImage: `url(${imageBase64})`, backgroundSize: "cover", backgroundPosition: "center"}}></div>
                             <div>
                               <div className="font-weight-bold">{nameVi}</div>
                               <div className="text-muted small"><i className="fas fa-envelope mr-1"></i>{item.email}</div>
                             </div>
                          </li>
                        )
                     }) : <div>Không có dữ liệu</div>}
                   </ul>
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 mb-4">
              <div className="card shadow mb-4 h-100">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary"><i className="fas fa-clock text-info mr-2"></i>Lịch hẹn gần đây nhất</h6>
                </div>
                <div className="card-body">
                   <ul className="list-group list-group-flush">
                     {recentBookings && recentBookings.length > 0 ? recentBookings.map((item, index) => {
                        let time = item.timeTypeDataPatient ? item.timeTypeDataPatient.valueVi : "";
                        return (
                          <li className="list-group-item" key={index}>
                             <div className="d-flex justify-content-between align-items-center">
                               <div className="font-weight-bold">{item.patientData?.firstName} - {time}</div>
                               <span className={`badge badge-pill ${item.statusId === 'S1' ? 'badge-warning' : (item.statusId === 'S2' ? 'badge-primary' : (item.statusId === 'S3' ? 'badge-success' : 'badge-danger'))}`}>
                                 {item.statusData?.valueVi}
                               </span>
                             </div>
                             <div className="text-muted small mt-1">Bác sĩ: {item.doctorData?.lastName} {item.doctorData?.firstName} • {moment(new Date(Number(item.date))).format('DD/MM/YYYY')}</div>
                          </li>
                        )
                     }) : <div>Không có dữ liệu</div>}
                   </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
