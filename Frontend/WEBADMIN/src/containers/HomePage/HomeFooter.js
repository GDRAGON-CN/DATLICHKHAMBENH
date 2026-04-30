import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer-container">
        <div className="home-footer-content">
          <div className="footer-left">
            <div className="company-info">
              <div className="hospital-logo"></div>
              <b>HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH</b>
              <p>
                <i className="fas fa-map-marker-alt"></i> 123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh
              </p>
              <p>
                <i className="fas fa-phone"></i> Hotline đặt lịch: 1900-xxxx (8h00 - 20h00)
              </p>
              <p>
                <i className="fas fa-envelope"></i> contact@hospital.vn
              </p>
            </div>
          </div>

          <div className="footer-center">
            <b>DỊCH VỤ Y TẾ</b>
            <ul>
              <li><a href="/all-specialty">Khám Chuyên khoa</a></li>
              <li><a href="/all-doctor">Khám Bác sĩ giỏi</a></li>
              <li><a href="/all-handbook">Cẩm nang sức khỏe</a></li>
            </ul>
          </div>

          <div className="footer-right">
            <b>KẾT NỐI VỚI CHÚNG TÔI</b>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-square"></i> Facebook</a>
              <a href="#"><i className="fab fa-youtube"></i> Youtube</a>
              <a href="#"><i className="fab fa-twitter"></i> Twitter</a>
            </div>
            <div className="app-download mt-3">
              <b>TẢI ỨNG DỤNG</b>
              <div className="btn-app mt-2">
                <button className="btn-store"><i className="fab fa-apple"></i> App Store</button>
                <button className="btn-store"><i className="fab fa-google-play"></i> Google Play</button>
              </div>
            </div>
          </div>
        </div>

        <div className="home-footer-bottom">
          <p>&copy; 2026 Smart Hospital Management System. All rights reserved.</p>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
