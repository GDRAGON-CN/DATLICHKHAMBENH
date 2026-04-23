import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import doctorImg from "../../../assets/outstanding-doctor/bs1.jpg";
import BookingModal from "../Doctor/Modal/BookingModal";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailSpecialtyById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { Link } from "react-router-dom";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctor: [],
      isOpenModal: false,
      bookingTime: "",
      dataDetailSpecialty: {},
      listProvince: [],
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailSpecialtyById({
        id: id,
        location: "ALL",
      });
      let resProvince = await getAllCodeService("PROVINCE");
      if (
        res &&
        res.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0
      ) {
        let data = res.data;
        let arrDoctor = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctor.push(item.doctorId);
            });
          }
        }
        this.setState({
          dataDetailSpecialty: res.data,
          arrDoctor: arrDoctor,
          listProvince: resProvince.data,
        });
      }
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  handleBooking = (time) => {
    console.log(">>> Check data từ con gửi lên: ", time);
    this.setState({
      isOpenModal: true,
      bookingTime: time,
    });
  };
  handleOnChangeSelect = async (event) => {
    let location = event.target.value;

    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;

      let res = await getDetailSpecialtyById({
        id: id,
        location: location,
      });

      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctor = [];

        if (data && data.doctorSpecialty && data.doctorSpecialty.length > 0) {
          data.doctorSpecialty.map((item) => {
            arrDoctor.push(item.doctorId);
          });
        }

        this.setState({
          arrDoctor: arrDoctor,
        });
      }
    }
  };
  render() {
    let { arrDoctor, dataDetailSpecialty, listProvince } = this.state;
    console.log("STATE", this.state);
    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div className="detail-specialty-container">
          <div className="specialty-description">
            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailSpecialty.descriptionHTML,
                }}
              ></div>
            )}
          </div>
          <div className="search-doctor">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              <option value="ALL">Toàn quốc</option>
              {listProvince &&
                listProvince.length > 0 &&
                listProvince.map((item, index) => {
                  return (
                    <option key={index} value={item.keyMap}>
                      {item.valueVI}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="list-doctor">
            {arrDoctor &&
              arrDoctor.length > 0 &&
              arrDoctor.map((item, index) => {
                return (
                  <div className="each-doctor" key={item.id}>
                    <div className="doctor-info">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDescriptionDoctor={true}
                      />
                    </div>
                    <div className="doctor-schedule">
                      <DoctorSchedule
                        doctorIdFromParent={item}
                        handleBooking={this.handleBooking}
                      />
                    </div>
                  </div>
                );
              })}
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
