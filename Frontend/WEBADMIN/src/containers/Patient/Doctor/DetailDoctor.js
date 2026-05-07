import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import { toast } from "react-toastify";
import "./DetailDoctor.scss";
import doctorImg from "../../../assets/outstanding-doctor/bs1.jpg";
import BookingModal from "../Doctor/Modal/BookingModal";
import DoctorSchedule from "./DoctorSchedule";
import {
  getDetailInforDoctor,
  getReviewsByDoctorId,
  deleteReviewService,
  createNewReview,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPrice: false,
      isOpenModal: false,
      dataTimeBooking: {},
      dates: [],
      bookingTime: "",
      detailDoctor: {},
      currentDoctorId: -1,
      listReviews: [],
      content: "",
      rating: 5,
    };
  }

  async componentDidMount() {
    let dates = [];
    for (let i = 0; i < 4; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      let formatted = date.getDate() + "/" + (date.getMonth() + 1);
      dates.push(formatted);
    }

    this.setState({
      dates: dates,
      selectedDate: dates[0],
    });
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      let res = await getDetailInforDoctor(id);
      console.log("RES RAW:", res);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }

      let resReview = await getReviewsByDoctorId(id);
      if (resReview && resReview.errCode === 0) {
        this.setState({
          listReviews: resReview.data ? resReview.data : [],
        });
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleBooking = (time) => {
    this.setState({
      isOpenModal: true,
      bookingTime: time,
    });
  };

  closeBookingClose = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  handleDeleteReview = async (reviewId) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      let res = await deleteReviewService(reviewId);
      if (res && res.errCode === 0) {
        toast.success("Xóa đánh giá thành công!");
        this.fetchReviews();
      } else {
        toast.error("Xóa đánh giá thất bại!");
      }
    }
  };

  fetchReviews = async () => {
    let resReview = await getReviewsByDoctorId(this.state.currentDoctorId);
    if (resReview && resReview.errCode === 0) {
      this.setState({
        listReviews: resReview.data ? resReview.data : [],
      });
    }
  };

  handleOnChangeText = (event) => {
    this.setState({ content: event.target.value });
  };

  setRating = (rating) => {
    this.setState({ rating: rating });
  };

  handlePostReview = async () => {
    let { userInfo } = this.props;
    if (!userInfo) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    if (!this.state.content) {
      toast.error("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    let res = await createNewReview({
      doctorId: this.state.currentDoctorId,
      patientId: userInfo.id,
      comment: this.state.content,
      rating: this.state.rating,
      bookingId: null,
    });

    if (res && res.errCode === 0) {
      toast.success("Cảm ơn bạn đã đánh giá bác sĩ!");
      this.setState({ content: "", rating: 5 });
      this.fetchReviews();
    } else {
      toast.error(res.errMessage || "Gửi đánh giá thất bại!");
    }
  };

  render() {
    console.log("Hoi dan It", this.state);

    let { language, userInfo } = this.props;
    let { detailDoctor } = this.state;
    let isAdmin = userInfo && userInfo.roleId === "R1" ? true : false;
    let nameVi = "",
      nameEn = "";
    if (
      detailDoctor &&
      detailDoctor.Doctor_Infor &&
      detailDoctor.Doctor_Infor.positionData
    ) {
      nameVi = `${detailDoctor.Doctor_Infor.positionData.valueVi} ${detailDoctor.lastName} ${detailDoctor.firstName}`;
      nameEn = `${detailDoctor.Doctor_Infor.positionData.valueEn} ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }
    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div className="content-left-wrapper">
              <div
                className="content-left"
                style={{
                  backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ""})`,
                }}
              ></div>
              {detailDoctor && detailDoctor.avgRating && (
                <div className="doctor-rating-summary">
                  <div className="stars">
                    <div className="star-icons">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <i
                          key={item}
                          className={
                            item <= Math.round(detailDoctor.avgRating)
                              ? "fas fa-star star-active"
                              : "far fa-star star-inactive"
                          }
                        ></i>
                      ))}
                    </div>
                    <div className="rating-info">
                      <span className="avg-point">
                        {Number(detailDoctor.avgRating).toFixed(1)}/5
                      </span>
                      <span className="review-count">
                        ({detailDoctor.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="content-right">
              <div className="up">
                {nameVi}
              </div>

              <div className="down">
                {detailDoctor &&
                  detailDoctor.Doctor_Infor &&
                  detailDoctor.Doctor_Infor.description && (
                    <span>{detailDoctor.Doctor_Infor.description}</span>
                  )}
              </div>
            </div>
          </div>

          <DoctorSchedule
            doctorIdFromParent={this.state.currentDoctorId}
            handleBooking={this.handleBooking}
          />
          <div className="detail-info">
            <div className="doctor-section">
              {detailDoctor &&
                detailDoctor.Doctor_Infor &&
                detailDoctor.Doctor_Infor.contentHTML && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detailDoctor.Doctor_Infor.contentHTML,
                    }}
                  ></div>
                )}
            </div>
          </div>

          <div className="doctor-reviews-section">
            <div className="reviews-title">Phản hồi của bệnh nhân</div>
            
            {detailDoctor && detailDoctor.avgRating && (
              <div className="reviews-summary-card">
                <div className="left">
                   <div className="avg-rating">{Number(detailDoctor.avgRating).toFixed(1)}</div>
                   <div className="stars">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <i
                          key={item}
                          className={item <= Math.round(detailDoctor.avgRating) ? "fas fa-star star-active" : "far fa-star star-inactive"}
                        ></i>
                      ))}
                   </div>
                   <div className="total-count">{detailDoctor.reviewCount} đánh giá</div>
                </div>
                <div className="right">
                   <div className="rating-text">Đánh giá chung của bệnh nhân về sự hài lòng sau khi thăm khám.</div>
                </div>
              </div>
            )}

            <div className="review-form">
              <div className="rating-input">
                <span>Đánh giá của bạn: </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={star <= this.state.rating ? "fas fa-star star-active" : "far fa-star"}
                    onClick={() => this.setRating(star)}
                  ></i>
                ))}
              </div>
              <textarea
                className="form-control"
                placeholder="Chia sẻ trải nghiệm hoặc cảm nhận của bạn về bác sĩ..."
                value={this.state.content}
                onChange={this.handleOnChangeText}
              ></textarea>
              <button className="btn-post" onClick={this.handlePostReview}>Gửi đánh giá</button>
            </div>

            <div className="reviews-list">
              {this.state.listReviews && this.state.listReviews.length > 0 ? (
                this.state.listReviews.map((item, index) => {
                  return (
                    <div className="review-item" key={index}>
                      <div className="review-header">
                        <span className="patient-name">
                          {item.patientReviewData.lastName}{" "}
                          {item.patientReviewData.firstName}
                        </span>
                        <div className="review-right">
                          <span className="review-date">
                            {moment(item.createdAt).format("DD/MM/YYYY")}
                          </span>
                          {isAdmin && (
                            <button
                              className="btn-delete-review"
                              onClick={() => this.handleDeleteReview(item.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i
                            key={s}
                            className={
                              s <= item.rating
                                ? "fas fa-star star-active"
                                : "far fa-star star-inactive"
                            }
                          ></i>
                        ))}
                      </div>
                      <div className="review-comment">{item.comment}</div>
                    </div>
                  );
                })
              ) : (
                <div className="no-reviews">Chưa có đánh giá nào cho bác sĩ này.</div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModal={this.state.isOpenModal}
          dataTime={this.state.bookingTime}
          closeBookingClose={() => this.setState({ isOpenModal: false })}
        />
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(DetailDoctor);
