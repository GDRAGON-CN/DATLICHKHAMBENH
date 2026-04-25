import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import {
  createNewSpecialty,
  getAllSpecialty,
  updateSpecialtyData,
  deleteSpecialtyService,
} from "../../../services/userService";
import { toast } from "react-toastify";
import CommonTable from "./CommonTable";
const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listSpecialty: [],
      action: "CREATE",
      specialtyId: "",
    };
  }

  async componentDidMount() {
    await this.fetchListSpecialty();
  }
  fetchListSpecialty = async () => {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        listSpecialty: res.data ? res.data : [],
      });
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
  handleSaveNewSpecialty = async () => {
    let { action } = this.state;
    let res;

    if (action === "CREATE") {
      res = await createNewSpecialty(this.state);
    } else {
      res = await updateSpecialtyData({
        id: this.state.specialtyId,
        name: this.state.name,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
        imageBase64: this.state.imageBase64,
      });
    }

    if (res && res.errCode === 0) {
      toast.success(
        action === "CREATE"
          ? "Add a new specialty succeed"
          : "Update specialty succeed",
      );
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        action: "CREATE",
        specialtyId: "",
      });
      await this.fetchListSpecialty();
    } else {
      toast.error("Something wrongs ...");
    }
  };
  handleEditSpecialty = (item) => {
    this.setState({
      name: item.name,
      descriptionHTML: item.descriptionHTML,
      descriptionMarkdown: item.descriptionMarkdown,
      imageBase64: item.image ? item.image : "",
      action: "EDIT",
      specialtyId: item.id,
    });
  };
  handleDeleteSpecialty = async (item) => {
    if (window.confirm(`Bạn có chắc muốn xóa chuyên khoa: ${item.name}?`)) {
      let res = await deleteSpecialtyService(item.id);
      if (res && res.errCode === 0) {
        toast.success("Delete specialty succeed");
        await this.fetchListSpecialty();
      }
    }
  };
  render() {
    let { listSpecialty, action } = this.state;
    const columns = [
      {
        label: "Tên chuyên khoa",
        key: "name",
      },
      {
        label: "Hành động",
        className: "text-center",
        render: (item) => (
          <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
            <button
              className="btn-edit"
              onClick={() => this.handleEditSpecialty(item)}
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button
              className="btn-delete"
              onClick={() => this.handleDeleteSpecialty(item)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ];
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý chuyên khoa</div>
        <div className="specialty-info-card">
          <div className="row">
            <div className="col-6 form-group">
              <label>Tên Chuyên Khoa</label>
              <input
                className="form-control"
                type="text"
                value={this.state.name}
                onChange={(event) => this.handleOnChangeInput(event, "name")}
              />
            </div>
            <div className="col-6 form-group">
              <label>Ảnh Chuyên Khoa</label>
              <input
                className="form-control-file"
                type="file"
                onChange={(event) => this.handleOnChangeImage(event)}
              />
              <div
                className="preview-image"
                style={{
                  backgroundImage: `url(${this.state.imageBase64})`,
                  width: "100px",
                  height: "60px",
                  backgroundSize: "cover",
                  marginTop: "10px",
                  border: "1px solid #ddd",
                }}
              ></div>
            </div>
          </div>

          <div className="manage-specialty-editor">
            <label className="mt-3">Mô tả chuyên khoa</label>
            <MdEditor
              style={{ height: "400px", marginTop: "10px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>

          <button
            className={
              action === "EDIT"
                ? "btn-save-specialty btn-edit-mode"
                : "btn-save-specialty"
            }
            onClick={() => this.handleSaveNewSpecialty()}
          >
            {action === "EDIT" ? "Cập nhật chuyên khoa" : "Lưu chuyên khoa"}
          </button>
        </div>

        <div className="mt-5">
          <div className="sub-title mb-3">Danh sách chuyên khoa</div>
          <CommonTable
            data={listSpecialty}
            columns={columns}
            itemsPerPage={5}
          />
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
