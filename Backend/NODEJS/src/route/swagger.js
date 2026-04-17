/**
 * @swagger
 * tags:
 *   - name: User
 *     description: API quản lý người dùng & xác thực
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Kết quả đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: ok
 *                 user:
 *                   type: object
 */

/**
 * @swagger
 * /api/get-all-users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: ALL
 *         description: ALL để lấy tất cả hoặc truyền id cụ thể
 *     responses:
 *       200:
 *         description: Danh sách user
 */

/**
 * @swagger
 * /api/create-new-user:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
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
 *                 example: R1
 *               phonenumber:
 *                 type: string
 *               positionId:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 description: base64 image
 *     responses:
 *       200:
 *         description: Kết quả tạo user
 */

/**
 * @swagger
 * /api/edit-user:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - roleId
 *               - positionId
 *               - gender
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
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
 *         description: Kết quả cập nhật
 */

/**
 * @swagger
 * /api/delete-user:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [User]
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
 *         description: Kết quả xóa user
 */

/**
 * @swagger
 * /api/allcode:
 *   get:
 *     summary: Lấy dữ liệu Allcode (gender, role, position...)
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         example: GENDER
 *     responses:
 *       200:
 *         description: Danh sách allcode
 */

/**
 * @swagger
 * /api/get-search-suggestions:
 *   get:
 *     summary: Gợi ý tìm kiếm (bác sĩ, chuyên khoa, phòng khám)
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         example: tim
 *     responses:
 *       200:
 *         description: Danh sách gợi ý
 */
/**
 * @swagger
 * /api/get-all-booking-for-admin:
 *   get:
 *     summary: Lấy danh sách lịch đặt khám theo ngày (Admin)
 *     description: API dùng cho admin để lấy toàn bộ danh sách booking theo ngày, bao gồm thông tin bệnh nhân, bác sĩ, khung giờ và trạng thái lịch hẹn.
 *     tags:
 *       - Booking Management
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Ngày cần lấy danh sách booking (format YYYY-MM-DD hoặc string theo hệ thống)
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: number
 *                   example: 0
 *                 data:
 *                   type: array
 *                   description: Danh sách booking theo ngày
 *       400:
 *         description: Thiếu tham số ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: number
 *                   example: 1
 *                 errMessage:
 *                   type: string
 *                   example: Thiếu tham số ngày tháng!
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /api/update-booking-status:
 *   post:
 *     summary: Cập nhật trạng thái lịch hẹn (Admin / Doctor)
 *     description: "Cho phép admin hoặc bác sĩ cập nhật trạng thái của một booking (ví dụ: S1, S2, S3,...)"
 *     tags:
 *       - Booking Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - statusId
 *             properties:
 *               id:
 *                 type: number
 *                 example: 12
 *                 description: ID của booking cần cập nhật
 *               statusId:
 *                 type: string
 *                 example: S2
 *                 description: "Trạng thái mới của booking (S1: chờ xác nhận, S2: đã xác nhận, S3: hoàn tất,...)"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: number
 *                   example: 0
 *                 errMessage:
 *                   type: string
 *                   example: ok
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: number
 *                   example: 1
 *                 errMessage:
 *                   type: string
 *                   example: Thiếu ID hoặc Status!
 *       404:
 *         description: Không tìm thấy booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errCode:
 *                   type: number
 *                   example: 2
 *                 errMessage:
 *                   type: string
 *                   example: Lịch hẹn không tồn tại
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * tags:
 *   - name: Doctor
 *     description: API quản lý bác sĩ
 */

/**
 * @swagger
 * /api/top-doctor-home:
 *   get:
 *     summary: Lấy danh sách bác sĩ nổi bật
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         example: 10
 *     responses:
 *       200:
 *         description: Danh sách bác sĩ
 */

/**
 * @swagger
 * /api/get-all-doctors:
 *   get:
 *     summary: Lấy tất cả bác sĩ
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Danh sách tất cả bác sĩ
 */

