import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./AllClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { getAllClinic } from "../../../services/userService";
import HomeFooter from "../../HomePage/HomeFooter";

class AllClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinic: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinic: res.data ? res.data : [],
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleViewDetailClinic = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${item.id}`);
    }
  };

  render() {
    let { dataClinic } = this.state;
    return (
      <div className="all-clinic-container">
        <HomeHeader isShowBanner={false} />
        <div className="all-clinic-body">
          <div className="all-clinic-header">
            <div className="header-title">Danh Sách Các Khoa</div>
          </div>
          <div className="list-clinic">
            {dataClinic &&
              dataClinic.length > 0 &&
              dataClinic.map((item, index) => {
                return (
                  <div
                    className="clinic-item"
                    key={index}
                    onClick={() => this.handleViewDetailClinic(item)}
                  >
                    <div
                      className="item-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="item-info">
                      <div className="clinic-name">{item.name}</div>
                      <div className="clinic-address">{item.address}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AllClinic);
