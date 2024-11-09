const validation = (schema) => {
    return (req,res,next)=>{
        const method = ['body', 'query', 'headers', 'file']
        const arrayErrors = []
        method.forEach((key)=>{
           if(schema[key]){
            const error = schema[key].validate(req[key],{abortEarly:false})
                    if(error.error){
                    arrayErrors.push(error.error)
                    }
           }
        })

        if(arrayErrors.length > 0){
             return res.status(400).json({message: arrayErrors})
        }
        next();     
    }
}
export default validation