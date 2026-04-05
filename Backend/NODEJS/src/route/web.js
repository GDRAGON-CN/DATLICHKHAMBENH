import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
let router = express.Router();
let initWebRoute = (app) => {
  // router.get("/", homeController.getHomePage);
  // router.get("/about", homeController.getAboutPage);
  // router.get("/crud", homeController.getCRUD);
  // router.post("/post-crud", homeController.postCRUD);
  // router.get("/get-crud", homeController.displayGetCRUD);
  // router.get("/edit-crud", homeController.getEditCRUD);
  // router.post("/put-crud", homeController.putCRUD);
  // router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);
  router.get(
    "/api/get-search-suggestions",
    userController.getSearchSuggestions,
  );

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

  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment,
  );
  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyBookAppointment,
  );

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
  router.get(
    "/api/get-top-specialty-home",
    specialtyController.getTopSpecialtyHome,
  );

  router.post("/api/create-new-clinic", clinicController.createClinic);
  router.get("/api/get-clinic", clinicController.getAllClinic);
  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById,
  );
  router.put("/api/edit-clinic", clinicController.handleEditClinic);
  router.delete("/api/delete-clinic", clinicController.handleDeleteClinic);
  router.get("/api/get-top-clinic-home", clinicController.getTopClinicHome);
  // restAPI
  return app.use("/", router);
};
module.exports = initWebRoute;
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login success
 */
/**
 * @swagger
 * /api/get-all-users:
 *   get:
 *     summary: Get all users or one user
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: ALL
 *     responses:
 *       200:
 *         description: Get users success
 */
/**
 * @swagger
 * /api/create-new-user:
 *   post:
 *     summary: Create new user
 *     tags: [User]
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
 *         description: Create user success
 */
/**
 * @swagger
 * /api/edit-user:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, roleId, positionId, gender]
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
 *                 type: string
 *               phonenumber:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update user success
 */
/**
 * @swagger
 * /api/delete-user:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Delete user success
 */
/**
 * @swagger
 * /api/allcode:
 *   get:
 *     summary: Get all code by type
 *     tags: [System]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: ROLE
 *     responses:
 *       200:
 *         description: Get allcode success
 */
/**
 * @swagger
 * /api/get-search-suggestions:
 *   get:
 *     summary: Get search suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *           example: tim
 *     responses:
 *       200:
 *         description: Get suggestions success
 */
/**
 * @swagger
 * /api/top-doctor-home:
 *   get:
 *     summary: Get top doctors
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Top doctors list
 */
/**
 * @swagger
 * /api/get-all-doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List doctors
 */
/**
 * @swagger
 * /api/save-infor-doctors:
 *   post:
 *     summary: Create or update doctor info
 *     tags: [Doctor]
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
 *     responses:
 *       200:
 *         description: Save success
 */
/**
 * @swagger
 * /api/get-detail-doctor-by-id:
 *   get:
 *     summary: Get doctor detail by id
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor detail
 */
/**
 * @swagger
 * /api/bulk-create-schedule:
 *   post:
 *     summary: Create doctor schedule
 *     tags: [Schedule]
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
 *     responses:
 *       200:
 *         description: Create schedule success
 */
/**
 * @swagger
 * /api/get-schedule-doctor-by-date:
 *   get:
 *     summary: Get doctor schedule by date
 *     tags: [Schedule]
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
 *         description: Schedule data
 */
/**
 * @swagger
 * /api/get-extra-infor-doctor-by-id:
 *   get:
 *     summary: Get extra doctor info
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Extra info
 */
/**
 * @swagger
 * /api/get-profile-infor-doctor-by-id:
 *   get:
 *     summary: Get profile doctor info
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile info
 */
/**
 * @swagger
 * /api/get-list-patient-for-doctor:
 *   get:
 *     summary: Get list patient for doctor
 *     tags: [Doctor]
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
 *         description: Patient list
 */
/**
 * @swagger
 * /api/send-remedy:
 *   post:
 *     summary: Send remedy to patient
 *     tags: [Doctor]
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
 *         description: Send success
 */
