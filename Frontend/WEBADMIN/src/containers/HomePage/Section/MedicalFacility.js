import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { withRouter } from "react-router";
import { getTopClinicHome } from "../../../services/userService";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinic: [],
    };
  }

  async componentDidMount() {
    try {
      let res = await getTopClinicHome(10);
      if (res && res.errCode === 0) {
        this.setState({
          dataClinic: res.data ? res.data : [],
        });
      }
    } catch (e) {
      console.log("Error fetching clinics:", e);
    }
  }

  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };

  render() {
    let { dataClinic } = this.state;
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button
              className="btn-section"
              onClick={() => this.props.history.push("/all-clinic")}
            >
              Xem thêm
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataClinic &&
                dataClinic.length > 0 &&
                dataClinic.map((item, index) => {
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base64").toString(
                      "binary",
                    );
                  }
                  return (
                    /* FIX LỖI KEY Ở ĐÂY */
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailClinic(item)}
                    >
                      <div
                        className="bg-image section-medical-facility"
                        style={{ backgroundImage: `url('${imageBase64}')` }}
                      />
                      {/* Thêm class để dễ styling tên phòng khám */}
                      <div className="clinic-name">{item.name}</div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility),
);
