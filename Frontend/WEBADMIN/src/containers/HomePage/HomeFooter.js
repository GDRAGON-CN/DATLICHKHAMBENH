import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss"; // Nhớ tạo file SCSS này

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer-container">
        <div className="home-footer-content">
          {/* Cột 1: Thông tin công ty */}
          <div className="footer-left">
            <div className="company-info">
              <b>Công ty Cổ phần Công nghệ BookingCare</b>
              <p>
                <i className="fas fa-map-marker-alt"></i> Lô B4/D21, Khu đô thị
                mới Cầu Giấy, Phường Cầu Giấy, Thành phố Hà Nội
              </p>
              <p>
                <i className="fas fa-check-circle"></i> ĐKKD số: 0106790291. Sở
                KHĐT Hà Nội cấp ngày 16/03/2015
              </p>
              <p>
                <i className="fas fa-phone"></i> 024-7301-2468 (7h30 - 18h)
              </p>
              <p>
                <i className="fas fa-envelope"></i> support@bookingcare.vn
              </p>
            </div>
            <div className="vnpay-logos">
              <div className="logo-item red">ĐÃ ĐĂNG KÝ</div>
              <div className="logo-item red">ĐÃ ĐĂNG KÝ</div>
            </div>
          </div>

          {/* Cột 2: Các liên kết nhanh */}
          <div className="footer-center">
            <div className="footer-logo"></div>
            <ul>
              <li>
                <a href="#">Liên hệ hợp tác</a>
              </li>
              <li>
                <a href="#">Danh sách gói khám</a>
              </li>
              <li>
                <a href="#">Tuyển dụng</a>
              </li>
              <li>
                <a href="#">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Đối tác bảo trợ */}
          <div className="footer-right">
            <b>Đối tác bảo trợ nội dung</b>
            <div className="partner-item">
              <div className="partner-icon hello-doctor"></div>
              <div className="partner-text">
                <b>Hello Doctor</b>
                <span>Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"</span>
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-icon bernard"></div>
              <div className="partner-text">
                <b>Hệ thống y khoa Bernard</b>
                <span>Bảo trợ chuyên mục nội dung "y khoa chuyên sâu"</span>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <div className="home-footer-bottom">
          <p>
            &copy; 2026 BookingCare.{" "}
            <a href="#">More information, please call us</a>
          </p>
          <div className="app-download">
            Tải ứng dụng: <a href="#">Android</a> - <a href="#">iPhone/iPad</a>
          </div>
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