/**
 * @swagger
 * /api/patient-book-appointment:
 *   post:
 *     summary: Patient books an appointment
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - doctorId
 *               - timeType
 *               - date
 *               - fullName
 *               - selectedGender
 *               - address
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               timeType:
 *                 type: string
 *                 example: T1
 *               date:
 *                 type: string
 *                 example: 1710000000000
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               selectedGender:
 *                 type: string
 *                 example: M
 *               address:
 *                 type: string
 *                 example: Ha Noi
 *               timeString:
 *                 type: string
 *                 example: 8:00 - 9:00
 *               doctorName:
 *                 type: string
 *                 example: Dr ABC
 *               language:
 *                 type: string
 *                 example: vi
 *     responses:
 *       200:
 *         description: Booking result
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
/**
 * @swagger
 * /api/verify-book-appointment:
 *   post:
 *     summary: Verify appointment via email link
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - doctorId
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc-123-xyz
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Verify result
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
/**
 * @swagger
 * /api/create-new-specialty:
 *   post:
 *     summary: Create new specialty
 *     tags: [Specialty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - imageBase64
 *               - descriptionHTML
 *               - descriptionMarkdown
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tim mạch
 *               imageBase64:
 *                 type: string
 *               descriptionHTML:
 *                 type: string
 *               descriptionMarkdown:
 *                 type: string
 *     responses:
 *       200:
 *         description: Create specialty result
 */
/**
 * @swagger
 * /api/get-specialty:
 *   get:
 *     summary: Get all specialties
 *     tags: [Specialty]
 *     responses:
 *       200:
 *         description: List of specialties
 */
/**
 * @swagger
 * /api/get-detail-specialty-by-id:
 *   get:
 *     summary: Get specialty detail by id and location
 *     tags: [Specialty]
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
 *     responses:
 *       200:
 *         description: Specialty detail
 */
/**
 * @swagger
 * /api/edit-specialty:
 *   put:
 *     summary: Update specialty
 *     tags: [Specialty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - descriptionHTML
 *               - descriptionMarkdown
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
 *         description: Update result
 */
/**
 * @swagger
 * /api/delete-specialty:
 *   delete:
 *     summary: Delete specialty
 *     tags: [Specialty]
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
 *     responses:
 *       200:
 *         description: Delete result
 */
/**
 * @swagger
 * /api/get-top-specialty-home:
 *   get:
 *     summary: Get top specialties sorted by number of doctors
 *     description: Return list of specialties sorted by doctor count (DESC)
 *     tags: [Specialty]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of top specialties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Tim mạch
 *                       image:
 *                         type: string
 *                         example: base64string
 *                       doctorCount:
 *                         type: integer
 *                         example: 25
 */
/**
 * @swagger
 * /api/create-new-clinic:
 *   post:
 *     summary: Create new clinic
 *     tags: [Clinic]
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
 *                 example: Bệnh viện Bạch Mai
 *               address:
 *                 type: string
 *                 example: Hà Nội
 *               imageBase64:
 *                 type: string
 *               descriptionHTML:
 *                 type: string
 *               descriptionMarkdown:
 *                 type: string
 *     responses:
 *       200:
 *         description: Create clinic result
 */
/**
 * @swagger
 * /api/get-clinic:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: List clinics
 */
/**
 * @swagger
 * /api/get-detail-clinic-by-id:
 *   get:
 *     summary: Get clinic detail by id
 *     tags: [Clinic]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Clinic detail
 */
/**
 * @swagger
 * /api/edit-clinic:
 *   put:
 *     summary: Update clinic
 *     tags: [Clinic]
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
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               descriptionHTML:
 *                 type: string
 *               descriptionMarkdown:
 *                 type: string
 *               imageBase64:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update result
 */
/**
 * @swagger
 * /api/delete-clinic:
 *   delete:
 *     summary: Delete clinic
 *     tags: [Clinic]
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
 *     responses:
 *       200:
 *         description: Delete result
 */
/**
 * @swagger
 * /api/get-top-clinic-home:
 *   get:
 *     summary: Get top clinics sorted by doctor count
 *     description: Return list of clinics sorted by number of doctors (DESC)
 *     tags: [Clinic]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of top clinics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Bệnh viện Bạch Mai
 *                       address:
 *                         type: string
 *                         example: Hà Nội
 *                       image:
 *                         type: string
 *                         example: base64string
 *                       doctorCount:
 *                         type: integer
 *                         example: 20
 */
