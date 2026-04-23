import cron from "node-cron";
import db from "../models/index";
import { Op } from "sequelize";
import moment from "moment";

let initCronJobs = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log(">>> Check & clean expired bookings starting...");

    let fifteenMinutesAgo = moment().subtract(15, "minutes").toDate();

    try {

      let res = await db.Booking.update(
        { statusId: "S4" },
        {
          where: {
            statusId: "S1",
            createdAt: {
              [Op.lt]: fifteenMinutesAgo, 
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
