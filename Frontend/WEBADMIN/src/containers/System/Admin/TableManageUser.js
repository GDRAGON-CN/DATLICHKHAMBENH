import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";

import { isOptionalChain } from "typescript";
// import MarkdownIt from "markdown-it";
// import MdEditor from "react-markdown-editor-lite";
// import "reach-markdown-editor-lite/lib/index.css";
// const mdParse = new MarkdownIt();
// function handleEditorChange({ html, text }) {}

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
    };
  }
  componentDidMount() {
    this.props.fetchUserRedux();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        usersRedux: this.props.listUsers,
      });
    }
  }
  handleDeleteUser = (user) => {
    this.props.deleteAUserRedux(user.id);
  };
  handleEditUser = (user) => {
    this.props.handleEditUserFromParentKey(user);
  };
  render() {
    let arrUsers = this.state.usersRedux;
    return (
      <div className="table-manage-user-container">
        <div className="table-responsive">
          <table id="TableManageUser" className="table table-hover">
            <thead>
              <tr>
                <th>STT</th>
                <th>Email</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {arrUsers && arrUsers.length > 0 ? (
                arrUsers.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.email}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.address}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          title="Sửa"
                          onClick={() => this.handleEditUser(item)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn-delete"
                          title="Xóa"
                          onClick={() => this.handleDeleteUser(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center italic">
                    Không có dữ liệu người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
