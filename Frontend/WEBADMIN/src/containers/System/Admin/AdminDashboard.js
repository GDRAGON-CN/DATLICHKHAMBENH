import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "./AdminDashboard.scss";
import {
  getDashboardStats,
  getAllBookingForAdmin,
  updateBookingStatus,
  getAllDoctors,
} from "../../../services/userService";
import DatePicker from "../../../components/Input/DatePicker";
import CommonTable from "./CommonTable";
import moment from "moment";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCount: {},
      listBooking: [],
      currentDate: moment(new Date()).startOf("day").valueOf(),
      isLoading: false,
      searchText: "",
      filterStatus: "ALL",
      filterDoctor: "ALL",
      isAllDays: true, // Mặc định xem tất cả ngày, các bộ lọc hoạt động độc lập
      listDoctors: [],
    };
  }

  handleSearchChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleFilterStatusChange = (event) => {
    this.setState({ filterStatus: event.target.value });
  };

  handleFilterDoctorChange = (event) => {
    this.setState({ filterDoctor: event.target.value });
  };

  toggleAllDays = () => {
    this.setState({ isAllDays: !this.state.isAllDays }, () => {
      this.fetchBookingData();
    });
  };

  async componentDidMount() {
    this.fetchDashboardData();
    this.fetchBookingData();
    this.fetchDoctors();
  }

  fetchDoctors = async () => {
    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({ listDoctors: res.data });
    }
  };

  fetchDashboardData = async () => {
    try {
      let res = await getDashboardStats();
      if (res && res.errCode === 0) {
        this.setState({ statusCount: res.data.statusCount });
      }
    } catch (e) {
      console.log(e);
    }
  };

  fetchBookingData = async () => {
    let dateParam = this.state.isAllDays ? "ALL" : this.state.currentDate;
    let res = await getAllBookingForAdmin(dateParam);
    if (res && res.errCode === 0) {
      this.setState({ listBooking: res.data ? res.data : [] });
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({ currentDate: date[0].getTime() }, () => {
      this.fetchBookingData();
    });
  };

  handleBtnChangeStatus = async (item, status) => {
    let res = await updateBookingStatus({ id: item.id, statusId: status });
    if (res && res.errCode === 0) {
      toast.success("Cập nhật trạng thái thành công!");
      this.fetchBookingData();
      this.fetchDashboardData();
    } else {
      toast.error("Cập nhật thất bại!");
    }
  };

  render() {
    let { statusCount, listBooking } = this.state;

    const columns = [
      {
        label: "Ngày khám",
        render: (item) => (
          <div className="small font-weight-bold">
            {moment(Number(item.date)).format("DD/MM/YYYY")}
          </div>
        ),
      },
      {
        label: "Thời gian",
        render: (item) => (
          <span className="badge badge-info">
            {this.props.language === "vi"
              ? item.timeTypeDataPatient?.valueVi || ""
              : item.timeTypeDataPatient?.valueEn || ""}
          </span>
        ),
      },
      {
        label: "Bác sĩ",
        render: (item) => (
          <div className="font-weight-bold">
            {item.doctorData?.lastName || ""} {item.doctorData?.firstName || ""}
          </div>
        ),
      },
      {
        label: "Bệnh nhân",
        render: (item) => (
          <div>
            <div className="font-weight-bold text-primary">
              {item.patientData?.lastName} {item.patientData?.firstName}
            </div>
            <div className="small text-muted">{item.patientData?.email || ""}</div>
          </div>
        ),
      },
      {
        label: "Trạng thái",
        render: (item) => (
          <span className={`status-badge ${item.statusId}`}>
            {this.props.language === "vi"
              ? item.statusData?.valueVi || ""
              : item.statusData?.valueEn || ""}
          </span>
        ),
      },
      {
        label: "Hành động",
        render: (item) => (
          <div className="d-flex gap-2">
            <button
              className="btn-action confirm"
              title="Xác nhận"
              onClick={() => this.handleBtnChangeStatus(item, "S2")}
            >
              <i className="fas fa-check"></i>
            </button>
            <button
              className="btn-action done"
              title="Hoàn thành"
              onClick={() => this.handleBtnChangeStatus(item, "S3")}
            >
              <i className="fas fa-user-check"></i>
            </button>
            <button
              className="btn-action cancel"
              title="Hủy lịch"
              onClick={() => this.handleBtnChangeStatus(item, "S4")}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ),
      },
    ];

    let filteredData = listBooking.filter((item) => {
      let search = this.state.searchText.toLowerCase();
      let pName = `${item.patientData?.lastName || ""} ${item.patientData?.firstName || ""}`.toLowerCase();
      let email = (item.patientData?.email || "").toLowerCase();
      let status = this.state.filterStatus;
      let doctorId = this.state.filterDoctor;

      let matchesSearch = !search || pName.includes(search) || email.includes(search);
      let matchesStatus = status === "ALL" || item.statusId === status;
      let matchesDoctor = doctorId === "ALL" || String(item.doctorId) === String(doctorId);

      return matchesSearch && matchesStatus && matchesDoctor;
    });

    return (
      <div className="admin-dashboard-container">
        <div className="title mb-5">Dashboard Thống Kê Tổng Quan</div>

        <div className="dashboard-content">
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

          {/* ─── Bảng lịch hẹn + Bộ lọc ─────────────── */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách lịch hẹn</h6>
                    <span className="badge badge-secondary">{filteredData.length} kết quả</span>
                  </div>

                  {/* Bộ lọc riêng rẽ từng dòng */}
                  <div className="filter-panel">
                    <div className="filter-row">
                      {/* Tìm kiếm tên/email */}
                      <div className="filter-item">
                        <label className="filter-label">
                          <i className="fas fa-search mr-1"></i> Tìm kiếm
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Tên bệnh nhân, email..."
                          value={this.state.searchText}
                          onChange={this.handleSearchChange}
                        />
                      </div>

                      {/* Lọc theo trạng thái */}
                      <div className="filter-item">
                        <label className="filter-label">
                          <i className="fas fa-filter mr-1"></i> Trạng thái
                        </label>
                        <select
                          className="form-control form-control-sm"
                          value={this.state.filterStatus}
                          onChange={this.handleFilterStatusChange}
                        >
                          <option value="ALL">Mọi trạng thái</option>
                          <option value="S1">🟡 Lịch mới</option>
                          <option value="S2">🔵 Đã xác nhận</option>
                          <option value="S3">🟢 Hoàn thành</option>
                          <option value="S4">🔴 Đã hủy</option>
                        </select>
                      </div>

                      {/* Lọc theo bác sĩ */}
                      <div className="filter-item">
                        <label className="filter-label">
                          <i className="fas fa-user-md mr-1"></i> Bác sĩ
                        </label>
                        <select
                          className="form-control form-control-sm"
                          value={this.state.filterDoctor}
                          onChange={this.handleFilterDoctorChange}
                        >
                          <option value="ALL">Tất cả bác sĩ</option>
                          {this.state.listDoctors.map((doc, idx) => (
                            <option key={idx} value={doc.id}>
                              {doc.lastName} {doc.firstName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lọc theo ngày */}
                      <div className="filter-item">
                        <label className="filter-label">
                          <i className="fas fa-calendar-alt mr-1"></i> Ngày khám
                        </label>
                        <div className="d-flex align-items-center gap-2">
                          <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className="form-control form-control-sm"
                            value={this.state.currentDate}
                            disabled={this.state.isAllDays}
                          />
                          <div className="custom-control custom-switch ml-2" style={{ minWidth: "120px" }}>
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="allDaysSwitch"
                              checked={this.state.isAllDays}
                              onChange={this.toggleAllDays}
                            />
                            <label className="custom-control-label small" htmlFor="allDaysSwitch">
                              Tất cả ngày
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <CommonTable
                    data={filteredData}
                    columns={columns}
                    itemsPerPage={10}
                  />
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
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
