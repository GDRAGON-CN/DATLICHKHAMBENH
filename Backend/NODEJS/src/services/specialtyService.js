import db from "../models";
let createSpecialty = (data) => {
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
          erMessage: "Mising parameter",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
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
let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
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
let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ["name", "descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }

          data.doctorSpecialty = doctorSpecialty;
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
let updateSpecialtyData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      } else {
        console.log(">>> check data update: ", data);
        let specialty = await db.Specialty.findOne({
          where: { id: data.id },
          raw: false,
        });

        if (specialty) {
          specialty.name = data.name;
          specialty.descriptionHTML = data.descriptionHTML;
          specialty.descriptionMarkdown = data.descriptionMarkdown;
          if (data.imageBase64) {
            specialty.image = data.imageBase64;
          }
          await specialty.save();
          resolve({
            errCode: 0,
            errMessage: "Update specialty succeed!",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "Specialty not found!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteSpecialty = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: specialtyId },
      });
      if (!specialty) {
        resolve({
          errCode: 2,
          errMessage: `The specialty isn't exist`,
        });
      } else {
        await db.Specialty.destroy({
          where: { id: specialtyId },
        });
        resolve({
          errCode: 0,
          errMessage: "The specialty is deleted",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getTopSpecialtyHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialties = await db.Specialty.findAll({
        limit: limitInput,
        attributes: {
          include: [
            [
              db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM Doctor_Infor AS d
                WHERE d.specialtyId = Specialty.id
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
      if (specialties && specialties.length > 0) {
        specialties = specialties.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image, "base64").toString("binary");
          }
          return item;
        });
      }

      resolve({
        errCode: 0,
        data: specialties,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  deleteSpecialty: deleteSpecialty,
  updateSpecialtyData: updateSpecialtyData,
  getTopSpecialtyHome: getTopSpecialtyHome,
};
