import cron from "node-cron";
import db from "../models/index";
import { Op } from "sequelize";
import moment from "moment";

let initCronJobs = () => {
  // Chạy mỗi 5 phút một lần để quét rác
  // Link tham khảo cú pháp: https://www.npmjs.com/package/node-cron
  cron.schedule("*/5 * * * *", async () => {
    console.log(">>> Check & clean expired bookings starting...");

    // Mốc thời gian: Hiện tại trừ đi 15 phút
    let fifteenMinutesAgo = moment().subtract(15, "minutes").toDate();

    try {
      // Tìm và cập nhật tất cả lịch S1 đã quá 15p sang S4 (Hủy)
      let res = await db.Booking.update(
        { statusId: "S4" },
        {
          where: {
            statusId: "S1",
            createdAt: {
              [Op.lt]: fifteenMinutesAgo, // Nhỏ hơn mốc 15p trước = Đã quá hạn
            },
          },
        },
      );

      if (res[0] > 0) {
        console.log(`>>> Successfully canceled ${res[0]} expired bookings.`);
      }
    } catch (error) {
      console.error("Error in Cron Job:", error);
    }
  });
};

module.exports = {
  initCronJobs: initCronJobs,
};
