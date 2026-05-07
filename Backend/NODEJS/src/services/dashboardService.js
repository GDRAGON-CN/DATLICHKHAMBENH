import db from "../models/index";

let getDashboardStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let bookings = await db.Booking.findAll({
                raw: true,
            });

            if (!bookings) bookings = [];
            let statusCount = {
                S1: 0,
                S2: 0,
                S3: 0,
                S4: 0,
            };

            bookings.forEach(item => {
                if (item.statusId && statusCount[item.statusId] !== undefined) {
                    statusCount[item.statusId]++;
                } else if (item.statusId) {
                    statusCount[item.statusId] = 1;
                }
            });

            // 1. Thống kê bác sĩ theo chức danh và chuyên khoa
            let doctorInfors = await db.Doctor_Infor.findAll({
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
                ],
                raw: false,
                nest: true
            });

            let doctorsByPosition = {};
            let doctorsBySpecialty = {};

            doctorInfors.forEach(info => {
                if (info.positionData && info.positionData.valueVi) {
                    let pos = info.positionData.valueVi;
                    doctorsByPosition[pos] = (doctorsByPosition[pos] || 0) + 1;
                }
                if (info.specialtyData && info.specialtyData.name) {
                    let spec = info.specialtyData.name;
                    doctorsBySpecialty[spec] = (doctorsBySpecialty[spec] || 0) + 1;
                }
            });

            // 2. Điểm đánh giá trung bình
            let comments = await db.Comment.findAll({
                where: { doctorId: { [db.Sequelize.Op.ne]: null } },
                raw: true
            });
            let totalRating = 0;
            let ratingCount = 0;
            if (comments && comments.length > 0) {
                comments.forEach(c => {
                    if (c.rating && c.rating > 0) {
                        totalRating += c.rating;
                        ratingCount++;
                    }
                });
            }
            let averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

            // 3. Số bài viết cẩm nang
            let handbookCount = await db.Handbook.count();

            // 4. Thống kê số lượng người dùng theo vai trò
            let userCounts = await db.User.findAll({
                attributes: ['roleId', [db.sequelize.fn('COUNT', db.sequelize.col('roleId')), 'count']],
                group: ['roleId'],
                raw: true
            });

            let roleCounts = {
                R1: 0, // Admin
                R2: 0, // Doctor
                R3: 0  // Patient
            };

            userCounts.forEach(item => {
                if (roleCounts[item.roleId] !== undefined) {
                    roleCounts[item.roleId] = item.count;
                }
            });

            resolve({
                errCode: 0,
                data: {
                    statusCount: statusCount,
                    doctorsByPosition: doctorsByPosition,
                    doctorsBySpecialty: doctorsBySpecialty,
                    averageRating: averageRating,
                    handbookCount: handbookCount,
                    roleCounts: roleCounts
                }
            });

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getDashboardStats
};
