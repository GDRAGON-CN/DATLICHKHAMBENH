import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorSchedule.scss";
import { LANGUAGES } from "../../../utils";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDate } from "../../../services/userService";
import moment from "moment";
import DoctorExtrainfor from "./DoctorExtrainfor";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      arrSchedule: [],
      allDays: [],
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    // this.getArrDays(language);
    // if (doctorIdFromParent) {
    //   let today = moment(new Date()).startOf("day").valueOf();
    //   let res = await getScheduleDoctorByDate(
    //     doctorIdFromParent,
    //     today,
    //   );
    //   if (res && res.errCode === 0) {
    //     this.setState({
    //       arrSchedule: res.data,
    //       selectedDate: today,
    //     });
    //   }
    // }
    let allDays = this.getArrDays(language);
    // if (allDays && allDays.length > 0) {
    //   let res = await getScheduleDoctorByDate(
    //     this.props.doctorIdFromParent,
    //     allDays[0].value,
    //   );
    this.setState({
      allDays: allDays,
    });
  }
  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("vi")
          .format("dddd - DD/MM");
      } else {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("en")
          .format("ddd - MM/DD");
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();

      allDays.push(object);
    }
    return allDays;
  };

  handleBooking = (time) => {
    if (this.props.handleBooking) {
      this.props.handleBooking(time);
    }
  };
  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
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
      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays(this.props.language);
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value,
      );
      this.setState({
        arrSchedule: res.data ? res.data : [],
      });
    }
  }
  render() {
    let { allDays, arrSchedule } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="schedule-doctor">
          <div className="schedule-left">
            <select
              className="schedule-date"
              value={this.state.selectedDate}
              onChange={(event) => this.handleOnChangeSelect(event)}
            >
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>

            <div className="schedule-title">
              <i className=""> LỊCH TƯ VẤN </i>
            </div>

            <div className="schedule-time">
              {arrSchedule && arrSchedule.length > 0 ? (
                arrSchedule.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className="time-btn"
                      onClick={() => this.handleBooking(item)}
                    >
                      {language === LANGUAGES.VI
                        ? item.timeTypeData?.valueVi
                        : item.timeTypeData?.valueEn}
                    </button>
                  );
                })
              ) : (
                <div>Không có thời gian trống,vui lòng chọn ngày khác</div>
              )}
            </div>

            <div className="schedule-note">Chọn và đặt (miễn phí)</div>
          </div>

          {/* PRICE */}
          <div className="schedule-right">
            <DoctorExtrainfor
              doctorIdFromParent={this.props.doctorIdFromParent}
            />
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
