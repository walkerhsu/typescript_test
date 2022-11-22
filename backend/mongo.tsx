import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';

export default {
    connect: () => {
        dotenv.config();
        if (!process.env.MONGO_URL) {
            console.error("Missing MONGO_URL!!!");
            process.exit(1);
        }

        mongoose
        .connect(`${process.env.MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }as mongoose.ConnectOptions)
        .then((res) => console.log("mongo db connection created"));
        mongoose.connection.on('error',
        console.error.bind(console, 'connection error:'));
    }
};