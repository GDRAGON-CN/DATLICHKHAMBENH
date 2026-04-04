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

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
