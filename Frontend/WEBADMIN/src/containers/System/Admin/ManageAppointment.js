import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import "./ManageAppointment.scss";
import {
  getAllBookingForAdmin,
  updateBookingStatus,
  getAllDoctors,
} from "../../../services/userService";
import DatePicker from "../../../components/Input/DatePicker";
import CommonTable from "./CommonTable";
import moment from "moment";

class ManageAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listBooking: [],
      currentDate: moment(new Date()).startOf("day").valueOf(),
      isLoading: false,
      searchText: "",
      filterStatus: "ALL",
      filterDoctor: "ALL",
      isAllDays: true, 
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
    this.fetchBookingData();
    this.fetchDoctors();
  }

  fetchDoctors = async () => {
    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({ listDoctors: res.data });
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
    } else {
      toast.error("Cập nhật thất bại!");
    }
  };

  render() {
    let { listBooking } = this.state;

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
            {item.timeTypeDataPatient?.valueVi || ""}
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
            {item.statusData?.valueVi || ""}
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
      <div className="manage-appointment-container">
        <div className="title mb-5">Quản lý lịch hẹn</div>

        <div className="dashboard-content">
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="m-0 font-weight-bold text-primary">Danh sách lịch hẹn</h6>
                    <span className="badge badge-secondary">{filteredData.length} kết quả</span>
                  </div>

                  <div className="filter-panel">
                    <div className="filter-row">
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAppointment);

