import mongoose from "mongoose";
import { dbConfig } from "./db.config";

const connectDB = async () => {
  try {
    const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
    //@ts-ignore
    const connect = await mongoose.connect(uri, {
      // @ts-ignore
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    //@ts-ignore
    console.log(`MongoDB Connected ${connect.connection.host}`);
  } catch (error) {
    //@ts-ignore
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
