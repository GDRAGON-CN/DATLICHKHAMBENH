import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import "./ProfileDoctor.scss";
import { getProfileInforDoctorById } from "../../../services/userService";
import _ from "lodash";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }

  async componentDidMount() {
    await this.getInforDoctor(this.props.doctorId);
  }

  getInforDoctor = async (id) => {
    if (id) {
      let res = await getProfileInforDoctorById(id);
      if (res && res.errCode === 0) {
        this.setState({ dataProfile: res.data });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorId !== prevProps.doctorId) {
      await this.getInforDoctor(this.props.doctorId);
    }
  }
  renderTimeBooking = (dataTime) => {
    let { language } = this.props;
    let { dataProfile } = this.state;
    console.log("DATA :", dataProfile);
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment.unix(+dataTime.date / 1000).format("dddd - MM/DD/YYYY");
      return (
        <>
          <div className="doctor-infor-summary">
            <div className="price-ticket">
              Giá khám:
              {dataProfile &&
                dataProfile.Doctor_Infor &&
                language === LANGUAGES.VI && (
                  <NumericFormat
                    value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={" VND"}
                  />
                )}
              {dataProfile &&
                dataProfile.Doctor_Infor &&
                language === LANGUAGES.EN && (
                  <NumericFormat
                    value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={" $"}
                  />
                )}
            </div>
            <div className="time-ticket">
              Giờ khám:{" "}
              <b>
                {time} {date}
              </b>
            </div>
            <div>Miễn phí đặt lịch</div>
          </div>
        </>
      );
    }
  };

  render() {
    let { dataProfile } = this.state;
    let { language, isShowDescriptionDoctor, dataTime } = this.props;
    console.log("DATA TIME:", this.props);

    let nameVi = "",
      nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
    }

    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div className="content-left">
            <div
              className="avatar-img"
              style={{
                backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ""})`,
              }}
            ></div>
          </div>

          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true ? (
                <>
                  {dataProfile &&
                    dataProfile.Doctor_Infor &&
                    dataProfile.Doctor_Infor.description && (
                      <div>
                        <span>{dataProfile.Doctor_Infor.description}</span>
                        <Link to={`/detail-doctor/${dataProfile.id}`}>
                          Xem thêm
                        </Link>
                      </div>
                    )}
                </>
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(ProfileDoctor);
