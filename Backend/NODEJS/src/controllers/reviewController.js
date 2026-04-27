import reviewService from "../services/reviewService";

let handleCreateNewReview = async (req, res) => {
  try {
    let info = await reviewService.createNewReview(req.body);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleGetReviewsByDoctorId = async (req, res) => {
  try {
    let info = await reviewService.getReviewsByDoctorId(req.query.doctorId);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let handleDeleteReview = async (req, res) => {
  try {
    let info = await reviewService.deleteReview(req.body.id);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleCreateNewReview,
  handleGetReviewsByDoctorId,
  handleDeleteReview,
};
