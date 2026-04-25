import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts"; 

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.fetchDataPatient();
  }

  fetchDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    await this.getDataPatient(user, formatedDate);
  };

  getDataPatient = async (user, formatedDate) => {
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({ dataPatient: res.data });
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({ currentDate: date[0] }, () => {
      this.fetchDataPatient();
    });
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      date: item.date,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({ isShowLoading: true });

    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      patientName: dataModal.patientName,
      language: this.props.language,
      date: dataModal.date,
      diagnosis: dataChild.diagnosis,
      prescription: dataChild.prescription,
    });

    if (res && res.errCode === 0) {
      this.setState({ isShowLoading: false, isOpenRemedyModal: false });
      toast.success("Gửi hóa đơn/đơn thuốc thành công!");
      await this.fetchDataPatient();
    } else {
      this.setState({ isShowLoading: false });
      toast.error(res && res.errMessage ? res.errMessage : "Có lỗi xảy ra khi gửi hóa đơn.");
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal, isShowLoading } =
      this.state;
    return (
      <>
        <LoadingOverlay active={isShowLoading} spinner text="Đang xử lý...">
          <div className="manage-patient-container">
            <div className="m-p-title">DANH SÁCH BỆNH NHÂN KHÁM BỆNH</div>

            <div className="manage-patient-body container">
              <div className="row mb-4">
                <div className="col-4 form-group">
                  <label className="fw-bold mb-2">
                    <i className="fas fa-calendar-alt"></i> Chọn ngày khám
                  </label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control date-picker-custom"
                    value={this.state.currentDate}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 table-responsive">
                  <table className="table-manage-patient">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Thời gian</th>
                        <th>Họ và tên</th>
                        <th>Địa chỉ</th>
                        <th>Giới tính</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPatient && dataPatient.length > 0 ? (
                        dataPatient.map((item, index) => {
                          let gender =
                            this.props.language === "vi"
                              ? item?.patientData?.genderData?.valueVi || "Khác"
                              : item?.patientData?.genderData?.valueEn || "Other";
                          let time =
                            this.props.language === "vi"
                              ? item?.timeTypeDataPatient?.valueVi || ""
                              : item?.timeTypeDataPatient?.valueEn || "";
                          return (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{time}</td>
                              <td className="fw-bold">
                                {item.patientData.firstName}
                              </td>
                              <td>{item.patientData.address}</td>
                              <td>{gender}</td>
                              <td className="action-btns">
                                <button
                                  className="btn-confirm"
                                  onClick={() => this.handleBtnConfirm(item)}
                                >
                                  Xác nhận / Gửi hóa đơn
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="no-data"
                            style={{ textAlign: "center" }}
                          >
                            Không có bệnh nhân nào khám trong ngày này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </LoadingOverlay>

        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={this.closeRemedyModal}
          sendRemedy={this.sendRemedy}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  user: state.user.userInfo,
});

export default connect(mapStateToProps)(ManagePatient);
