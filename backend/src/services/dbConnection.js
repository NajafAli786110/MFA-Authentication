import mongoose from "mongoose";

export const DbConnection = async () => {
  const ConnectString = process.env.CONNECTMONGO;

  try {
    const connect = await mongoose.connect(ConnectString);
    if (connect) {
      console.log(
        `Connection Successfully ${connect.connection.name}`
      );
    }
  } catch (error) {
    console.log(`Connection Not Successfully ${error}`);
  }
};