/**
 * @swagger
 * /api/save-infor-doctors:
 *   post:
 *     summary: Tạo hoặc cập nhật thông tin bác sĩ
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - contentHTML
 *               - contentMarkdown
 *               - action
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 example: 1
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
 *               specialtyId:
 *                 type: integer
 *               clinicId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Kết quả lưu thông tin
 */

/**
 * @swagger
 * /api/get-detail-doctor-by-id:
 *   get:
 *     summary: Lấy chi tiết bác sĩ theo ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Thông tin chi tiết bác sĩ
 */

/**
 * @swagger
 * /api/bulk-create-schedule:
 *   post:
 *     summary: Tạo lịch khám hàng loạt cho bác sĩ
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - formattedDate
 *               - arrSchedule
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               formattedDate:
 *                 type: string
 *                 example: "1712505600000"
 *               arrSchedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timeType:
 *                       type: string
 *                       example: T1
 *                     date:
 *                       type: string
 *                       example: "1712505600000"
 *     responses:
 *       200:
 *         description: Kết quả tạo lịch
 */

/**
 * @swagger
 * /api/get-schedule-doctor-by-date:
 *   get:
 *     summary: Lấy lịch khám theo ngày của bác sĩ
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
 *         example: "1712505600000"
 *     responses:
 *       200:
 *         description: Danh sách lịch khám
 */

/**
 * @swagger
 * /api/get-extra-infor-doctor-by-id:
 *   get:
 *     summary: Lấy thông tin bổ sung của bác sĩ
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin bổ sung
 */

/**
 * @swagger
 * /api/get-profile-infor-doctor-by-id:
 *   get:
 *     summary: Lấy profile đầy đủ của bác sĩ
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile bác sĩ
 */

/**
 * @swagger
 * /api/get-list-patient-for-doctor:
 *   get:
 *     summary: Lấy danh sách bệnh nhân theo bác sĩ và ngày
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
 *         description: Danh sách bệnh nhân
 */

/**
 * @swagger
 * /api/send-remedy:
 *   post:
 *     summary: Gửi đơn thuốc và hoàn tất khám
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - doctorId
 *               - patientId
 *               - timeType
 *               - imgBase64
 *             properties:
 *               email:
 *                 type: string
 *                 example: patient@gmail.com
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               patientId:
 *                 type: integer
 *                 example: 2
 *               timeType:
 *                 type: string
 *                 example: T1
 *               imgBase64:
 *                 type: string
 *                 description: Ảnh đơn thuốc dạng base64
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kết quả gửi đơn thuốc
 */
/**
 * @swagger
 * tags:
 *   - name: Patient
 *     description: API đặt lịch & quản lý lịch khám
 */

/**
 * @swagger
 * /api/patient-book-appointment:
 *   post:
 *     summary: Đặt lịch khám bệnh
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
 *                 example: patient@gmail.com
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               timeType:
 *                 type: string
 *                 example: T1
 *               date:
 *                 type: string
 *                 example: "1712505600000"
 *               fullName:
 *                 type: string
 *               selectedGender:
 *                 type: string
 *                 example: M
 *               address:
 *                 type: string
 *               timeString:
 *                 type: string
 *               doctorName:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kết quả đặt lịch
 */

/**
 * @swagger
 * /api/verify-book-appointment:
 *   post:
 *     summary: Xác nhận lịch khám qua email (verify token)
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
 *               doctorId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Kết quả xác nhận lịch
 */
/**
 * @swagger
 * /api/request-magic-link:
 *   post:
 *     summary: Gửi link truy cập nhanh (Magic Link) qua email
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "patient@example.com"
 *     responses:
 *       200:
 *         description: Trạng thái gửi email thành công hoặc thất bại
 */
/**
 * @swagger
 * /api/verify-magic-link:
 *   post:
 *     summary: Xác thực token từ email và trả về danh sách lịch khám
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - email
 *             properties:
 *               token:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trả về danh sách các booking của bệnh nhân nếu token hợp lệ
 */
