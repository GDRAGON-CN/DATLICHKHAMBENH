import db from "../models";
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "email",
            "roleId",
            "password",
            "id",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User is not exist";
          resolve(userData);
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Your email is not exist";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId !== "ALL" && userId) {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is used",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);

        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender,
          roleId: data.roleId,
          phonenumber: data.phonenumber,

          image: data.avatar,
        });
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: "the user isn't exist",
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      message: "The user is deleted",
    });
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.gender) {
        resolve({
          errCode: 2,
          errMessage: "Missing required",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        ((user.firstName = data.firstName),
          (user.lastName = data.lastName),
          (user.address = data.address),
          (user.roleId = data.roleId),

          (user.gender = data.gender),
          (user.phonenumber = data.phonenumber));
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        resolve({
          errCode: 0,
          message: "Update the user succeed",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found",
        });
      }
    } catch (e) {
      resolve(e);
    }
  });
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getSearchSuggestions = (keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!keyword) return resolve({ errCode: 0, data: [] });

      let specialties = await db.Specialty.findAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        attributes: ["id", "name"],
        limit: 3,
        raw: true,
      });

      let clinics = await db.Clinic.findAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        attributes: ["id", "name"],
        limit: 3,
        raw: true,
      });

      let doctors = await db.User.findAll({
        where: {
          roleId: "R2",
          [Op.or]: [
            { firstName: { [Op.like]: `%${keyword}%` } },
            { lastName: { [Op.like]: `%${keyword}%` } },
          ],
        },
        attributes: ["id", "firstName", "lastName"],
        limit: 3,
        raw: true,
      });

      let result = [
        ...specialties.map((i) => ({ ...i, type: "SPECIALTY" })),
        ...clinics.map((i) => ({ ...i, type: "CLINIC" })),
        ...doctors.map((i) => ({
          ...i,
          name: `${i.lastName} ${i.firstName}`,
          type: "DOCTOR",
        })),
      ];

      resolve({ errCode: 0, data: result });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllBookingForAdmin = (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!date) {
        resolve({ errCode: 1, errMessage: "Thiếu tham số ngày tháng!" });
      } else {
        let whereClause = {};
        if (date !== "ALL") {
          whereClause.date = date;
        }
        let data = await db.Booking.findAll({
          where: whereClause,
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "statusData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
          order: [["updatedAt", "DESC"]],
        });
        resolve({ errCode: 0, data: data });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật trạng thái lịch hẹn (Admin/Doctor dùng chung)
let updateBookingStatus = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.statusId) {
        resolve({ errCode: 1, errMessage: "Thiếu ID hoặc Status!" });
      } else {
        let booking = await db.Booking.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (booking) {
          booking.statusId = data.statusId;
          await booking.save();
          resolve({ errCode: 0, errMessage: "ok" });
        } else {
          resolve({ errCode: 2, errMessage: "Lịch hẹn không tồn tại" });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleChangePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.oldPassword || !data.newPassword) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (user) {
          let check = await bcrypt.compareSync(data.oldPassword, user.password);
          if (check) {
            user.password = await hashUserPassword(data.newPassword);
            await user.save();
            resolve({
              errCode: 0,
              errMessage: "Change password succeed",
            });
          } else {
            resolve({
              errCode: 2,
              errMessage: "Old password is wrong",
            });
          }
        } else {
          resolve({
            errCode: 3,
            errMessage: "User not found",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  getSearchSuggestions: getSearchSuggestions,
  getAllBookingForAdmin: getAllBookingForAdmin,
  updateBookingStatus: updateBookingStatus,
  handleChangePassword: handleChangePassword,
};
