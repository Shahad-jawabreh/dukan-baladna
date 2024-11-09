import express from 'express';
import initApp from './initApp.js';
import 'dotenv/config'
const app = express();

initApp(express,app);

const PORT= process.env.PORT || 4000;
app.listen(PORT ,()=>{
    console.log(`listening on port ${PORT}`);
})