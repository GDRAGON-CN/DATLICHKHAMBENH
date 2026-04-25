import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageHandbook.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils } from "../../../utils";
import {
  createNewHandbook,
  getAllHandbook,
  deleteHandbookService,
  updateHandbookData,
} from "../../../services/userService";
import { toast } from "react-toastify";
import CommonTable from "./CommonTable";

const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listHandbook: [],
      action: "CREATE",
      handbookId: "",
    };
  }

  async componentDidMount() {
    await this.fetchListHandbook();
  }

  fetchListHandbook = async () => {
    let res = await getAllHandbook();
    if (res && res.errCode === 0) {
      this.setState({
        listHandbook: res.data ? res.data : [],
      });
    }
  };

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

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveNewHandbook = async () => {
    let { action } = this.state;
    let res;

    if (action === "CREATE") {
      res = await createNewHandbook(this.state);
    } else {
      res = await updateHandbookData({
        id: this.state.handbookId,
        name: this.state.name,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
        imageBase64: this.state.imageBase64,
      });
    }

    if (res && res.errCode === 0) {
      toast.success(
        action === "CREATE"
          ? "Thêm bài viết cẩm nang thành công!"
          : "Cập nhật bài viết cẩm nang thành công!",
      );
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        action: "CREATE",
        handbookId: "",
      });
      await this.fetchListHandbook();
    } else {
      toast.error(
        action === "CREATE"
          ? "Thêm bài viết cẩm nang thất bại!"
          : "Cập nhật bài viết cẩm nang thất bại!",
      );
    }
  };

  handleEditHandbook = (item) => {
    this.setState({
      name: item.name,
      descriptionHTML: item.descriptionHTML,
      descriptionMarkdown: item.descriptionMarkdown,
      imageBase64: item.image ? item.image : "",
      action: "EDIT",
      handbookId: item.id,
    });
  };

  handleDeleteHandbook = async (item) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài viết: ${item.name}?`)) {
      let res = await deleteHandbookService(item.id);
      if (res && res.errCode === 0) {
        toast.success("Xóa bài viết cẩm nang thành công!");
        await this.fetchListHandbook();
      } else {
        toast.error("Xóa bài viết cẩm nang thất bại!");
      }
    }
  };

  render() {
    let { listHandbook, action } = this.state;
    const columns = [
      {
        label: "Tên bài viết",
        key: "name",
      },
      {
        label: "Hành động",
        className: "text-center",
        render: (item) => (
          <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
            <button
              className="btn-edit"
              onClick={() => this.handleEditHandbook(item)}
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
            <button
              className="btn-delete"
              onClick={() => this.handleDeleteHandbook(item)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ];

    return (
      <div className="manage-handbook-container">
        <div className="ms-title">Quản lý cẩm nang sức khỏe</div>

        <div className="add-new-handbook row">
          <div className="col-6 form-group">
            <label>Tiêu đề bài viết</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh bìa bài viết</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
            {this.state.imageBase64 && (
              <div
                className="preview-image mt-2"
                style={{
                  backgroundImage: `url(${this.state.imageBase64})`,
                  width: "100px",
                  height: "60px",
                  backgroundSize: "cover",
                  border: "1px solid #ddd",
                }}
              ></div>
            )}
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "400px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              className={
                action === "EDIT"
                  ? "btn-save-handbook btn-edit-mode"
                  : "btn-save-handbook"
              }
              onClick={() => this.handleSaveNewHandbook()}
            >
              {action === "EDIT" ? "Cập nhật bài viết" : "Lưu bài viết"}
            </button>
          </div>
        </div>

        <div className="mt-5 mb-5">
          <div className="ms-title mb-3">Danh sách bài viết cẩm nang</div>
          <CommonTable
            data={listHandbook}
            columns={columns}
            itemsPerPage={5}
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
