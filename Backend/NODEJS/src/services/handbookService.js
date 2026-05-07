import db from "../models/index";

let createHandbook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Handbook.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
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

let getAllHandbook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbook.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailHandbookById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: { id: inputId },
          attributes: {
            include: [
              [
                db.sequelize.literal(`(
                  SELECT AVG(rating)
                  FROM Comments AS comment
                  WHERE comment.handbookId = Handbook.id AND comment.isApproved = true
                )`),
                "avgRating",
              ],
              [
                db.sequelize.literal(`(
                  SELECT COUNT(*)
                  FROM Comments AS comment
                  WHERE comment.handbookId = Handbook.id AND comment.isApproved = true
                )`),
                "reviewCount",
              ],
            ],
          },
          raw: true,
          nest: true
        });

        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getTopHandbookHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbook.findAll({
        limit: limit,
        order: [["createdAt", "DESC"]],
      });
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteHandbook = (handbookId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let handbook = await db.Handbook.findOne({
        where: { id: handbookId },
      });
      if (!handbook) {
        resolve({
          errCode: 2,
          errMessage: "The handbook isn't exist",
        });
      } else {
        await db.Handbook.destroy({
          where: { id: handbookId },
        });
        resolve({
          errCode: 0,
          errMessage: "The handbook is deleted",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateHandbookData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      } else {
        let handbook = await db.Handbook.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (handbook) {
          handbook.name = data.name;
          handbook.descriptionHTML = data.descriptionHTML;
          handbook.descriptionMarkdown = data.descriptionMarkdown;
          if (data.imageBase64) {
            handbook.image = data.imageBase64;
          }
          await handbook.save();
          resolve({
            errCode: 0,
            errMessage: "Update the handbook succeeds!",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Handbook's not found!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postCommentHandbook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.handbookId || !data.userId || !data.content) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Comment.create({
          handbookId: data.handbookId,
          userId: data.userId,
          content: data.content,
          rating: data.rating || 0,
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

let getCommentHandbook = (handbookId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!handbookId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Comment.findAll({
          where: { handbookId: handbookId },
          include: [
            {
              model: db.User,
              as: "userData",
              attributes: ["firstName", "lastName", "image"],
            },
          ],
          raw: true,
          nest: true,
        });

        if (data && data.length > 0) {
          data.map((item) => {
            if (item.userData && item.userData.image) {
              item.userData.image = Buffer.from(
                item.userData.image,
                "base64"
              ).toString("binary");
            }
            return item;
          });
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
  getTopHandbookHome: getTopHandbookHome,
  deleteHandbook: deleteHandbook,
  updateHandbookData: updateHandbookData,
  postCommentHandbook: postCommentHandbook,
  getCommentHandbook: getCommentHandbook,
};
