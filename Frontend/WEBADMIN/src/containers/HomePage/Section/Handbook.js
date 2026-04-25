import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { withRouter } from "react-router";
import { getTopHandbookHome } from "../../../services/userService";
import "./Handbook.scss";

class Handbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandbook: [],
    };
  }

  async componentDidMount() {
    try {
      let res = await getTopHandbookHome(10);
      if (res && res.errCode === 0) {
        this.setState({
          dataHandbook: res.data ? res.data : [],
        });
      }
    } catch (e) {
      console.log("Error fetching handbooks:", e);
    }
  }

  handleViewDetailHandbook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${handbook.id}`);
    }
  };

  render() {
    let { dataHandbook } = this.state;
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cẩm nang sức khỏe</span>
            <button
              className="btn-section"
              onClick={() => this.props.history.push("/all-handbook")}
            >
              Tất cả bài viết
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataHandbook &&
                dataHandbook.length > 0 &&
                dataHandbook.map((item, index) => {
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailHandbook(item)}
                    >
                      <div className="handbook-card">
                        <div
                          className="bg-image"
                          style={{ backgroundImage: `url('${item.image}')` }}
                        />
                        <div className="handbook-info">
                          <div className="handbook-name">{item.name}</div>
                          <div className="handbook-date">23/04/2026</div>
                        </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Handbook),
);
