import React, { Component } from "react";
import { connect } from "react-redux";

import Slider from "react-slick";
import { withRouter } from "react-router";
import "./Specialty.scss";

import { getTopSpecialtyHome } from "../../../services/userService";
import { isTemplateMiddle } from "typescript";
class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }
  async componentDidMount() {
    let res = await getTopSpecialtyHome(10);
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailSpecialty = (specialty) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
  };
  render() {
    let { dataSpecialty } = this.state;
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Chuyên khoa phổ biến</span>
            <button
              className="btn-section"
              onClick={() => this.props.history.push("/all-specialty")}
            >
              Xem thêm
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataSpecialty &&
                dataSpecialty.length > 0 &&
                dataSpecialty.map((item, index) => {
                  return (
                    <div className="section-customize" key={index}>
                      <div className="image-wrapper">
                        <div
                          className="bg-image section-specialty"
                          style={{
                            backgroundImage: `url(${item.image})`,
                          }}
                          onClick={() => this.handleViewDetailSpecialty(item)}
                        />
                      </div>
                      <div className="specialty-name">{item.name}</div>
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
  connect(mapStateToProps, mapDispatchToProps)(Specialty),
);
