import mongoose from 'mongoose'
const connection=()=>{
mongoose.connect(`mongodb+srv://${process.env.DBUserName}:${process.env.DBPassword}@cluster0.rehgmb9.mongodb.net/dukan-baladna`)
.then(()=>{
    console.log('connct to DB');
}).catch((error)=>{
    console.log(error);
})

}
export default connection