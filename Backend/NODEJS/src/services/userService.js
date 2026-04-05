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
        //user already exist
        // compare password
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
          // attributes: {
          //   include: ["email", "roleId"],
          //   // exclude: ["password"],
          // },
        });
        if (user) {
          // compare password
          let check = await bcrypt.compareSync(password, user.password);
          // let check = true;
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
        //return error
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
      // check email is exist ???
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
          gender: data.gender === "1" ? true : false,
          roleId: data.roleId,
          phonenumber: data.phonenumber,
          positionId: data.positionId,
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
    // if (foundUser) {
    //   await foundUser.destroy();
    // }
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
      console.log("check nodejs", data);
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
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
          (user.positionId = data.positionId),
          (user.gender = data.gender),
          (user.phonenumber = data.phonenumber));
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   address: data.address,
        // }));
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

      // 1. Tìm trong bảng Chuyên khoa
      let specialties = await db.Specialty.findAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        attributes: ["id", "name"],
        limit: 3,
        raw: true, // Ép về dữ liệu thuần
      });

      // 2. Tìm trong bảng Phòng khám (Clinic)
      let clinics = await db.Clinic.findAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        attributes: ["id", "name"],
        limit: 3,
        raw: true, // Ép về dữ liệu thuần
      });

      // 3. Tìm trong bảng Bác sĩ
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
        raw: true, // Ép về dữ liệu thuần
      });

      // Gộp kết quả: BỎ .get() và chuẩn hóa trường 'name' cho Doctor
      let result = [
        ...specialties.map((i) => ({ ...i, type: "SPECIALTY" })),
        ...clinics.map((i) => ({ ...i, type: "CLINIC" })),
        ...doctors.map((i) => ({
          ...i,
          name: `${i.lastName} ${i.firstName}`, // Tạo trường name cho bác sĩ để FE dễ hiển thị
          type: "DOCTOR",
        })),
      ];

      resolve({ errCode: 0, data: result });
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
};
