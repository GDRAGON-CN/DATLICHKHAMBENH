import { where } from "sequelize";
import db from "../models/index";
import { defaults } from "lodash";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      let [user, created] = await db.User.findOrCreate({
        where: { email: data.email },
        defaults: {
          email: data.email,
          roleId: "R3",
          gender: data.selectedGender,
          address: data.address,
          firstName: data.fullName,
        },
      });

      let patientId = user.id;

      let existingBooking = await db.Booking.findOne({
        where: {
          patientId: patientId,
          doctorId: data.doctorId,
          statusId: "S1", 
        },
      });

      if (existingBooking) {
        return resolve({
          errCode: 4,
          errMessage:
            "Bạn đã có một lịch hẹn đang chờ xác nhận với bác sĩ này. Vui lòng kiểm tra email!",
        });
      }

      let schedule = await db.Schedule.findOne({
        where: {
          doctorId: data.doctorId,
          date: data.date,
          timeType: data.timeType,
        },
        raw: true,
      });

      if (schedule) {
        let maxNumber = schedule.maxNumber;
        let currentBookingCount = await db.Booking.count({
          where: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType,
            statusId: ["S1", "S2"],
          },
        });

        if (currentBookingCount >= maxNumber) {
          return resolve({
            errCode: 3,
            errMessage:
              "Xin lỗi, khung giờ này đã đủ số lượng bệnh nhân đăng ký tối đa!",
          });
        }
      }

      let token = uuidv4();
      await emailService.sendSimpleEmail({
        receivedEmail: data.email,
        patientName: data.fullName,
        time: data.timeString,
        doctorName: data.doctorName,
        language: data.language,
        redirectLink: buildUrlEmail(data.doctorId, token),
      });

      await db.Booking.create({
        statusId: "S1",
        doctorId: data.doctorId,
        patientId: patientId,
        date: data.date,
        timeType: data.timeType,
        token: token,
      });

      resolve({
        errCode: 0,
        errMessage: "Save info patient succeed",
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getListBookingByPatient = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) {
        resolve({ errCode: 1, errMessage: "Missing email!" });
      } else {
        let user = await db.User.findOne({
          where: { email: email },
          attributes: ["id"],
        });

        if (user) {
          let data = await db.Booking.findAll({
            where: { patientId: user.id },
            include: [
              {
                model: db.User,
                as: "doctorData",
                attributes: ["firstName", "lastName"],
              },
              {
                model: db.Allcode,
                as: "timeTypeDataPatient",
                attributes: ["valueVi", "valueEn"],
              },
            ],
            raw: true,
            nest: true,
          });
          resolve({ errCode: 0, data: data });
        } else {
          resolve({ errCode: 0, data: [] });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let cancelBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(">>> Check data từ React gửi qua:", data);
      if (!data.patientId || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            patientId: data.patientId,
            doctorId: data.doctorId,
            timeType: data.timeType,
            date: data.date,
            statusId: ["S1", "S2"],
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S4";
          await appointment.save();

          resolve({
            errCode: 0,
            errMessage: "Hủy lịch hẹn thành công!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Lịch hẹn không tồn tại hoặc đã được xử lý trước đó.",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or not exist",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updatePatientProfile = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.email) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id, email: data.email },
          raw: false,
        });
        if (user) {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;
          user.phonenumber = data.phonenumber;
          user.gender = data.gender;
          if (data.avatar) {
            user.image = data.avatar;
          }
          await user.save();
          resolve({
            errCode: 0,
            errMessage: "Update patient profile succeed",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "User not found",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getMedicalHistoryByPatient = (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.History.findAll({
          where: { patientId: patientId },
          include: [
            {
              model: db.User,
              as: "doctorDataHistory",
              attributes: ["firstName", "lastName", "image"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  cancelBooking: cancelBooking,
  getListBookingByPatient: getListBookingByPatient,
  updatePatientProfile: updatePatientProfile,
  getMedicalHistoryByPatient: getMedicalHistoryByPatient,
};
