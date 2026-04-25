const db = require('./models');

const test = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection established.');
        
        // Create a large string (approx 2MB)
        const largeString = 'A'.repeat(2 * 1024 * 1024);
        
        console.log('Attempting to create history with 2MB string...');
        const newHistory = await db.History.create({
            doctorId: 5,
            patientId: 13,
            description: 'Test large string',
            diagnosis: 'Test large diagnosis',
            prescription: 'Test large prescription',
            files: largeString,
            bookingId: 10
        });
        
        console.log('History created successfully:', newHistory.id);
        
    } catch (error) {
        console.error('FAILED TO CREATE LARGE HISTORY:', error);
    } finally {
        process.exit();
    }
};

test();
