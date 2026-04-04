import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
let router = express.Router();
let initWebRoute = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);

  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Đăng nhập hệ thống
   *     description: Xác thực user bằng email và password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: admin@gmail.com
   *               password:
   *                 type: string
   *                 example: 123456
   *     responses:
   *       200:
   *         description: Login success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                 message:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     email:
   *                       type: string
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     roleId:
   *                       type: string
   */

  /**
   * @swagger
   * /api/get-all-users:
   *   get:
   *     summary: Lấy danh sách user hoặc 1 user theo id
   *     description: Truyền query id=ALL để lấy tất cả user hoặc id cụ thể
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           example: ALL
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                 errMessage:
   *                   type: string
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   */

  /**
   * @swagger
   * /api/create-new-user:
   *   post:
   *     summary: Tạo user mới
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               address:
   *                 type: string
   *               gender:
   *                 type: string
   *                 example: "1"
   *               roleId:
   *                 type: string
   *               phonenumber:
   *                 type: string
   *               positionId:
   *                 type: string
   *               avatar:
   *                 type: string
   *     responses:
   *       200:
   *         description: Create success
   */

  /**
   * @swagger
   * /api/edit-user:
   *   put:
   *     summary: Cập nhật thông tin user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               address:
   *                 type: string
   *               roleId:
   *                 type: string
   *               positionId:
   *                 type: string
   *               gender:
   *                 type: boolean
   *               phonenumber:
   *                 type: string
   *               avatar:
   *                 type: string
   *     responses:
   *       200:
   *         description: Update success
   */

  /**
   * @swagger
   * /api/delete-user:
   *   delete:
   *     summary: Xóa user theo id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       200:
   *         description: Delete success
   */

  /**
   * @swagger
   * /api/allcode:
   *   get:
   *     summary: Lấy danh mục hệ thống (gender, role, position,...)
   *     description: Truyền type qua query để lấy data tương ứng
   *     parameters:
   *       - in: query
   *         name: type
   *         required: true
   *         schema:
   *           type: string
   *           example: GENDER
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   */

  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-infor-doctors", doctorController.postInforDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById,
  );
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate,
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById,
  );
  router.get(
    "/api/get-profile-infor-doctor-by-id",
    doctorController.getProfileInforDoctorById,
  );
  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor,
  );
  router.post("/api/send-remedy", doctorController.sendRemedy);
  /**
   * @swagger
   * /api/top-doctor-home:
   *   get:
   *     summary: Lấy danh sách bác sĩ nổi bật trang home
   *     description: Lấy danh sách doctor role R2 theo limit
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         required: false
   *         description: Số lượng bác sĩ muốn lấy (default = 10)
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-all-doctors:
   *   get:
   *     summary: Lấy tất cả bác sĩ
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/save-infor-doctors:
   *   post:
   *     summary: Lưu thông tin chi tiết bác sĩ
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               doctorId:
   *                 type: integer
   *               contentHTML:
   *                 type: string
   *               contentMarkdown:
   *                 type: string
   *               descriptions:
   *                 type: string
   *               action:
   *                 type: string
   *                 example: CREATE
   *               selectedPrice:
   *                 type: string
   *               selectedPayment:
   *                 type: string
   *               selectedProvince:
   *                 type: string
   *               nameClinic:
   *                 type: string
   *               addressClinic:
   *                 type: string
   *               specialtyId:
   *                 type: integer
   *               note:
   *                 type: string
   *               clinicId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-detail-doctor-by-id:
   *   get:
   *     summary: Lấy chi tiết bác sĩ theo ID
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/bulk-create-schedule:
   *   post:
   *     summary: Tạo lịch khám hàng loạt cho bác sĩ
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               doctorId:
   *                 type: integer
   *               formattedDate:
   *                 type: string
   *               arrSchedule:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     timeType:
   *                       type: string
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-schedule-doctor-by-date:
   *   get:
   *     summary: Lấy lịch bác sĩ theo ngày
   *     parameters:
   *       - in: query
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-extra-infor-doctor-by-id:
   *   get:
   *     summary: Lấy thông tin bổ sung của bác sĩ
   *     parameters:
   *       - in: query
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-profile-infor-doctor-by-id:
   *   get:
   *     summary: Lấy profile bác sĩ
   *     parameters:
   *       - in: query
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-list-patient-for-doctor:
   *   get:
   *     summary: Lấy danh sách bệnh nhân của bác sĩ theo ngày
   *     parameters:
   *       - in: query
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/send-remedy:
   *   post:
   *     summary: Gửi toa thuốc / kết quả khám cho bệnh nhân
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               doctorId:
   *                 type: integer
   *               patientId:
   *                 type: integer
   *               timeType:
   *                 type: string
   *               imgBase64:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   */
  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment,
  );
  /**
   * @swagger
   * /api/patient-book-appointment:
   *   post:
   *     summary: Đặt lịch khám bệnh
   *     description: Tạo booking + gửi email xác nhận (token verify)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: patient@gmail.com
   *               doctorId:
   *                 type: integer
   *               timeType:
   *                 type: string
   *                 example: T1
   *               date:
   *                 type: string
   *                 example: 1690000000000
   *               fullName:
   *                 type: string
   *               selectedGender:
   *                 type: string
   *                 example: M
   *               address:
   *                 type: string
   *               timeString:
   *                 type: string
   *                 example: "08:00 - 09:00"
   *               doctorName:
   *                 type: string
   *               language:
   *                 type: string
   *                 example: vi
   *     responses:
   *       200:
   *         description: Booking success / fail (max slot / missing field)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 errMessage:
   *                   type: string
   *                   example: Save info patient succeed
   */
  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyBookAppointment,
  );
  /**
   * @swagger
   * /api/verify-book-appointment:
   *   post:
   *     summary: Xác nhận lịch hẹn (verify booking)
   *     description: Xác nhận token từ email → chuyển status S1 → S2
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *                 example: "uuid-token-here"
   *               doctorId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Verify kết quả
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errCode:
   *                   type: integer
   *                   example: 0
   *                 errMessage:
   *                   type: string
   *                   example: Update the appointment succeed
   */
  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.get("/api/get-specialty", specialtyController.getAllSpecialty);
  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById,
  );
  router.put("/api/edit-specialty", specialtyController.handleEditSpecialty);
  router.delete(
    "/api/delete-specialty",
    specialtyController.handleDeleteSpecialty,
  );
  /**
   * @swagger
   * /api/create-new-specialty:
   *   post:
   *     summary: Tạo chuyên khoa mới
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               imageBase64:
   *                 type: string
   *               descriptionHTML:
   *                 type: string
   *               descriptionMarkdown:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   */
  /**
   * @swagger
   * /api/create-new-specialty:
   *   post:
   *     summary: Tạo chuyên khoa mới
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               imageBase64:
   *                 type: string
   *               descriptionHTML:
   *                 type: string
   *               descriptionMarkdown:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   */

  /**
   * @swagger
   * /api/get-detail-specialty-by-id:
   *   get:
   *     summary: Lấy chi tiết chuyên khoa theo ID + filter bác sĩ theo vị trí
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: location
   *         required: true
   *         schema:
   *           type: string
   *           example: ALL
   *         description: ALL hoặc provinceId cụ thể
   *     responses:
   *       200:
   *         description: OK
   */
  /**
   * @swagger
   * /api/edit-specialty:
   *   put:
   *     summary: Cập nhật chuyên khoa
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *               name:
   *                 type: string
   *               descriptionHTML:
   *                 type: string
   *               descriptionMarkdown:
   *                 type: string
   *               imageBase64:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   */
  /**
   * @swagger
   * /api/delete-specialty:
   *   delete:
   *     summary: Xóa chuyên khoa theo ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *     responses:
   *       200:
   *         description: OK
   */
  router.post("/api/create-new-clinic", clinicController.createClinic);
  /**
   * @swagger
   * /api/create-new-clinic:
   *   post:
   *     summary: Tạo mới phòng khám
   *     description: Thêm một clinic mới vào hệ thống
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - address
   *               - imageBase64
   *               - descriptionHTML
   *               - descriptionMarkdown
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Phòng khám ABC"
   *               address:
   *                 type: string
   *                 example: "Hà Nội"
   *               imageBase64:
   *                 type: string
   *               descriptionHTML:
   *                 type: string
   *               descriptionMarkdown:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   */
  router.get("/api/get-clinic", clinicController.getAllClinic);
  /**
   * @swagger
   * /api/get-clinic:
   *   get:
   *     summary: Lấy danh sách tất cả phòng khám
   *     responses:
   *       200:
   *         description: OK
   */
  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById,
  );
  /**
   * @swagger
   * /api/get-detail-clinic-by-id:
   *   get:
   *     summary: Lấy chi tiết phòng khám theo id
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       200:
   *         description: OK
   */
  router.put("/api/edit-clinic", clinicController.handleEditClinic);
  /**
   * @swagger
   * /api/edit-clinic:
   *   put:
   *     summary: Cập nhật thông tin phòng khám
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - name
   *               - address
   *               - descriptionHTML
   *               - descriptionMarkdown
   *             properties:
   *               id:
   *                 type: integer
   *                 example: 1
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               imageBase64:
   *                 type: string
   *               descriptionHTML:
   *                 type: string
   *               descriptionMarkdown:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   */
  router.delete("/api/delete-clinic", clinicController.handleDeleteClinic);
  /**
   * @swagger
   * /api/delete-clinic:
   *   delete:
   *     summary: Xoá phòng khám theo id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       200:
   *         description: OK
   */
  // restAPI
  return app.use("/", router);
};
module.exports = initWebRoute;
