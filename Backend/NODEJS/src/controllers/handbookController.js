import handbookService from "../services/handbookService";

let createHandbook = async (req, res) => {
  try {
    let infor = await handbookService.createHandbook(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllHandbook = async (req, res) => {
  try {
    let infor = await handbookService.getAllHandbook();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getDetailHandbookById = async (req, res) => {
  try {
    let infor = await handbookService.getDetailHandbookById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getTopHandbookHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await handbookService.getTopHandbookHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleDeleteHandbook = async (req, res) => {
  try {
    let infor = await handbookService.deleteHandbook(req.body.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleEditHandbook = async (req, res) => {
  try {
    let infor = await handbookService.updateHandbookData(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let postCommentHandbook = async (req, res) => {
  try {
    let infor = await handbookService.postCommentHandbook(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getCommentHandbook = async (req, res) => {
  try {
    let infor = await handbookService.getCommentHandbook(req.query.handbookId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
  getTopHandbookHome: getTopHandbookHome,
  handleDeleteHandbook: handleDeleteHandbook,
  handleEditHandbook: handleEditHandbook,
  postCommentHandbook: postCommentHandbook,
  getCommentHandbook: getCommentHandbook,
};
