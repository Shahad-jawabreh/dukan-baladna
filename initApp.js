import connection from './DB/connection.js';
import userRouter from './src/modules/user/user.router.js'
import categoryRouter from './src/modules/category/category.router.js'
import subCategory from './src/modules/subcategory/subCategory.router.js'
import authRouter from './src/modules/auth/auth.router.js'
import productRouter from './src/modules/product/product.router.js'
import cartRouter from './src/modules/cart/cart.router.js'
import couponRouter from './src/modules/coupon/coupon.router.js'
import orderRouter from './src/modules/order/order.router.js'
import locationRouter from './src/modules/location/location.router.js'
import cors from 'cors'
const initApp=(express,app)=>{
    
    app.use(cors());
    app.use(express.json());
    connection();
    app.get('/', (req, res)=>{return res.json({massege : "Welcome!"});});
    app.use('/auth',authRouter);
    app.use('/coupon',couponRouter);
    app.use('/user',userRouter);
    app.use('/category', categoryRouter);
    app.use('/subCategories', subCategory);
    app.use('/order',orderRouter);
    app.use('/product', productRouter);
    app.use('/location', locationRouter);
    app.use('/cart', cartRouter);
    app.use('*',(req,res)=>{return res.status(404).json({massege : "this page not found"})})
    app.use((err,req,res,next)=>{
        if(err){
            return res.json({massage : err.stack})
        }
    })
}
export default initApp