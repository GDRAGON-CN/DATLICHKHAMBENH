import db from "../models";
let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Mising parameter",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          image: data.imageBase64,
          address: data.address,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
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
let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: [
            "name",
            "address",
            "descriptionHTML",
            "descriptionMarkdown",
          ],
        });
        if (data) {
          // do soething
          let doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: inputId },
            attributes: ["doctorId"],
          });

          data.doctorClinic = doctorClinic;
        } else {
          data = [];
        }
        resolve({
          errCode: 0,
          errMessage: "OK",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateClinicData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.address ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: data.id },
          raw: false,
        });

        if (clinic) {
          clinic.name = data.name;
          clinic.address = data.address;
          clinic.descriptionHTML = data.descriptionHTML;
          clinic.descriptionMarkdown = data.descriptionMarkdown;

          if (data.imageBase64) {
            clinic.image = data.imageBase64;
          }

          await clinic.save();
          resolve({ errCode: 0, errMessage: "ok" });
        } else {
          resolve({ errCode: 1, errMessage: "Clinic not found" });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteClinic = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: clinicId },
      });
      if (!clinic) {
        resolve({ errCode: 2, errMessage: "Clinic not found" });
      } else {
        await db.Clinic.destroy({
          where: { id: clinicId },
        });
        resolve({ errCode: 0, errMessage: "ok" });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getTopClinicHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinics = await db.Clinic.findAll({
        limit: limitInput,
        attributes: {
          include: [
            [
              db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM Doctor_Infor AS d
                WHERE d.clinicId = Clinic.id
              )`),
              "doctorCount",
            ],
          ],
        },
        order: [
          [db.sequelize.literal("doctorCount"), "DESC"],
          ["createdAt", "DESC"],
        ],
        raw: true,
      });

      resolve({
        errCode: 0,
        data: clinics,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  deleteClinic: deleteClinic,
  updateClinicData: updateClinicData,
  getTopClinicHome: getTopClinicHome,
};
