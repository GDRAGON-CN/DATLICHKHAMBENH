const db = require('./models');

const test = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection established.');
        
        const newHistory = await db.History.create({
            doctorId: 5, // Sample doctor
            patientId: 12, // Sample patient
            description: 'Test manual creation',
            diagnosis: 'Test diagnosis',
            prescription: 'Test prescription',
            files: 'test_base64_string',
            bookingId: 1
        });
        
        console.log('History created successfully:', newHistory.id);
        
    } catch (error) {
        console.error('FAILED TO CREATE HISTORY:', error);
    } finally {
        process.exit();
    }
};

test();
