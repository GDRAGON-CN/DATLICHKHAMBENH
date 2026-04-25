const axios = require('axios');

const testApi = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/get-dashboard-stats');
        console.log('API Response Status:', response.status);
        console.log('API Data Summary:', JSON.stringify({
            errCode: response.data.errCode,
            dataKeys: response.data.data ? Object.keys(response.data.data) : 'N/A',
            bookingTrendsCount: response.data.data?.bookingTrends?.length,
            topDoctorsCount: response.data.data?.topDoctors?.length,
            totalRevenue: response.data.data?.totalRevenue
        }, null, 2));
    } catch (error) {
        console.error('API Test Failed:', error.message);
    }
};

testApi();
