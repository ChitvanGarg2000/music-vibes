import mongoose from 'mongoose'

const connectDB = async () => {
    const connectionString: string = process.env.DB_CONNECTION_STRING as string;
    
    if (!connectionString) {
        throw new Error('DB_CONNECTION_STRING is not defined in environment variables');
    }
    
    try {
        const connection = await mongoose.connect(connectionString, {dbName: 'MusicVibes'});
        console.log('MongoDB connected successfully');
        return connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
