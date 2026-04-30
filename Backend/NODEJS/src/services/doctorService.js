import { raw } from "body-parser";
import db from "../models";
require("dotenv").config();
import _ from "lodash";
import specialty from "../models/specialty";
import emailService from "../services/emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password"],
          include: [
            [
              db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM Bookings AS booking
                WHERE booking.doctorId = User.id AND booking.statusId = 'S3'
              )`),
              "bookingCount",
            ],
          ],
        },
        order: [
          [db.sequelize.literal("bookingCount"), "DESC"],
          ["createdAt", "DESC"],
        ],
        include: [
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Doctor_Infor,
            attributes: ["specialtyId", "positionId"],
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.Doctor_Infor,
            attributes: ["specialtyId", "positionId"],
            include: [
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["name"],
              },
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredFeilds = (inputData) => {
  let arr = [
    "contentHTML",
    "contentMarkdown",
    "doctorId",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "specialtyId",
    "selectedPosition",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!inputData[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFeilds(inputData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        // No longer using Markdown table, logic moved to Doctor_Infor


        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });
        if (doctorInfor) {
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.positionId = inputData.selectedPosition;
          doctorInfor.contentHTML = inputData.contentHTML;
          doctorInfor.contentMarkdown = inputData.contentMarkdown;
          doctorInfor.description = inputData.description;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            positionId: inputData.selectedPosition,
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save info success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
            include: [
              [
                db.sequelize.literal(`(
                  SELECT AVG(rating)
                  FROM Comments AS comment
                  WHERE comment.doctorId = User.id AND comment.isApproved = true
                )`),
                "avgRating",
              ],
              [
                db.sequelize.literal(`(
                  SELECT COUNT(*)
                  FROM Comments AS comment
                  WHERE comment.doctorId = User.id AND comment.isApproved = true
                )`),
                "reviewCount",
              ],
            ],
          },
          include: [
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "positionData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
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

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = parseInt(process.env.MAX_NUMBER_SCHEDULE);
            item.date = String(item.date);
            return item;
          });
        }

        await db.Schedule.destroy({
          where: {
            doctorId: data.doctorId,
            date: String(data.formattedDate),
          },
        });

        if (schedule && schedule.length > 0) {
          await db.Schedule.bulkCreate(schedule);
        }

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
let getScheduleDoctorByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          nest: true,
          raw: false,
        });
        if (!dataSchedule) dataSchedule = [];
        for (let i = 0; i < dataSchedule.length; i++) {
          let count = await db.Booking.count({
            where: {
              doctorId: doctorId,
              date: date,
              timeType: dataSchedule[i].timeType,
              statusId: ["S1", "S2"],
            },
          });

          dataSchedule[i].currentNumber = count;
        }
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: dataSchedule,
        });
      }
    } catch (e) {
      resolve({
        errCode: -1,
        errMessage: "Error from this server",
      });
    }
  });
};
let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorId },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: data,
        });
      }
    } catch (e) {
      resolve({
        errCode: -1,
        errMessage: "Error from this server",
      });
    }
  });
};
let getProfileInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: doctorId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "positionData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Specialty,
                  as: "specialtyData",
                  attributes: ["name"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          errMessage: "OK",
          data: data,
        });
      }
    } catch (e) {
      resolve({
        errCode: -1,
        errMessage: "Error from this server",
      });
    }
  });
};
let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Booking.findAll({
          where: { statusId: "S2", doctorId: doctorId, date: date },
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
          ],
          raw: false,
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
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.timeType ||
        !data.imgBase64 ||
        !data.date
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        // Cập nhật trạng thái lịch hẹn
        let searchDate = String(data.date);
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            date: searchDate,
            statusId: "S2",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();

          // Tạo lịch sử khám bệnh
          try {
            await db.History.create({
              doctorId: data.doctorId,
              patientId: data.patientId,
              description: data.description
                ? data.description
                : "Bác sĩ đã xác nhận khám xong và gửi hóa đơn/đơn thuốc.",
              files: data.imgBase64,
              diagnosis: data.diagnosis,
              prescription: data.prescription,
              bookingId: appointment.id,
            });
          } catch (historyError) {
          }

          // Gửi email kèm file
          try {
            await emailService.sendAttachment(data);
            resolve({
              errCode: 0,
              errMessage: "OK",
            });
          } catch (emailError) {
            resolve({
              errCode: 2,
              errMessage:
                "Error sending email attachment. But status updated and history saved.",
            });
          }
        } else {
          resolve({
            errCode: 3,
            errMessage: "Appointment not found or already processed",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleDoctorByDate: getScheduleDoctorByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileInforDoctorById: getProfileInforDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
};
