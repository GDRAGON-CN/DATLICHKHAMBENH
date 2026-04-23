import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./AllDoctor.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { getAllDoctors } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import HomeFooter from "../../HomePage/HomeFooter";

class AllDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDoctors: [],
      searchTerm: "",
    };
  }

  async componentDidMount() {
    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({
        dataDoctors: res.data ? res.data : [],
      });
    }
  }

  handleSearchDoctor = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  render() {
    let { dataDoctors, searchTerm } = this.state;
    let { language } = this.props;

    const removeAccents = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    let filteredDoctors = dataDoctors.filter((item) => {
      if (!searchTerm) return true;

      let search = removeAccents(searchTerm);

      let fullName = removeAccents(`${item.lastName} ${item.firstName}`);

      let specialtyName = item.Doctor_Infor?.specialtyData?.name
        ? removeAccents(item.Doctor_Infor.specialtyData.name)
        : "";

      let position =
        language === LANGUAGES.VI
          ? item.positionData?.valueVi
          : item.positionData?.valueEn;
      let positionSearch = position ? removeAccents(position) : "";

      return (
        fullName.includes(search) ||
        specialtyName.includes(search) ||
        positionSearch.includes(search)
      );
    });

    return (
      <div className="all-doctor-container">
        <HomeHeader isShowBanner={false} />
        <div className="all-doctor-body">
          <div className="all-doctor-header">
            <div className="header-title">Danh sách bác sĩ</div>
            <div className="search-doctor">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder={
                  language === LANGUAGES.VI
                    ? "Tìm tên bác sĩ, chuyên khoa..."
                    : "Search doctor, specialty..."
                }
                value={searchTerm}
                onChange={(event) => this.handleSearchDoctor(event)}
              />
            </div>
          </div>

          <div className="list-doctor">
            {filteredDoctors && filteredDoctors.length > 0 ? (
              filteredDoctors.map((item, index) => {
                // Logic hiển thị tên theo ngôn ngữ
                let pos =
                  language === LANGUAGES.VI
                    ? item.positionData?.valueVi
                    : item.positionData?.valueEn;
                let nameVi = `${pos || ""}, ${item.lastName} ${item.firstName}`;
                let nameEn = `${pos || ""}, ${item.firstName} ${item.lastName}`;

                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary",
                  );
                }

                return (
                  <div
                    className="doctor-item"
                    key={index}
                    onClick={() => this.handleViewDetailDoctor(item)}
                  >
                    <div
                      className="item-image"
                      style={{
                        backgroundImage: `url(${imageBase64 || item.image})`,
                      }}
                    ></div>
                    <div className="item-info">
                      <div className="doctor-name">
                        {language === LANGUAGES.VI ? nameVi : nameEn}
                      </div>
                      <div className="doctor-specialty">
                        {item.Doctor_Infor?.specialtyData?.name ||
                          "Chuyên khoa hệ thống"}
                      </div>

                      {item.Doctor_Infor?.addressClinic && (
                        <div className="doctor-address">
                          <i className="fas fa-map-marker-alt"></i>{" "}
                          {item.Doctor_Infor.addressClinic}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-data">
                <i className="fas fa-user-slash"></i>
                <p>
                  <FormattedMessage id="patient.all-doctor.no-result" />
                </p>
              </div>
            )}
          </div>
        </div>
        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

export default connect(mapStateToProps, null)(AllDoctor);
