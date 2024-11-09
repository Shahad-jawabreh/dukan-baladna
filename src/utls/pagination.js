export const pagination = (page , limit ) => {
   if(page <= 0 || !page) {
    page = 1
 }
 if(!limit || limit <= 0){
    limit = 1
 }
 const skip = parseInt(limit) * (parseInt(page) - 1) ;
return {skip, limit}
}