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
        // --- BẮT ĐẦU LOGIC KIỂM TRA GIỚI HẠN (MAX NUMBER) ---

        // 1. Tìm giới hạn (maxNumber) của ca khám này trong bảng Schedule
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

          // 2. Đếm số lượng người đã đặt lịch thành công (S1 hoặc S2) cho ca này
          let currentBookingCount = await db.Booking.count({
            where: {
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
              statusId: ["S1", "S2"], // Chỉ tính những người đang chờ hoặc đã xác nhận
            },
          });

          // 3. So sánh: Nếu đã đủ người thì chặn luôn
          if (currentBookingCount >= maxNumber) {
            return resolve({
              errCode: 3,
              errMessage:
                "Xin lỗi, khung giờ này đã đủ số lượng bệnh nhân đăng ký tối đa!",
            });
          }
        }
        // --- KẾT THÚC LOGIC KIỂM TRA GIỚI HẠN ---

        // Nếu còn chỗ, tiếp tục thực hiện gửi email và tạo bản ghi
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          receivedEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        // Upsert patient
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

        // Create a booking record
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
};
