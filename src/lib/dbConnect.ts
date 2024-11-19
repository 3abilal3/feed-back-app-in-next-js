import mongoose from "mongoose";

type ConnectionObjecct = {
    isConnected?:number
}

const connection:ConnectionObjecct ={ }

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connnected to DB")
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI||'',{})
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connection successful")
    } catch (error) {
        console.log("DB connection failed")
        process.exit(1)
    }
}

export default dbConnect;