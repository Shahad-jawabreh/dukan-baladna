import jwt from 'jsonwebtoken' ;
import userModel from '../../DB/model/user.model.js';
const authorization = (roles=[])=>{
    return async(req,res,next) => {
       
        try {
            const {authorization} = req.headers ;
            if(!authorization){
                return next(new Error("Invalid authorization"))
            }
            if (authorization.startsWith(process.env.brearToken)) {
                const token = authorization.split(process.env.brearToken)[1];
                const decode = jwt.verify(token, process.env.secretKeyToken); 
                const user = await userModel.findById({_id : decode._id}) ;
                if(user){
                    req.user= decode;
                    if(roles.includes(user.role)) {
                        return next();
                    }else {
                        return res.status(400).json({massege : "you cant access this page"})
                    }
                }
            }
            
            return res.json({massege : "invalid token"})
            
        }catch(e){
            return res.json({massege : e.stack})
        }
    }
}
export default authorization