/**
 * @swagger
 * /api/patient-cancel-booking:
 *   post:
 *     summary: Hủy lịch khám
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - timeType
 *               - date
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 2
 *               timeType:
 *                 type: string
 *                 example: T1
 *               date:
 *                 type: string
 *                 example: "1712505600000"
 *     responses:
 *       200:
 *         description: Kết quả hủy lịch
 */

/**
 * @swagger
 * /api/get-list-booking-by-patient:
 *   get:
 *     summary: Lấy danh sách lịch khám của bệnh nhân
 *     tags: [Patient]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: patient@gmail.com
 *     responses:
 *       200:
 *         description: Danh sách lịch đã đặt
 */
/**
 * @swagger
 * tags:
 *   - name: Specialty
 *     description: API quản lý chuyên khoa
 */

/**
 * @swagger
 * /api/create-new-specialty:
 *   post:
 *     summary: Tạo chuyên khoa mới
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
 *                 description: Ảnh base64
 *               descriptionHTML:
 *                 type: string
 *               descriptionMarkdown:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kết quả tạo chuyên khoa
 */

/**
 * @swagger
 * /api/get-specialty:
 *   get:
 *     summary: Lấy danh sách tất cả chuyên khoa
 *     tags: [Specialty]
 *     responses:
 *       200:
 *         description: Danh sách chuyên khoa
 */

/**
 * @swagger
 * /api/get-detail-specialty-by-id:
 *   get:
 *     summary: Lấy chi tiết chuyên khoa theo ID và location
 *     tags: [Specialty]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         example: ALL
 *         description: ALL hoặc provinceId
 *     responses:
 *       200:
 *         description: Thông tin chi tiết chuyên khoa
 */

/**
 * @swagger
 * /api/edit-specialty:
 *   put:
 *     summary: Cập nhật chuyên khoa
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
 *                 example: 1
 *               name:
 *                 type: string
 *               descriptionHTML:
 *                 type: string
 *               descriptionMarkdown:
 *                 type: string
 *               imageBase64:
 *                 type: string
 *                 description: optional
 *     responses:
 *       200:
 *         description: Kết quả cập nhật
 */

/**
 * @swagger
 * /api/delete-specialty:
 *   delete:
 *     summary: Xóa chuyên khoa
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Kết quả xóa chuyên khoa
 */

/**
 * @swagger
 * /api/get-top-specialty-home:
 *   get:
 *     summary: Lấy top chuyên khoa (theo số lượng bác sĩ)
 *     tags: [Specialty]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Danh sách top chuyên khoa
 */
/**
 * @swagger
 * tags:
 *   - name: Clinic
 *     description: API quản lý phòng khám
 */

/**
 * @swagger
 * /api/create-new-clinic:
 *   post:
 *     summary: Tạo phòng khám mới
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
 *                 example: Phòng khám Đa khoa ABC
 *               address:
 *                 type: string
 *               imageBase64:
 *                 type: string
 *                 description: Ảnh base64
 *               descriptionHTML:
 *                 type: string
 *               descriptionMarkdown:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kết quả tạo clinic
 */

/**
 * @swagger
 * /api/get-clinic:
 *   get:
 *     summary: Lấy danh sách tất cả phòng khám
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: Danh sách clinic
 */

/**
 * @swagger
 * /api/get-detail-clinic-by-id:
 *   get:
 *     summary: Lấy chi tiết phòng khám theo ID
 *     tags: [Clinic]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Thông tin chi tiết clinic
 */

/**
 * @swagger
 * /api/edit-clinic:
 *   put:
 *     summary: Cập nhật thông tin phòng khám
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
 *                 example: 1
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
 *                 description: optional
 *     responses:
 *       200:
 *         description: Kết quả cập nhật
 */

/**
 * @swagger
 * /api/delete-clinic:
 *   delete:
 *     summary: Xóa phòng khám
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Kết quả xóa clinic
 */

/**
 * @swagger
 * /api/get-top-clinic-home:
 *   get:
 *     summary: Lấy top phòng khám (theo số lượng bác sĩ)
 *     tags: [Clinic]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Danh sách top clinic
 */
