import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { getDetailInforDoctor, createNewUserService, editUserService, deleteUserService } from "../../../services/userService";
import CommonTable from "./CommonTable";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      description: "",
      hasOldData: false,

      action: CRUD_ACTIONS.CREATE,
      doctorEditId: "",
      avatar: "",
      previewImgURL: "",

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

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      genderArr: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.getAllRequireDoctorInfor();
    this.props.getGenderStart();
  }


  buildDataInputSelect = (inputData, type) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      if (
        type === "PRICE" ||
        type === "PAYMENT" ||
        type === "PROVINCE" ||
        type === "POSITION"
      ) {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.valueVi;
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
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
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

  handleSaveContentMarkdown = async () => {
    let { hasOldData, action, doctorEditId, email, password, firstName, lastName, phoneNumber, address, gender, avatar } = this.state;

    let doctorIdToSave = doctorEditId;

    if (action === CRUD_ACTIONS.CREATE) {
      if (!email || !password || !firstName || !lastName) {
         toast.error("Vui lòng điền đủ thông tin cơ bản (Email, Mật khẩu, Họ, Tên) để tạo bác sĩ mới!");
         return;
      }
      
      let res = await createNewUserService({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phonenumber: phoneNumber,
        gender: gender,
        roleId: "R2",
        avatar: avatar
      });

      if (res && res.errCode === 0 && res.user && res.user.id) {
        doctorIdToSave = res.user.id;
        toast.success("Tạo tài khoản bác sĩ thành công!");
        this.props.fetchAllDoctor();
      } else {
        toast.error(res?.errMessage || "Tạo tài khoản bác sĩ thất bại!");
        return;
      }
    } else {
      let updateData = {
        id: doctorEditId,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phonenumber: phoneNumber,
        gender: gender,
        roleId: "R2",
        avatar: avatar
      };
      if (password && password !== "********") {
        updateData.password = password;
      }
      let resEdit = await editUserService(updateData);
      if (resEdit && resEdit.errCode === 0) {
        toast.success("Cập nhật thông tin User bác sĩ thành công!");
        this.props.fetchAllDoctor();
      } else {
        toast.error(resEdit?.errMessage || "Cập nhật User bác sĩ thất bại!");
      }
    }

    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: doctorIdToSave,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice?.value,
      selectedPayment: this.state.selectedPayment?.value,
      selectedProvince: this.state.selectedProvince?.value,
      note: this.state.note,
      specialtyId: this.state.selectedSpecialty?.value,
      selectedPosition: this.state.selectedPosition?.value,
    });
    
    if (action === CRUD_ACTIONS.CREATE) {
       this.setState({
         email: "", password: "", firstName: "", lastName: "", phoneNumber: "", address: "", avatar: "", previewImgURL: "",
         contentHTML: "", contentMarkdown: "", description: "", note: "",
         selectedPrice: "", selectedPayment: "", selectedProvince: "", selectedSpecialty: "", selectedPosition: ""
       });
    }
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
      });
    }
  };

  handleDeleteDoctorFromTable = async (user) => {
    let res = await deleteUserService(user.id);
    if (res && res.errCode === 0) {
       toast.success("Xóa bác sĩ thành công!");
       this.props.fetchAllDoctor();
    } else {
       toast.error("Xóa bác sĩ thất bại!");
    }
  };

  handleEditDoctorFromTable = async (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    let { listPayment, listProvince, listPrice, listSpecialty, listPosition } = this.state;
    let res = await getDetailInforDoctor(user.id);
    
    let doctorInfor = res?.data?.Doctor_Infor;
    let note = "", paymentId = "", priceId = "", provinceId = "", specialtyId = "", selectedPayment = "", selectedPrice = "", selectedProvince = "", selectedSpecialty = "", selectedPosition = "", positionId = "";

    if (doctorInfor) {
      note = doctorInfor.note;
      paymentId = doctorInfor.paymentId;
      priceId = doctorInfor.priceId;
      provinceId = doctorInfor.provinceId;
      specialtyId = doctorInfor.specialtyId;

      selectedPayment = listPayment.find(item => item && item.value === paymentId);
      selectedPrice = listPrice.find(item => item && item.value === priceId);
      selectedProvince = listProvince.find(item => item && item.value === provinceId);
      selectedSpecialty = listSpecialty.find(item => item && item.value === specialtyId);
      positionId = doctorInfor.positionId;
    }
    selectedPosition = listPosition.find(item => item && item.value === positionId);

    this.setState({
      action: CRUD_ACTIONS.EDIT,
      doctorEditId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phonenumber,
      gender: user.gender,
      avatar: imageBase64,
      previewImgURL: imageBase64,
      password: "********", 

      contentHTML: doctorInfor ? doctorInfor.contentHTML : "",
      contentMarkdown: doctorInfor ? doctorInfor.contentMarkdown : "",
      description: doctorInfor ? doctorInfor.description : "",
      hasOldData: doctorInfor ? true : false,
      note, selectedPayment, selectedPrice, selectedProvince, selectedSpecialty, selectedPosition,
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    let { hasOldData, genderArr, action, previewImgURL } = this.state;

    const doctorColumns = [
      { label: "Email", key: "email" },
      { label: "Họ", key: "lastName" },
      { label: "Tên", key: "firstName" },
      { label: "Địa chỉ", key: "address" },
      { label: "Số điện thoại", key: "phonenumber" },
      {
        label: "Hành động",
        key: "actions",
        render: (item) => (
          <div>
            <button
              className="btn-edit mr-2"
              onClick={() => this.handleEditDoctorFromTable(item)}
            >
              <i className="fas fa-pencil-alt"></i> Sửa
            </button>
            <button
              className="btn-delete"
              onClick={() => this.handleDeleteDoctorFromTable(item)}
            >
              <i className="fas fa-trash"></i> Xóa
            </button>
          </div>
        ),
      },
    ];

    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <i className="fas fa-user-md mr-2"></i>
          Quản lý thông tin bác sĩ
        </div>

        <div className="doctor-info-card">
          <h5 className="mb-4 text-primary font-weight-bold">Thông tin bác sĩ</h5>
          <div className="row mb-3">
            <div className="col-4 form-group">
              <label>Email *</label>
              <input className="form-control" type="email" value={this.state.email} onChange={(e) => this.handleOnChangeText(e, "email")} placeholder="Email..." disabled={action === CRUD_ACTIONS.EDIT} />
            </div>
            <div className="col-4 form-group">
              <label>Mật khẩu *</label>
              <input className="form-control" type="password" value={this.state.password} onChange={(e) => this.handleOnChangeText(e, "password")} placeholder="Mật khẩu..." />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-3 form-group">
              <label>Họ *</label>
              <input className="form-control" type="text" value={this.state.lastName} onChange={(e) => this.handleOnChangeText(e, "lastName")} placeholder="Họ..." />
            </div>
            <div className="col-3 form-group">
              <label>Tên *</label>
              <input className="form-control" type="text" value={this.state.firstName} onChange={(e) => this.handleOnChangeText(e, "firstName")} placeholder="Tên..." />
            </div>
            <div className="col-3 form-group">
              <label>Số điện thoại</label>
              <input className="form-control" type="text" value={this.state.phoneNumber} onChange={(e) => this.handleOnChangeText(e, "phoneNumber")} placeholder="Số điện thoại..." />
            </div>
            <div className="col-3 form-group">
              <label>Giới tính</label>
              <select className="form-control" value={this.state.gender} onChange={(e) => this.handleOnChangeText(e, "gender")}>
                {genderArr && genderArr.length > 0 && genderArr.map((item, index) => (
                  <option key={index} value={item.keyMap}>
                    {item.valueVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-9 form-group">
              <label>Địa chỉ</label>
              <input className="form-control" type="text" value={this.state.address} onChange={(e) => this.handleOnChangeText(e, "address")} placeholder="Địa chỉ..." />
            </div>
            <div className="col-3 form-group">
              <label>Ảnh đại diện</label>
              <div className="preview-img-container" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  id="previewImg"
                  type="file"
                  hidden
                  onChange={(event) => this.handleOnChangeImage(event)}
                />
                <label className="label-upload btn btn-secondary m-0" htmlFor="previewImg">
                  Tải ảnh <i className="fas fa-upload"></i>
                </label>
                <div
                  className="preview-image"
                  style={{ backgroundImage: `url(${previewImgURL})`, width: "50px", height: "50px", backgroundSize: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                ></div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-12 form-group">
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
              <span>Lưu thông tin</span>
            )}
          </button>
        </div>

        <div className="doctor-info-card mt-4">
          <h5 className="mb-4 text-primary font-weight-bold">Danh sách bác sĩ</h5>
          <CommonTable data={this.props.allDoctors || []} columns={doctorColumns} itemsPerPage={10} />
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    genderRedux: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    getAllRequireDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
