import multer from 'multer'
export const fileType ={
    image : ['image/jpeg','image/jpg','image/png','image/svg+xml','image/gif'],
    pdf: ['application/pdf']
}
const fileUpload = (customTypes= [])=>{
    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {
        if(customTypes.includes(file.mimetype)){
            cb(null,true)  // Accept file
        }else{
            cb("invalid format",false)  // reject file
        }
    }
    const upload = multer({ fileFilter,storage })
    return upload; 
}
export default fileUpload

