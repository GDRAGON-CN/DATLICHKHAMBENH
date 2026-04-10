import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import doctorImg from "../../../assets/outstanding-doctor/bs1.jpg";
import BookingModal from "../Doctor/Modal/BookingModal";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailClinicById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { Link } from "react-router-dom";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctor: [],
      isOpenModal: false,
      bookingTime: "",
      dataDetailClinic: {},
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
      let res = await getDetailClinicById({
        id: id,
      });
      let resProvince = await getAllCodeService("PROVINCE");
      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctor = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctor.push(item.doctorId);
            });
          }
        }
        this.setState({
          dataDetailClinic: res.data,
          arrDoctor: arrDoctor,
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

  render() {
    let { arrDoctor, dataDetailClinic } = this.state;
    console.log("STATE", this.state);
    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div className="detail-specialty-container">
          {/* DESCRIPTION */}
          <div className="specialty-description">
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <>
                <h3>
                  <b>{dataDetailClinic.name}</b>
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataDetailClinic.descriptionHTML,
                  }}
                ></div>
              </>
            )}
          </div>

          {/* DOCTOR LIST */}
          <div className="list-doctor">
            {arrDoctor &&
              arrDoctor.length > 0 &&
              arrDoctor.map((item, index) => {
                return (
                  <div className="each-doctor" key={item.id}>
                    {/* LEFT INFO */}
                    <div className="doctor-info">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDescriptionDoctor={true}
                      />
                    </div>

                    {/* RIGHT SCHEDULE */}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
