import db from "../models/index";

let getDashboardStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let bookings = await db.Booking.findAll({
                raw: true,
            });

            if (!bookings) bookings = [];

            // Status Map
            // S1: New, S2: Confirmed, S3: Done, S4: Cancelled
            let statusCount = {
                S1: 0,
                S2: 0,
                S3: 0,
                S4: 0,
            };

            let dateMap = {};

            bookings.forEach(item => {
                // Count status
                if (item.statusId && statusCount[item.statusId] !== undefined) {
                    statusCount[item.statusId]++;
                } else if (item.statusId) {
                    statusCount[item.statusId] = 1;
                }

                // Count by date for trends
                if (item.date) {
                    let timestamp = parseInt(item.date, 10);
                    if (!isNaN(timestamp)) {
                        let d = new Date(timestamp);
                        let dateStr = `${("0" + d.getDate()).slice(-2)}/${("0" + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`;
                        if (!dateMap[dateStr]) {
                            dateMap[dateStr] = 0;
                        }
                        dateMap[dateStr]++;
                    }
                }
            });

            // Format dateMap to array for trends, sorted by date if possible
            let trendsArray = Object.keys(dateMap).map(key => {
                let parts = key.split('/');
                return {
                    date: key,
                    count: dateMap[key],
                    timestamp: new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime()
                };
            }).sort((a, b) => a.timestamp - b.timestamp).map(item => ({ date: item.date, count: item.count }));

            resolve({
                errCode: 0,
                data: {
                    statusCount: statusCount,
                    bookingTrends: trendsArray
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
