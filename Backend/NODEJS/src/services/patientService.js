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
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
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
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
            },
            defaults: {
              statusId: "S1",
              token: token,
            },
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save info patient succeed",
        });
      }
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

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  cancelBooking: cancelBooking,
  getListBookingByPatient: getListBookingByPatient,
};
