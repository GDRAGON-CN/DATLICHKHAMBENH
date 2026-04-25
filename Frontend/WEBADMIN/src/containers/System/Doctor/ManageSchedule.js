import React, { Component } from "react";
import { connect } from "react-redux";
import "../Doctor/ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import FormattedDate from "../../../components/Formating/FormattedDate";
import { fetchAllDoctor } from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from "../../../utils";
import * as actions from "../../../store/actions";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
} from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      listDoctors: [],
      selectedDoctor: {},
      rangeTime: [],
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.fetchAllScheduleTime();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({ listDoctors: dataSelect });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({ rangeTime: data }, async () => {
        await this.getExistingSchedule(); 
      });
    }

    let { userInfo, language } = this.props;
    if (userInfo && userInfo.roleId === "R2") {
      if (this.state.selectedDoctor.value !== userInfo.id) {
        let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
        let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;

        this.setState(
          {
            selectedDoctor: {
              label: language === LANGUAGES.VI ? labelVi : labelEn,
              value: userInfo.id,
            },
          },
          async () => {
            await this.getExistingSchedule();
          },
        );
      }
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  handleEditorChange({ html, text }) {
    console.log("handleEditorChange", html, text);
  }

  getExistingSchedule = async () => {
    let { selectedDoctor, currentDate, rangeTime } = this.state;
    if (selectedDoctor && !_.isEmpty(selectedDoctor) && currentDate) {
      let formattedDate = new Date(currentDate).getTime();

      let res = await getScheduleDoctorByDate(
        selectedDoctor.value,
        formattedDate,
      );

      if (res && res.errCode === 0) {
        let listSavedSchedule = res.data; 
        let copyRangeTime = [...rangeTime];

        if (copyRangeTime && copyRangeTime.length > 0) {

          copyRangeTime = copyRangeTime.map((item) => ({
            ...item,
            isSelected: false,
          }));

          if (listSavedSchedule && listSavedSchedule.length > 0) {
            copyRangeTime = copyRangeTime.map((item) => {
              let isMatch = listSavedSchedule.find(
                (saved) => saved.timeType === item.keyMap,
              );
              if (isMatch) item.isSelected = true;
              return item;
            });
          }

          this.setState({
            rangeTime: copyRangeTime,
          });
        }
      }
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getExistingSchedule();
      },
    );
  };

  handleChange = async (selectedOption) => {
    this.setState(
      {
        selectedDoctor: selectedOption,
      },
      async () => {
        await this.getExistingSchedule();
      },
    );
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;

    rangeTime = rangeTime.map((item) => {
      if (item.id === time.id) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });

    this.setState({
      rangeTime: rangeTime,
    });
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];
    if (!currentDate) {
      toast.error("Invalid date!");
    }
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor!");
    }
    let formattedDate = new Date(currentDate).getTime();
    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule, index) => {
          console.log("check schedule", schedule, index, selectedDoctor);
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formattedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formattedDate: formattedDate,
    });
    if (res && res.errCode === 0) {
      toast.success("Save schedule succeed!");
    } else {
      toast.error("Error save schedule!");
    }
  };
  render() {
    let { rangeTime } = this.state;
    let { language } = this.props;
    let { userInfo } = this.props;
    let isDoctor = userInfo && userInfo.roleId === "R2";
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row section-selection">
            <div className="col-6 form-group">
              <label>
                <i className="fas fa-user-md"></i> chọn bác sĩ
              </label>
              <Select
                value={this.state.selectedDoctor}
                onChange={this.handleChange}
                options={this.state.listDoctors}
                isDisabled={isDoctor}
                placeholder="chọn bác sĩ" 
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <i className="fas fa-calendar-day"></i> Chọn ngày
              </label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={new Date().setHours(0, 0, 0, 0)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 pick-hour-container">
              <label className="mb-3">Chọn khung giờ khám:</label>
              <div className="list-time">
                {rangeTime &&
                  rangeTime.length > 0 &&
                  rangeTime.map((item, index) => {
                    return (
                      <button
                        key={index}
                        className={
                          item.isSelected ? "btn-time active" : "btn-time"
                        }
                        onClick={() => this.handleClickBtnTime(item)}
                      >
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="col-12">
              <button
                className="btn btn-warning btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <i className="fas fa-save"></i> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
