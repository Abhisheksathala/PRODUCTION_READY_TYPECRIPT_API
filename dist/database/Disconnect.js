import mongoose from 'mongoose';
const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
};
export const disconnectFromDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log('DISCONNECTED FROM THE DATABASE SUCCESSFULLY', {
            uri: process.env.MONGO_URI,
            options: clientOptions,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error disconnecting from database:', error.message);
            throw error;
        }
        else {
            console.error('Unknown error disconnecting from database:', error);
            throw new Error('Unknown error during database disconnect');
        }
    }
};
