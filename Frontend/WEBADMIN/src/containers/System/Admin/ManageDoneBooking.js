import React, { Component } from "react";
import {
  getAllBookingForAdmin,
  updateBookingStatus,
} from "../../../services/userService";
import moment from "moment";
import DatePicker from "../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import "./ManageDoneBooking.scss";

class ManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataBooking: [],
    };
  }

  async componentDidMount() {
    this.getData();
  }

  getData = async () => {
    let res = await getAllBookingForAdmin(this.state.currentDate);
    if (res && res.errCode === 0) this.setState({ dataBooking: res.data });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({ currentDate: date[0].getTime() }, () => this.getData());
  };

  handleBtnChangeStatus = async (item, status) => {
    let res = await updateBookingStatus({ id: item.id, statusId: status });
    if (res && res.errCode === 0) {
      toast.success("Cập nhật trạng thái thành công!");
      this.getData();
    } else {
      toast.error("Cập nhật thất bại!");
    }
  };

  render() {
    let { dataBooking } = this.state;
    return (
      <div className="manage-booking-container">
        <div className="title">Quản lý lịch hẹn hệ thống</div>

        <div className="custom-card">
          <div className="sub-title">Bộ lọc tìm kiếm</div>
          <div className="row booking-filter">
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-calendar-day mr-2"></i>Chọn ngày khám
              </label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                value={this.state.currentDate}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="custom-card table-manage-booking">
          <div className="sub-title">Danh sách lịch hẹn</div>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Thời gian</th>
                <th>Bác sĩ</th>
                <th>Bệnh nhân</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataBooking && dataBooking.length > 0 ? (
                dataBooking.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.timeTypeDataPatient?.valueVi}</td>
                    <td>
                      <strong>
                        {item.doctorData?.lastName} {item.doctorData?.firstName}
                      </strong>
                    </td>
                    <td>{item.patientData?.firstName}</td>
                    <td>
                      <span className={`status-badge ${item.statusId}`}>
                        {item.statusData?.valueVi}
                      </span>
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có dữ liệu cho ngày này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default ManageBooking;
