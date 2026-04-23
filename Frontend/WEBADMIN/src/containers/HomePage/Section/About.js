import React, { Component } from "react";
import { connect } from "react-redux";

import Slider from "react-slick";
import vtv from "../../../assets/media/vtv.png";
import dantri from "../../../assets/media/dantri.png";
import vtc from "../../../assets/media/vtc.png";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-container">
          <div className="section-about-header">
            Truyền thông nói về BookingCare
          </div>

          <div className="section-about-content">
            <div className="content-left">
              <iframe
                src="https://www.youtube.com/embed/OASGscJQXp0"
                title="youtube video"
                frameborder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="content-right">
              <div className="media-item">
                <img src={vtv} alt="vtv" />
              </div>

              <div className="media-item">
                <img src={dantri} alt="dantri" />
              </div>
              <div className="media-item">
                <img src={vtc} alt="vtc" />
              </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
