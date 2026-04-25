const doctorService = require('./services/doctorService');

const test = async () => {
    try {
        const data = {
            email: 'abc@gmail.com',
            doctorId: 5,
            patientId: 13,
            timeType: 'T5',
            date: '1776358800000',
            imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            diagnosis: 'Test full flow diagnosis',
            prescription: 'Test full flow prescription'
        };
        
        console.log('Testing sendRemedy with data:', data);
        const res = await doctorService.sendRemedy(data);
        console.log('Result:', res);
        
    } catch (error) {
        console.error('CRITICAL ERROR IN TEST:', error);
    } finally {
        process.exit();
    }
};

test();
