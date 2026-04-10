import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorSchedule.scss";
import { LANGUAGES } from "../../../utils";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDate } from "../../../services/userService";
import moment from "moment";
import DoctorExtrainfor from "./DoctorExtrainfor";
import { toast } from "react-toastify";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrSchedule: [],
      allDays: [],
      selectedDate: "", // Thêm khởi tạo này
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrDays(language);

    if (allDays && allDays.length > 0) {
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value,
      );
      this.setState({
        allDays: allDays,
        selectedDate: allDays[0].value,
        arrSchedule: res && res.errCode === 0 ? res.data : [],
      });
    }
  }

  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      let baseDate = moment(new Date()).add(i, "days");
      if (language === LANGUAGES.VI) {
        object.label = baseDate.locale("vi").format("dddd - DD/MM");
      } else {
        object.label = baseDate.locale("en").format("ddd - MM/DD");
      }
      object.value = baseDate.startOf("day").valueOf();
      allDays.push(object);
    }
    return allDays;
  };

  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value; // Đây là string

      this.setState({
        selectedDate: Number(date),
      });

      let res = await getScheduleDoctorByDate(doctorId, date);
      if (res && res.errCode === 0) {
        this.setState({
          arrSchedule: res.data ? res.data : [],
        });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({ allDays: allDays });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays(this.props.language);
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value,
      );
      this.setState({
        selectedDate: allDays[0].value,
        arrSchedule: res.data ? res.data : [],
      });
    }
  }

  handleBooking = (item) => {
    if (item.currentNumber >= item.maxNumber) {
      toast.error(
        this.props.language === "vi"
          ? "Rất tiếc, khung giờ này đã đủ số lượng bệnh nhân!"
          : "Sorry, this time slot is full!",
      );
      return;
    }

    if (this.props.handleBooking) {
      this.props.handleBooking(item);
    }
  };

  render() {
    let { allDays, arrSchedule, selectedDate } = this.state;
    let { language } = this.props;

    let todayTimestamp = moment().startOf("day").valueOf();

    let currentSelected = selectedDate
      ? Number(selectedDate)
      : allDays.length > 0
        ? allDays[0].value
        : null;

    let filteredSchedule = [];

    if (arrSchedule && arrSchedule.length > 0) {
      if (currentSelected === todayTimestamp) {
        let currentTimePlus4h = moment().add(1, "hours");

        filteredSchedule = arrSchedule.filter((item) => {
          let timeString = item.timeTypeData?.valueVi.split(" - ")[0];
          if (!timeString) return false;

          let scheduleMoment = moment(
            moment().format("YYYY-MM-DD") + " " + timeString,
            "YYYY-MM-DD HH:mm",
          );

          return scheduleMoment.isAfter(currentTimePlus4h);
        });
      } else {
        filteredSchedule = arrSchedule;
      }
    }
    console.log("Check item 0:", filteredSchedule[0]);
    return (
      <div className="schedule-doctor">
        <div className="schedule-left">
          <select
            className="schedule-date"
            value={this.state.selectedDate}
            onChange={(event) => this.handleOnChangeSelect(event)}
          >
            {allDays &&
              allDays.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>

          <div className="schedule-title">
            <i className="fas fa-calendar-alt"> LỊCH TƯ VẤN </i>
          </div>

          <div className="schedule-time">
            {filteredSchedule && filteredSchedule.length > 0 ? (
              filteredSchedule.map((item, index) => (
                <button
                  key={index}
                  className={
                    item.currentNumber >= item.maxNumber
                      ? "time-btn full"
                      : "time-btn"
                  }
                  onClick={() => this.handleBooking(item)}
                >
                  {language === LANGUAGES.VI
                    ? item.timeTypeData?.valueVi
                    : item.timeTypeData?.valueEn}
                </button>
              ))
            ) : (
              <div className="no-schedule">
                Không có thời gian trống trong khung giờ cho phép, vui lòng chọn
                ngày khác.
              </div>
            )}
          </div>
          <div className="schedule-note">Chọn và đặt (miễn phí)</div>
        </div>

        <div className="schedule-right">
          <DoctorExtrainfor
            doctorIdFromParent={this.props.doctorIdFromParent}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ language: state.app.language });
export default connect(mapStateToProps)(DoctorSchedule);
