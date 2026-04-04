import clinicService from "../services/clinicService";
let createClinic = async (req, res) => {
  try {
    let data = await clinicService.createClinic(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.getAllClinic();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getDetailClinicById = async (req, res) => {
  try {
    let infor = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let handleEditClinic = async (req, res) => {
  try {
    let data = await clinicService.updateClinicData(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleDeleteClinic = async (req, res) => {
  try {
    // Thường xóa ta truyền id qua query hoặc body
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters",
      });
    }
    let data = await clinicService.deleteClinic(req.body.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  handleEditClinic: handleEditClinic,
  handleDeleteClinic: handleDeleteClinic,
};
