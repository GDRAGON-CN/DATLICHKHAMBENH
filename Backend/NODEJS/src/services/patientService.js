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

      // 1. Tìm hoặc Tạo người dùng (để lấy patientId)
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

      // 2. KIỂM TRA CHỐNG SPAM: Check xem bệnh nhân này đã có lịch S1 nào với bác sĩ này chưa
      let existingBooking = await db.Booking.findOne({
        where: {
          patientId: patientId,
          doctorId: data.doctorId,
          statusId: "S1", // Đang chờ xác nhận
        },
      });

      if (existingBooking) {
        return resolve({
          errCode: 4,
          errMessage:
            "Bạn đã có một lịch hẹn đang chờ xác nhận với bác sĩ này. Vui lòng kiểm tra email!",
        });
      }

      // 3. KIỂM TRA SỐ LƯỢNG TỐI ĐA (Nên đếm cả S1 và S2 để tránh spam giữ chỗ)
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
            statusId: ["S1", "S2"], // Đếm cả lịch đang chờ xác nhận
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

      // 4. NẾU MỌI THỨ OK -> GỬI EMAIL VÀ LƯU BOOKING
      let token = uuidv4();
      await emailService.sendSimpleEmail({
        receivedEmail: data.email,
        patientName: data.fullName,
        time: data.timeString,
        doctorName: data.doctorName,
        language: data.language,
        redirectLink: buildUrlEmail(data.doctorId, token),
      });

      // Tạo booking mới
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
// thêm
let postRequestMagicLink = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) return resolve({ errCode: 1, errMessage: "Missing email" });

      // Tìm lịch hẹn mới nhất của email này để lấy cái token có sẵn
      let lastBooking = await db.Booking.findOne({
        include: [
          { model: db.User, as: "patientData", where: { email: email } },
        ],
        order: [["createdAt", "DESC"]],
        raw: true,
      });

      if (!lastBooking)
        return resolve({
          errCode: 2,
          errMessage: "Email chưa có lịch hẹn nào!",
        });

      // Gửi mail dùng chính cái token cũ của họ
      await emailService.sendAccessLinkEmail({
        receivedEmail: email,
        redirectLink: `${process.env.URL_REACT}/verify-booking-access?token=${lastBooking.token}&email=${email}`,
      });

      resolve({
        errCode: 0,
        errMessage: "Link đã được gửi vào Email của bạn!",
      });
    } catch (e) {
      reject(e);
    }
  });
};
let postVerifyMagicLink = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.email) {
        resolve({ errCode: 1, errMessage: "Missing parameter!" });
      } else {
        // Logic xác thực: Tìm booking có token và email khớp nhau
        let appointment = await db.Booking.findOne({
          where: {
            token: data.token,
            statusId: ["S1", "S2"], // Chỉ cho phép xem lịch đang chờ hoặc đã xác nhận
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              where: { email: data.email },
              attributes: [],
            },
          ],
          raw: false,
        });

        if (appointment) {
          // Nếu khớp, lấy toàn bộ danh sách lịch của bệnh nhân đó
          let bookings = await getListBookingByPatient(data.email);
          resolve(bookings);
        } else {
          resolve({
            errCode: 2,
            errMessage: "Link truy cập không hợp lệ hoặc đã hết hạn!",
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
  // thêm
  postRequestMagicLink: postRequestMagicLink,
  postVerifyMagicLink: postVerifyMagicLink,
};
