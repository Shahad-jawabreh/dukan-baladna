const errorHandler=(fun)=>{
    return (req,res,next) => {
        fun(req,res,next).catch((err) => {
            return res.status(400).json({message: err.stack})
        })
    }
}
export default errorHandler