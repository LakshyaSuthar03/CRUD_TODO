import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        
    },
    status:{
        type:String,
        enum:["pending","completed"]
    }

})
export default mongoose.model('task', taskSchema);