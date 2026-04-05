import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllSpecialty } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./AllSpecialty.scss";

class AllSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  render() {
    let { dataSpecialty } = this.state;
    return (
      <div className="all-specialty-container">
        <HomeHeader isShowBanner={false} />
        <div className="all-specialty-content">
          <div className="title">Tất cả chuyên khoa</div>
          <div className="list-specialty">
            {dataSpecialty &&
              dataSpecialty.length > 0 &&
              dataSpecialty.map((item, index) => {
                return (
                  <div
                    className="specialty-child"
                    key={index}
                    onClick={() => this.handleViewDetailSpecialty(item)}
                  >
                    <div
                      className="bg-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="specialty-name">{item.name}</div>
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
  return { language: state.app.language };
};
export default connect(mapStateToProps, null)(AllSpecialty);
