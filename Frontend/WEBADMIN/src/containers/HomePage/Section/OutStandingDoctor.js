import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import specialtyImg from "../../../assets/specialty/ck4.jpg";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  componentDidMount() {
    this.props.loadTopDoctors();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }
  }
  handleViewDetailDoctor = (doctor) => {
    console.log("Information", doctor);
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };
  render() {
    let arrDoctors = this.state.arrDoctors;
    console.log("check arr doctor", arrDoctors);
    let { language } = this.props;
    arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.out-standing-doctor" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.props.history.push("/all-doctor")}
            >
              <FormattedMessage id="homepage.more-information" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base64").toString(
                      "binary",
                    );
                  }
                  let nameVi = `${item.positionData.valueVi},${item.lastName} ${item.firstName}`;
                  let nameEn = `${item.positionData.valueEn},${item.lastName} ${item.firstName}`;
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="outer-bg">
                        <div
                          className="bg-image section-outstanding-doctor"
                          style={{
                            backgroundImage: `url(${imageBase64})`,
                          }}
                        />
                      </div>
                      <div className="position text-center">
                        <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div>Cơ xương khớp</div>
                      </div>
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
    topDoctorsRedux: state.admin.topDoctors,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor),
);
