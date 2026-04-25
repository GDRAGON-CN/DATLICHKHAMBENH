import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      listPrice: [],
      listPayment: [],
      listProvince: [],
      listSpecialty: [],
      listPosition: [],

      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedSpecialty: "",
      selectedPosition: "",

      note: "",
      specialtyId: "",
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.getAllRequireDoctorInfor();
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
      if (
        type === "PRICE" ||
        type === "PAYMENT" ||
        type === "PROVINCE" ||
        type === "POSITION"
      ) {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = item.valueVi;
          let labelEn = item.valueEn;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      return result;
    }
  };

  componentDidUpdate(prevProps, preState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS",
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      let { resPrice, resPayment, resProvince, resSpecialty, resPosition } =
        this.props.allRequiredDoctorInfor;

      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE",
      );
      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY",
      );
      let dataSelectPosition = this.buildDataInputSelect(
        resPosition,
        "POSITION",
      );

      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listPosition: dataSelectPosition,
      });
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;

    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      note: this.state.note,
      specialtyId: this.state.selectedSpecialty.value,
      selectedPosition: this.state.selectedPosition.value,
    });
  };

  handleChange = async (selectedOption) => {
    this.setState({ selectedOption });
    let { listPayment, listProvince, listPrice, listSpecialty, listPosition } =
      this.state;

    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data) {
      let doctorInfor = res.data.Doctor_Infor;
      let addressClinic = "",
        nameClinic = "",
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        specialtyId = "",
        selectedPayment = "",
        selectedPrice = "",
        selectedProvince = "",
        selectedSpecialty = "",
        selectedPosition = "",
        positionId = "";

      if (doctorInfor) {
        addressClinic = doctorInfor.addressClinic;
        nameClinic = doctorInfor.nameClinic;
        note = doctorInfor.note;
        paymentId = doctorInfor.paymentId;
        priceId = doctorInfor.priceId;
        provinceId = doctorInfor.provinceId;
        specialtyId = doctorInfor.specialtyId;

        selectedPayment = listPayment.find((item) => {
          return item && item.value === paymentId;
        });
        selectedPrice = listPrice.find((item) => {
          return item && item.value === priceId;
        });
        selectedProvince = listProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectedSpecialty = listSpecialty.find((item) => {
          return item && item.value === specialtyId;
        });
        positionId = doctorInfor.positionId;
      }

      selectedPosition = listPosition.find((item) => {
        return item && item.value === positionId;
      });

      this.setState({
        contentHTML: doctorInfor ? doctorInfor.contentHTML : "",
        contentMarkdown: doctorInfor ? doctorInfor.contentMarkdown : "",
        description: doctorInfor ? doctorInfor.description : "",
        hasOldData: doctorInfor ? true : false,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPayment: selectedPayment,
        selectedPrice: selectedPrice,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedPosition: selectedPosition,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        addressClinic: "",
        nameClinic: "",
        note: "",
        selectedPayment: "",
        selectedPrice: "",
        selectedProvince: "",
        selectedSpecialty: "",
        selectedPosition: "",
      });
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <i className="fas fa-user-md mr-2"></i>
          Quản lý thông tin bác sĩ
        </div>

        <div className="doctor-info-card">
          <div className="more-infor">
            <div className="content-left form-group">
              <label>Chọn bác sĩ</label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChange}
                options={this.state.listDoctors}
                placeholder="Gõ để tìm kiếm bác sĩ..."
              />
            </div>
            <div className="content-right">
              <label>Thông tin giới thiệu ngắn</label>
              <textarea
                className="form-control"
                rows="4"
                onChange={(event) =>
                  this.handleOnChangeText(event, "description")
                }
                value={this.state.description}
                placeholder="Tóm tắt về kinh nghiệm, thế mạnh của bác sĩ..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="doctor-info-card">
          <div className="row mb-3">
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-dollar-sign"></i> Giá khám bệnh
              </label>
              <Select
                value={this.state.selectedPrice}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listPrice}
                placeholder="Chọn giá"
                name="selectedPrice"
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-credit-card"></i> Phương thức thanh toán
              </label>
              <Select
                value={this.state.selectedPayment}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listPayment}
                placeholder="Chọn thanh toán"
                name="selectedPayment"
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-map-marker-alt"></i> Khu vực (Tỉnh thành)
              </label>
              <Select
                value={this.state.selectedProvince}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listProvince}
                placeholder="Chọn tỉnh"
                name="selectedProvince"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-stethoscope"></i> Chọn Chuyên Khoa
              </label>
              <Select
                value={this.state.selectedSpecialty}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listSpecialty}
                placeholder="Chọn chuyên khoa"
                name="selectedSpecialty"
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-user-tag"></i> Chọn Chức danh
              </label>
              <Select
                value={this.state.selectedPosition}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listPosition}
                placeholder="Chọn chức danh"
                name="selectedPosition"
              />
            </div>
            <div className="col-4 form-group">
              <label>Ghi chú thêm</label>
              <input
                className="form-control"
                onChange={(event) => this.handleOnChangeText(event, "note")}
                value={this.state.note}
                placeholder="Ví dụ: Khám tại phòng 101..."
              />
            </div>
          </div>
        </div>

        <div className="doctor-info-card">
          <label>Nội dung giới thiệu chi tiết (Markdown)</label>
          <div className="manage-doctor-editor">
            <MdEditor
              style={{ height: "400px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown || ""}
            />
          </div>

          <button
            onClick={() => this.handleSaveContentMarkdown()}
            className={
              hasOldData ? "save-content-doctor" : "create-content-doctor"
            }
          >
            {hasOldData ? (
              <span>Lưu thay đổi</span>
            ) : (
              <span>Tạo thông tin bác sĩ</span>
            )}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    getAllRequireDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
