import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./AllHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllHandbook } from "../../../services/userService";

class AllHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandbook: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandbook();
    if (res && res.errCode === 0) {
      this.setState({
        dataHandbook: res.data ? res.data : [],
      });
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
      <div className="all-handbook-container">
        <HomeHeader />
        <div className="all-handbook-body">
          <div className="title">Tất cả cẩm nang sức khỏe</div>
          <div className="list-handbook">
            {dataHandbook &&
              dataHandbook.length > 0 &&
              dataHandbook.map((item, index) => {
                return (
                  <div
                    className="handbook-item"
                    key={index}
                    onClick={() => this.handleViewDetailHandbook(item)}
                  >
                    <div
                      className="handbook-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="handbook-name">{item.name}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllHandbook);
