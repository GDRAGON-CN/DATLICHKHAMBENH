import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import TableManageUser from "./TableManageUser";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { getAllCodeService } from "../../../services/userService";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      action: "",
      userEditId: "",
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
    // this.props.dispatch(actions.fetchGenderStart);
    // try {
    //   let res = await getAllCodeService("gender");
    //   if (res.data && res.errCode === 0) {
    //     this.setState({
    //       genderArr: res.data,
    //     });
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
      });
    }
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrRoles = this.props.roleRedux;
      let arrGenders = this.props.genderRedux;
      let arrPositions = this.props.positionRedux;
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
        avatar: "",
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
      });
    }
  }

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      // fire redux create user
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        gender: this.state.gender,
        roleId: this.state.role,
        phonenumber: this.state.phoneNumber,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
    if (action === CRUD_ACTIONS.EDIT) {
      //fire redux edit user
      this.props.editAUserRedux({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        gender: this.state.gender,
        roleId: this.state.role,
        phonenumber: this.state.phoneNumber,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
  };
  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      `email`,
      `password`,
      `firstName`,
      `lastName`,
      `phoneNumber`,
      `address`,
      `gender`,
      `position`,
      `role`,
      // `avatar`,
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("this input is required: " + arrCheck[i]);
        break;
      }
    }
    return isValid;
  };
  handleOnChangeImage = async (event) => {
    let files = event.target.files;
    let file = files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
      });
    }
  };
  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };
  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState(
      {
        ...copyState,
      },
      () => {
        console.log("This copyState:", this.state);
      },
    );
  };
  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    this.setState({
      email: user.email,
      password: "HARDCODE",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phonenumber,
      address: user.address,
      gender: user.gender,
      position: user.positionId,
      role: user.roleId,
      avatar: imageBase64,
      previewImgURL: imageBase64,
      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };

  render() {
    let genders = this.state.genderArr;
    let language = this.props.language;
    let isGetGenders = this.props.isLoadingGender;
    let roles = this.state.roleArr;
    let positions = this.state.positionArr;
    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      avatar,
    } = this.state;
    return (
      <div className="user-redux-container">
        <div className="title text-center mb-4">
          <FormattedMessage id="menu.admin.manage-user" />
        </div>
        <div className="user-redux-body">
          <div className="container custom-card">
            <div className="row">
              <div className="col-12 mb-3 mt-2 sub-title">
                <i className="fas fa-user-plus mr-2"></i>
                <FormattedMessage id="manage-user.add" />
              </div>

              {/* Nhóm thông tin cơ bản */}
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => this.onChangeInput(e, "email")}
                  disabled={this.state.action === CRUD_ACTIONS.EDIT}
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => this.onChangeInput(e, "password")}
                  disabled={this.state.action === CRUD_ACTIONS.EDIT}
                  placeholder="********"
                />
              </div>
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.first-name" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={firstName}
                  onChange={(e) => this.onChangeInput(e, "firstName")}
                />
              </div>
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.last-name" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={lastName}
                  onChange={(e) => this.onChangeInput(e, "lastName")}
                />
              </div>

              {/* Nhóm liên lạc */}
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.phone-number" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => this.onChangeInput(e, "phoneNumber")}
                />
              </div>
              <div className="col-9 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={address}
                  onChange={(e) => this.onChangeInput(e, "address")}
                />
              </div>

              {/* Nhóm phân quyền & Ảnh */}
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <select
                  className="form-control custom-select"
                  value={gender}
                  onChange={(e) => this.onChangeInput(e, "gender")}
                >
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI
                          ? item.valueVI
                          : item.valueEN}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.position" />
                </label>
                <select
                  className="form-control custom-select"
                  value={position}
                  onChange={(e) => this.onChangeInput(e, "position")}
                >
                  {positions &&
                    positions.length > 0 &&
                    positions.map((item, index) => (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI
                          ? item.valueVI
                          : item.valueEN}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.role" />
                </label>
                <select
                  className="form-control custom-select"
                  value={role}
                  onChange={(e) => this.onChangeInput(e, "role")}
                >
                  {roles &&
                    roles.length > 0 &&
                    roles.map((item, index) => (
                      <option key={index} value={item.keyMap}>
                        {language === LANGUAGES.VI
                          ? item.valueVI
                          : item.valueEN}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-3 form-group custom-input-group">
                <label>
                  <FormattedMessage id="manage-user.image" />
                </label>
                <div className="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(e) => this.handleOnChangeImage(e)}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    Tải ảnh <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImgURL})`,
                    }}
                    onClick={() => this.openPreviewImage()}
                  ></div>
                </div>
              </div>

              <div className="col-12 mt-4 text-right">
                <button
                  className={
                    this.state.action === CRUD_ACTIONS.EDIT
                      ? "btn btn-warning btn-lg px-5 shadow-sm"
                      : "btn btn-primary btn-lg px-5 shadow-sm"
                  }
                  onClick={() => this.handleSaveUser()}
                >
                  {this.state.action === CRUD_ACTIONS.EDIT ? (
                    <FormattedMessage id="manage-user.edit" />
                  ) : (
                    <FormattedMessage id="manage-user.save" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="container mt-5 mb-5 p-0">
            <TableManageUser
              handleEditUserFromParentKey={this.handleEditUserFromParent}
              action={this.state.action}
            />
          </div>
        </div>
        {/* Lightbox giữ nguyên */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    isLoadingGender: state.admin.isLoadingGender,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    // processLogout: () => dispatch(actions.processLogout()),
    //     changeLanguageAppRedux: (language) =>
    //       dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
