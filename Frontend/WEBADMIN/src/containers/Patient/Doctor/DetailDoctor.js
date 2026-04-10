import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import doctorImg from "../../../assets/outstanding-doctor/bs1.jpg";
import BookingModal from "../Doctor/Modal/BookingModal";
import DoctorSchedule from "./DoctorSchedule";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import Header from "../../Header/Header";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPrice: false,
      isOpenModal: false,
      dataTimeBooking: {},
      dates: [],
      bookingTime: "",
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }

  async componentDidMount() {
    let dates = [];
    for (let i = 0; i < 4; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      let formatted = date.getDate() + "/" + (date.getMonth() + 1);
      dates.push(formatted);
    }

    this.setState({
      dates: dates,
      selectedDate: dates[0],
    });
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      let res = await getDetailInforDoctor(id);
      console.log("RES RAW:", res);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }
      //  imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleBooking = (time) => {
    this.setState({
      isOpenModal: true,
      bookingTime: time,
    });
  };

  closeBookingClose = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  render() {
    console.log("Hoi dan It", this.state);
    let { language } = this.props;
    let { detailDoctor } = this.state;
    let nameVi = "",
      nameEn = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi} ${detailDoctor.lastName} ${detailDoctor.firstName}`;
      nameEn = `${detailDoctor.positionData.valueEn} ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }
    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div className="doctor-detail-container">
          {/* INTRO DOCTOR */}
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ""})`,
              }}
            ></div>

            <div className="content-right">
              <div className="up">
                {/* {language === LANGUAGES.VI ? nameVi : nameEn} */}
                {nameVi}
              </div>

              <div className="down">
                {detailDoctor &&
                  detailDoctor.Markdown &&
                  detailDoctor.Markdown.descriptions && (
                    <span>{detailDoctor.Markdown.descriptions}</span>
                  )}
              </div>
            </div>
          </div>

          {/* SCHEDULE */}
          <DoctorSchedule
            doctorIdFromParent={this.state.currentDoctorId}
            handleBooking={this.handleBooking}
          />

          {/* DETAIL INFO */}
          <div className="detail-info">
            <div className="doctor-section">
              {detailDoctor &&
                detailDoctor.Markdown &&
                detailDoctor.Markdown.contentHTML && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detailDoctor.Markdown.contentHTML,
                    }}
                  ></div>
                )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModal={this.state.isOpenModal}
          dataTime={this.state.bookingTime}
          closeBookingClose={() => this.setState({ isOpenModal: false })}
        />
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

export default connect(mapStateToProps)(DetailDoctor);
