import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./RemedyModal.scss";
import { CommonUtils } from "../../../utils";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
      diagnosis: "",
      prescription: "",
    };
  }

  componentDidMount() {
    if (this.props.dataModal) {
      this.setState({ email: this.props.dataModal.email });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email || "",
        imgBase64: "",
        diagnosis: "",
        prescription: "",
      });
    }
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({ imgBase64: base64 });
    }
  };

  handleSendRemedy = () => {
    if (!this.state.imgBase64 || !this.state.diagnosis) {
      alert("Vui lòng nhập chẩn đoán và chọn ảnh hóa đơn!");
      return;
    }
    this.props.sendRemedy(this.state);
  };

  render() {
    let { isOpenModal, closeRemedyModal } = this.props;
    return (
      <Modal
        isOpen={isOpenModal}
        size="lg"
        centered
        className={"remedy-modal-container"}
      >
        <ModalHeader toggle={closeRemedyModal}>
          Gửi hóa đơn & Kết quả khám bệnh
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Email bệnh nhân</label>
              <input
                className="form-control"
                type="email"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="col-6 form-group">
              <label>Chọn file đơn thuốc/hóa đơn</label>
              <input
                className="form-control-file"
                type="file"
                onChange={(e) => this.handleOnChangeImage(e)}
              />
            </div>
            <div className="col-12 form-group">
              <label>Chẩn đoán bệnh</label>
              <textarea
                className="form-control"
                rows="3"
                value={this.state.diagnosis}
                onChange={(e) => this.setState({ diagnosis: e.target.value })}
                placeholder="Nhập chẩn đoán bệnh..."
              ></textarea>
            </div>
            <div className="col-12 form-group">
              <label>Đơn thuốc (Nếu có)</label>
              <textarea
                className="form-control"
                rows="3"
                value={this.state.prescription}
                onChange={(e) => this.setState({ prescription: e.target.value })}
                placeholder="Nhập thông tin đơn thuốc..."
              ></textarea>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.handleSendRemedy()}>
            Gửi (Send)
          </Button>
          <Button color="secondary" onClick={closeRemedyModal}>
            Hủy (Cancel)
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default connect(null)(RemedyModal);
