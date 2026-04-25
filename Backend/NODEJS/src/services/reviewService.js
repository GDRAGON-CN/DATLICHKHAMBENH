import db from "../models/index";

let createNewReview = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.patientId || !data.doctorId || !data.rating || !data.comment) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        // If bookingId is provided, perform strict validation
        if (data.bookingId) {
          let booking = await db.Booking.findOne({
            where: { id: data.bookingId, statusId: "S3" },
          });

          if (!booking) {
            resolve({
              errCode: 2,
              errMessage:
                "Bạn chỉ có thể đánh giá theo lịch hẹn sau khi đã hoàn thành buổi khám!",
            });
            return;
          }

          // Check if review already exists for this booking
          let existingReview = await db.Comment.findOne({
            where: { bookingId: data.bookingId },
          });

          if (existingReview) {
            resolve({
              errCode: 3,
              errMessage: "Bạn đã đánh giá cho buổi khám này rồi!",
            });
            return;
          }
        }

        // Create review in Comment table
        await db.Comment.create({
          patientId: data.patientId, // In Comment model it's userId, but wait...
          // Let's check Comment model field names.
          // Comment.js has: handbookId, doctorId, bookingId, userId, content, rating, isApproved
          userId: data.patientId,
          doctorId: data.doctorId,
          bookingId: data.bookingId || null,
          rating: data.rating,
          content: data.comment,
          isApproved: true,
        });

        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getReviewsByDoctorId = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let reviews = await db.Comment.findAll({
          where: { doctorId: doctorId, isApproved: true },
          include: [
            {
              model: db.User,
              as: "userData", // in Comment model it's as: "userData"
              attributes: ["firstName", "lastName", "image"],
            },
          ],
          order: [["createdAt", "DESC"]],
          raw: true,
          nest: true,
        });

        // Remap to match what frontend expects (patientReviewData)
        if (reviews && reviews.length > 0) {
          reviews = reviews.map((item) => {
            item.patientReviewData = item.userData;
            item.comment = item.content; // Remap content to comment
            return item;
          });
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
          data: reviews,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteReview = (reviewId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let review = await db.Comment.findOne({
        where: { id: reviewId },
      });
      if (!review) {
        resolve({
          errCode: 2,
          errMessage: "The review isn't exist",
        });
      } else {
        await db.Comment.destroy({
          where: { id: reviewId },
        });
        resolve({
          errCode: 0,
          errMessage: "The review is deleted",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewReview,
  getReviewsByDoctorId,
  deleteReview,
};
