import mongoose from 'mongoose';
const url = process.env.MONGO_URI;
const dbName = 'TYPESCRIPAPI';
if (!url)
    throw new Error('MONGO_URI not defined');
const connectinstance = async () => {
    try {
        const connect = await mongoose.connect(url, {
            dbName,
        });
        if (connect) {
            console.log(`the server connect to the:${connect.connection.host}`);
        }
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
export default connectinstance;
