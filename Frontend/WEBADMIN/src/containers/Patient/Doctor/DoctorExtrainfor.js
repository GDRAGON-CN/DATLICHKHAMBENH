import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorExtrainfor.scss";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { getExtraInforDoctorById } from "../../../services/userService";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom/cjs/react-router-dom";

class DoctorExtrainfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPrice: false,
      extraInfor: {},
    };
  }

  async componentDidMount() {
    // Lấy data ngay khi vừa mount nếu đã có id
    if (this.props.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  render() {
    let { isShowPrice, extraInfor } = this.state;
    console.log("checl state", this.state);
    return (
      <div className="doctor-extra-infor-container">
        <div className="price-title">
          GIÁ TƯ VẤN QUA VIDEO:
          <span className="price"> 200.000đ - 1.000.000đ</span>
          <div className="price-title">
            <div>ĐỊA CHỈ PHÒNG KHÁM</div>
            <div>
              <Link to={`/detail-clinic/${extraInfor.clinicId}`}>
                {extraInfor &&
                extraInfor.clinicData &&
                extraInfor.clinicData.name
                  ? extraInfor.clinicData.name
                  : "Không có thông tin tên phòng khám"}
              </Link>
            </div>
            <div>
              {extraInfor &&
              extraInfor.clinicData &&
              extraInfor.clinicData.address
                ? extraInfor.clinicData.address
                : "Không có thông tin địa chỉ"}
            </div>
          </div>
          {!this.state.isShowPrice && (
            <span
              className="see-detail"
              onClick={() => this.setState({ isShowPrice: true })}
            >
              Xem chi tiết
            </span>
          )}
        </div>

        {this.state.isShowPrice && (
          <div className="price-detail">
            <div className="price-row">
              <span className="left">Giá khám:</span>
              <span className="right">
                <NumericFormat
                  value={
                    extraInfor.priceTypeData
                      ? extraInfor.priceTypeData.valueVi
                      : 0
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"VND"}
                />
              </span>
            </div>

            <div className="note">
              Ghi chú: Giá có thể thay đổi tùy thời điểm
            </div>

            <div
              className="hide-detail"
              onClick={() => this.setState({ isShowPrice: false })}
            >
              Ẩn bảng giá
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrainfor);
