import patientService from "../services/patientService";
let postBookAppointment = async (req, res) => {
  try {
    let data = await patientService.postBookAppointment(req.body);
    console.log("DATA SEND:", req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let postVerifyBookAppointment = async (req, res) => {
  try {
    let data = await patientService.postVerifyBookAppointment(req.body);
    console.log("DATA SEND:", req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getListBookingByPatient = async (req, res) => {
  try {
    let info = await patientService.getListBookingByPatient(req.query.email);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let postCancelBooking = async (req, res) => {
  try {
    // Gọi service xử lý logic hủy lịch
    let info = await patientService.cancelBooking(req.body);

    // Trả về kết quả cho phía React
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let postRequestMagicLink = async (req, res) => {
  try {
    let info = await patientService.postRequestMagicLink(req.body.email);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let postVerifyMagicLink = async (req, res) => {
  try {
    let info = await patientService.postVerifyMagicLink(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  postCancelBooking: postCancelBooking,
  getListBookingByPatient: getListBookingByPatient,
  // thêm
  postRequestMagicLink: postRequestMagicLink,
  postVerifyMagicLink: postVerifyMagicLink,
};
