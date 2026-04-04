import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import { createNewSpecialty } from "../../../services/userService";
import { toast } from "react-toastify";
import {
  createClinic,
  getAllClinic,
  deleteClinicService,
  updateClinicData,
} from "../../../services/userService";
const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listClinics: [],
      action: "CREATE",
      clinicId: "",
    };
  }
  async componentDidMount() {
    await this.fetchClinics();
  }
  fetchClinics = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        listClinics: res.data ? res.data : [],
      });
    }
  };
  handleEditClinic = (item) => {
    this.setState({
      name: item.name,
      address: item.address,
      descriptionHTML: item.descriptionHTML,
      descriptionMarkdown: item.descriptionMarkdown,
      imageBase64: item.image, // Lưu ý: Backend cần trả về ảnh dạng base64
      action: "EDIT",
      clinicId: item.id,
    });
  };
  handleDeleteClinic = async (item) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng khám này?")) {
      let res = await deleteClinicService(item.id);
      if (res && res.errCode === 0) {
        toast.success("Xóa phòng khám thành công!");
        await this.fetchClinics();
      } else {
        toast.error("Lỗi khi xóa phòng khám");
      }
    }
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };
  handleOnChangeImage = async (event) => {
    let files = event.target.files;
    let file = files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };
  // handleSaveNewClinic = async () => {
  //   let res = await createClinic(this.state);
  //   if (res && res.errCode === 0) {
  //     toast.success("Add a new specialty succeed");
  //     this.setState({
  //       name: "",
  //       imageBase64: "",
  //       descriptionHTML: "",
  //       descriptionMarkdown: "",
  //       address: "",
  //     });
  //   } else {
  //     toast.error("Something wrongs ...");
  //   }
  // };
  handleSaveNewClinic = async () => {
    let { action } = this.state;
    let res;

    if (action === "CREATE") {
      res = await createClinic(this.state);
    } else {
      res = await updateClinicData({
        id: this.state.clinicId,
        name: this.state.name,
        address: this.state.address,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
        imageBase64: this.state.imageBase64,
      });
    }

    if (res && res.errCode === 0) {
      toast.success(
        action === "CREATE" ? "Thêm mới thành công!" : "Cập nhật thành công!",
      );
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        address: "",
        action: "CREATE",
        clinicId: "",
      });
      await this.fetchClinics();
    } else {
      toast.error("Something wrongs ...");
    }
  };
  render() {
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý phòng khám</div>

        {/* Khối nhập liệu bọc trong Card */}
        <div className="clinic-info-card">
          <div className="row">
            <div className="col-6 form-group">
              <label>Tên Phòng Khám</label>
              <input
                className="form-control"
                value={this.state.name}
                onChange={(event) => this.handleOnChangeInput(event, "name")}
              />
            </div>
            <div className="col-6 form-group">
              <label>Ảnh Phòng Khám</label>
              <input
                className="form-control-file"
                type="file"
                onChange={(event) => this.handleOnChangeImage(event)}
              />
            </div>
            <div className="col-12 form-group mt-3">
              <label>Địa Chỉ Phòng Khám</label>
              <input
                className="form-control"
                value={this.state.address}
                onChange={(event) => this.handleOnChangeInput(event, "address")}
              />
            </div>
          </div>

          {/* Editor */}
          <div className="manage-clinic-editor">
            <label>Mô tả phòng khám</label>
            <MdEditor
              style={{ height: "400px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>

          {/* Nút Save */}
          <button
            className={
              this.state.action === "EDIT"
                ? "btn-save-specialty btn-edit-mode"
                : "btn-save-specialty"
            }
            onClick={() => this.handleSaveNewClinic()}
          >
            {this.state.action === "EDIT"
              ? "Cập nhật phòng khám"
              : "Lưu phòng khám"}
          </button>
        </div>

        {/* Bảng danh sách */}
        <div className="table-manage-clinic mt-5">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Tên phòng khám</th>
                <th>Địa chỉ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>{/* map data của bạn ở đây */}</tbody>
          </table>
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
