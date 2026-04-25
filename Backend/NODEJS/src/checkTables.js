const db = require('./models');

const check = async () => {
    try {
        await db.sequelize.authenticate();
        const historyCount = await db.History.count();
        console.log(`Total records in History table: ${historyCount}`);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

check();
