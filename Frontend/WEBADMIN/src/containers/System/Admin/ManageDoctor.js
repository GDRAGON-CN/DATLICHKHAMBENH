import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { fetchAllDoctor } from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { saveDetailDoctor } from "../../../store/actions";
import { getDetailInforDoctor } from "../../../services/userService";
import { add } from "lodash";
const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // save to markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      // save to doctor-infor
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
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
      if (type === "PRICE" || type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = item.valueVI;
          let labelEn = item.valueEN;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type == "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type == "CLINIC") {
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
      let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;
      console.log("CHECK ALL:", this.props.allRequiredDoctorInfor);
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
      let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }
    // if (prevProps.allDoctors !== this.props.allDoctors) {
    //   let dataSelect = this.buildDataInputSelect(
    //     this.props.allDoctors,
    //     "USERS",
    //   );
    //   let { resPrice, resPayment, resProvince } =
    //     this.props.allRequiredDoctorInfor;
    //   let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
    //   let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
    //   let dataSelectProvince = this.buildDataInputSelect(
    //     resProvince,
    //     "PROVINCE",
    //   );
    //   this.setState({
    //     listDoctors: dataSelect,
    //     listPrice: dataSelectPrice,
    //     listPayment: dataSelectPayment,
    //     listProvince: dataSelectProvince,
    //   });
    // }
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
      descriptions: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      specialtyId: this.state.selectedSpecialty.value,
    });
  };
  handleChange = async (selectedOption) => {
    this.setState({ selectedOption });
    let { listPayment, listProvince, listPrice, listClinic, listSpecialty } =
      this.state;
    let res = await getDetailInforDoctor(selectedOption.value);
    if (
      res &&
      res.errCode === 0 &&
      res.data &&
      res.data.Markdown &&
      res.data.Markdown.contentMarkdown
    ) {
      let markdown = res.data.Markdown;
      let addressClinic = "",
        nameClinic = "",
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        specialtyId = "",
        clinicId = "",
        selectedPayment = "",
        selectedPrice = "",
        selectedProvince = "",
        selectedSpecialty = "",
        selectedClinic = "";

      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;
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
        selectedClinic = listClinic.find((item) => {
          return item && item.value === clinicId;
        });
      }

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.descriptions,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPayment: selectedPayment,
        selectedPrice: selectedPrice,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic,
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
        selectedClinic: "",
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
          Tạo thêm thông tin cho bác sĩ
        </div>

        {/* Khối 1: Chọn bác sĩ & Mô tả ngắn */}
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

        {/* Khối 2: Thông tin phòng khám & Phí */}
        <div className="doctor-info-card">
          <div className="row mb-3">
            <div className="col-4 form-group">
              <label>
                <i className="fas fa-dollar-sign"></i> Chọn giá khám
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
                <i className="fas fa-map-marker-alt"></i> Chọn tỉnh thành
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

          <div className="row mb-3">
            <div className="col-4 form-group">
              <label>Tên phòng khám</label>
              <input
                className="form-control"
                onChange={(event) =>
                  this.handleOnChangeText(event, "nameClinic")
                }
                value={this.state.nameClinic}
              />
            </div>
            <div className="col-4 form-group">
              <label>Địa chỉ phòng khám</label>
              <input
                className="form-control"
                onChange={(event) =>
                  this.handleOnChangeText(event, "addressClinic")
                }
                value={this.state.addressClinic}
              />
            </div>
            <div className="col-4 form-group">
              <label>Ghi chú (Note)</label>
              <input
                className="form-control"
                onChange={(event) => this.handleOnChangeText(event, "note")}
                value={this.state.note}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6 form-group">
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
            <div className="col-6 form-group">
              <label>
                <i className="fas fa-hospital"></i> Chọn phòng khám (Bệnh viện)
              </label>
              <Select
                value={this.state.selectedClinic}
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listClinic}
                placeholder="Chọn phòng khám"
                name="selectedClinic"
              />
            </div>
          </div>
        </div>

        {/* Khối 3: Soạn thảo văn bản chi tiết */}
        <div className="doctor-info-card">
          <label>Chi tiết nội dung bài viết (Markdown)</label>
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
              <span>Cập nhật thông tin</span>
            ) : (
              <span>Tạo mới thông tin</span>
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
