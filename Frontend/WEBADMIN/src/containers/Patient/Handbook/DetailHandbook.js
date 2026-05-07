import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getDetailHandbookById, postCommentHandbookService, getCommentHandbookService } from "../../../services/userService";
import _ from "lodash";
import { toast } from "react-toastify";
import moment from "moment";

class DetailHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetailHandbook: {},
      listComment: [],
      content: "",
      rating: 5,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailHandbookById({
        id: id,
      });

      if (res && res.errCode === 0) {
        this.setState({
          dataDetailHandbook: res.data,
        });
        this.fetchComments(id);
      }
    }
  }

  fetchComments = async (handbookId) => {
    let res = await getCommentHandbookService(handbookId);
    if (res && res.errCode === 0) {
      this.setState({
        listComment: res.data ? res.data : [],
      });
    }
  };

  handleOnChangeText = (event) => {
    this.setState({ content: event.target.value });
  };

  setRating = (rating) => {
    this.setState({ rating: rating });
  };

  handlePostComment = async () => {
    let { userInfo } = this.props;
    if (!userInfo) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!this.state.content) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    let res = await postCommentHandbookService({
      handbookId: this.props.match.params.id,
      userId: userInfo.id,
      content: this.state.content,
      rating: this.state.rating,
    });

    if (res && res.errCode === 0) {
      toast.success("Gửi bình luận thành công!");
      this.setState({ content: "", rating: 5 });
      this.fetchComments(this.props.match.params.id);
    } else {
      toast.error("Gửi bình luận thất bại!");
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let { dataDetailHandbook } = this.state;
    return (
      <div className="detail-handbook-container">
        <HomeHeader />
        <div className="detail-handbook-body">
          <div className="handbook-header">
            <h1 className="title">{dataDetailHandbook.name}</h1>
            <div className="meta">
              <span className="author">BookingCare</span>
              <span className="date">
                {dataDetailHandbook && dataDetailHandbook.createdAt 
                  ? moment(dataDetailHandbook.createdAt).format("DD/MM/YYYY") 
                  : ""}
              </span>
            </div>
          </div>
          <div className="handbook-content-container">
            {dataDetailHandbook && dataDetailHandbook.image && (
              <div className="handbook-cover-image">
                <img
                  src={dataDetailHandbook.image}
                  alt={dataDetailHandbook.name || "Handbook Cover"}
                />
              </div>
            )}
            {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) && (
              <div
                className="handbook-content"
                dangerouslySetInnerHTML={{
                  __html: dataDetailHandbook.descriptionHTML,
                }}
              ></div>
            )}
          </div>

          <div className="handbook-comments-section">
            <h3 className="section-title">Bình luận & Đánh giá</h3>

            {dataDetailHandbook && dataDetailHandbook.avgRating && (
              <div className="reviews-summary-card">
                <div className="left">
                   <div className="avg-rating">{Number(dataDetailHandbook.avgRating).toFixed(1)}</div>
                   <div className="stars">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <i
                          key={item}
                          className={item <= Math.round(dataDetailHandbook.avgRating) ? "fas fa-star active" : "far fa-star inactive"}
                        ></i>
                      ))}
                   </div>
                   <div className="total-count">{dataDetailHandbook.reviewCount} đánh giá</div>
                </div>
                <div className="right">
                   <div className="rating-text">Đây là phản hồi thực tế từ độc giả về tính hữu ích của bài viết này.</div>
                </div>
              </div>
            )}
            
            <div className="comment-form">
              <div className="rating-input">
                <span>Đánh giá của bạn: </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={star <= this.state.rating ? "fas fa-star active" : "far fa-star"}
                    onClick={() => this.setRating(star)}
                  ></i>
                ))}
              </div>
              <textarea
                className="form-control"
                placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
                value={this.state.content}
                onChange={this.handleOnChangeText}
              ></textarea>
              <button className="btn-post" onClick={this.handlePostComment}>Gửi bình luận</button>
            </div>

            <div className="comment-list">
              {this.state.listComment && this.state.listComment.length > 0 ? (
                this.state.listComment.map((item, index) => (
                  <div className="comment-item" key={index}>
                    <div className="comment-avatar" style={{ backgroundImage: `url(${item.userData?.image || ""})` }}></div>
                    <div className="comment-main">
                      <div className="comment-header">
                        <span className="name">{item.userData?.lastName} {item.userData?.firstName}</span>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={star <= item.rating ? "fas fa-star active" : "far fa-star"}></i>
                          ))}
                        </div>
                      </div>
                      <div className="content">{item.content}</div>
                      <div className="time">{moment(item.createdAt).fromNow()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-comment">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
              )}
            </div>
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
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
