import dashboardService from "../services/dashboardService";

let getDashboardStats = async (req, res) => {
    try {
        let stats = await dashboardService.getDashboardStats();
        return res.status(200).json(stats);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
}

module.exports = {
    getDashboardStats: getDashboardStats
};
