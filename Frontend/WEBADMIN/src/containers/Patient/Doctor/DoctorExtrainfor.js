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
        <div className="payment-info-section">
          <div className="payment-title">LOẠI HÌNH DỊCH VỤ:</div>
          <div className="service-name">Khám bệnh tại bệnh viện</div>
          <div className="payment-method">
            Hỗ trợ thanh toán:{" "}
            {extraInfor && extraInfor.paymentTypeData
              ? extraInfor.paymentTypeData.valueVi
              : "Tiền mặt / Chuyển khoản"}
          </div>

          {!this.state.isShowPrice && (
            <div className="price-short">
              GIÁ KHÁM:{" "}
              <NumericFormat
                value={
                  extraInfor.priceTypeData ? extraInfor.priceTypeData.valueVi : 0
                }
                displayType={"text"}
                thousandSeparator={true}
                suffix={"VND"}
              />
              <span
                className="see-detail ml-2"
                style={{ color: "#45c3d2", cursor: "pointer" }}
                onClick={() => this.setState({ isShowPrice: true })}
              >
                Xem chi tiết
              </span>
            </div>
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
