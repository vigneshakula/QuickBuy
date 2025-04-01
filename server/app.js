const express = require("express");
const mongoose = require("mongoose");
const {nanoid} = require("nanoid");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const cors = require("cors");

const app = express();
const uri = "mongodb+srv://vigneshakula230:vignesh230@cluster0.4qfmq.mongodb.net/QuickBuy?retryWrites=true&w=majority&appName=Cluster0";

//importing middlewares
const  TokenAuthentication  = require("./middlewares/TokenAuthentication");


let db = null;

app.use(express.json());

  
  app.use(cors());
//starting the server
const startServer = async () => {
    try {
        //connecting the database
        await mongoose.connect(uri);
        db = mongoose.connection.db;
        console.log("Database connected successfully");
        app.listen(8000, () => {
            console.log(`Server running on http://localhost:8000`);
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
};
startServer();


//Sign Up api
app.post("/register",async (req,res)=>{
    try{
        const data = req.body;
        const {username} = data;
        const users = db.collection("users");
        const userPresent = await users.findOne({username:username});
        if (userPresent!==null){
            res.status(403).json({"msg":"username already exits"});
        }
        else{
            const {password,address,email} = data;
            const hashPassword = await argon2.hash(password);
            const cart = db.collection("cart");
            const userid = nanoid();
            const cartid = nanoid();
            try{
                await users.insertOne({
                    userid:userid,
                    cartid:cartid,
                    username:username,
                    password:hashPassword,
                    address:address,
                    role:"customer",
                    email:email
                });
                await cart.insertOne({
                    userid:userid,
                    cartid:cartid,
                    products:[],
                    totalAmount:0
                });
                res.status(200).json({"msg":"Account created succesfully"});
            }
            catch(e){
                res.status(500).json({"msg":"something went wrong"});        
            }
        }
    }
    catch(e){
        res.status(500).send("Server error");
    }
});


//login api
app.post("/login",async (req,res)=>{
    const users = db.collection("users");
    const {username,password} = req.body;
    try{
        const user = await  users.findOne({username:username});
        if (user){
            const hashedPassword = user.password;
            if (await argon2.verify(hashedPassword,password)){
                const {userid} = user;
                const {role} = user;
                const jwtToken = await jwt.sign({
                    "username":username,
                    "userid":userid,
                    "role":role
                },"QuickBuy");
                res.status(200).json({"jwtToken":jwtToken,"role":role});
            }
            else{
                res.status(401).json({"msg":"password does not matched"});
            }
        }
        else{
            res.status(401).json({"msg":"username not found"});
        }
    }
    catch(e){
        res.status(500).json({"msg":"something went wrong"});
    }
});



//for getting all products
app.get("/products",TokenAuthentication,async (req,res)=>{
    try{
        const products = db.collection("products");
        const allProducts = await products.find({},{description:0}).toArray();
        res.status(200).json({"products":allProducts});
    }
    catch(e){
        res.status(500).json({"msg":"Something went wrong"});
    }
});

//for getting a product
app.get("/product/:id",TokenAuthentication,async (req,res)=>{
    try{
        const {id} = req.params;
        const products = db.collection("products");
        const product= await products.findOne({productid:parseInt(id)});
        res.status(200).json({"product":product});
    }
    catch(e){
        res.status(500).json({"msg":"Something went wrong"});
    }
});



//cart details
app.get("/cart",TokenAuthentication,async (req,res)=>{
    const {userid} = req.payload;
    const cart = db.collection("cart");
    try{
        const userCart = await cart.findOne({userid:userid});
        res.status(200).json({"cartdetails":userCart}); 
    }
    catch(e){
        res.status(500).json({"msg":"something went wrong"});
    }
});


//adding products to cart
app.post("/cart/addproduct",TokenAuthentication,async (req,res)=>{
    const {productid,quantity} = req.body;
    const {userid} = req.payload;
    try{
        const cart = db.collection("cart");
        const productsCollection = db.collection("products");
        const product = await productsCollection.findOne({productid:parseInt(productid)});
        const {price} = product;
        let {products,totalAmount} = await cart.findOne({userid:userid},{products:1,totalAmount:1});
        let flag = false;
        let i=0
        for (i=0;i<products.length;i++){
            if (products[i].product.productid===parseInt(productid)){
                flag=true;
                break;
            }
        }
        if (flag){
            products[i].quantity  = products[i].quantity+parseInt(quantity);
        }
        else{
            const cartproductid = nanoid();
            products.push({
                product:product,
                quantity:quantity,
                cartproductid:cartproductid
            });
        }
        totalAmount= totalAmount + (price)*parseInt(quantity);
        await cart.updateOne({userid:userid},{$set:{products:products,totalAmount:totalAmount}});
        res.status(200).json({"msg":"product added successfully"});
    }
    catch(e){
        res.status(500).json({"msg":"Something went wrong"});
    }
});


//deleting a product from the cart
app.delete("/cart/deleteproduct",TokenAuthentication,async (req,res)=>{
    const {userid} = req.payload;
    const {cartproductid} = req.body;
    try{
        const cart = db.collection("cart");
        let {products,totalAmount} = await cart.findOne({userid:userid},{products:1,totalAmount:1});
        const newProducts = products.filter((i)=> {
            if (i.cartproductid===cartproductid){
                totalAmount-= (i.product.price*i.quantity);
            }
            else{
                return i;
            }
        });
        await cart.updateOne({userid:userid},{$set:{products:newProducts,totalAmount:totalAmount}});
        res.status(200).json({"msg":"Product deleted from the cart"});
    }
    catch(e){
        res.status(500).json({"msg":"something went wrong"})
    }
});


//deleting all products from the cart
app.delete("/cart/deleteproducts",TokenAuthentication,async (req,res)=>{
    const {userid} = req.payload;
    try{
        const cart = db.collection("cart");
        await cart.updateOne({userid:userid},{$set:{products:[],totalAmount:0}});
        res.status(200).json({"msg":"All Products are deleted from the cart"});
    }
    catch(e){
        res.status(500).json({"msg":"something went wrong"})
    }
});

//checkout or order
app.post("/checkout",TokenAuthentication,async (req,res)=>{
        const now = new Date();
    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentDateTime= `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`; 
    const {userid} = req.payload;
    const order = db.collection("orders");
    const cart = db.collection("cart");
    try{
        const {cartid} = req.body;
        const {username} = await db.collection("users").findOne({cartid:cartid})
        const {products,totalAmount} = await cart.findOne({cartid:cartid});
        const orders = await order.find({userid:userid}).toArray();
        const ordersCount = orders.length;
        const orderid = nanoid();
        await order.insertOne({
            orderid:orderid,
            userid:userid,
            orderNo : ordersCount+1,
            products:products,
            totalAmount:totalAmount,
            date:currentDateTime,
            orderedby : username
        });
        await cart.updateOne({cartid:cartid},{$set:{products:[],totalAmount:0}});
        res.status(200).json({"msg":"order is placed succesfully"});
    }
    catch(e){
        res.status(500).json({"msg":"something went wrong"});
    }
});



//get all orders of a user
app.get("/user/orders",TokenAuthentication,async (req,res)=>{
    try{
         const {userid} = req.payload;
         const orderscollection = db.collection("orders");
         const orders = await  orderscollection.find({userid:userid}).toArray();
         res.status(200).json({"orders":orders});
    } 
    catch(e){
     res.status(500).json({"msg":"something went wrong"});
    }
 });


//get order details
app.get("/orders/:orderid",TokenAuthentication,async (req,res)=>{
   try{
        const {orderid} = req.params;
        const orders = db.collection("orders");
        const orderdetails = await  orders.findOne({orderid:orderid});
        res.status(200).json({"orderdetails":orderdetails});
   } 
   catch(e){
    res.status(500).json({"msg":"something went wrong"});
   }
});



//get all orders 
app.get("/seller/orders",TokenAuthentication,async (req,res)=>{
    try{
         const {role} = req.payload;
         if (role==="customer"){
            res.status(401).json({"msg":"you dont have access for this"});
         }
         const orderscollection = db.collection("orders");
         const orders = await  orderscollection.find({}).toArray();
         res.status(200).json({"orders":orders});
    } 
    catch(e){
     res.status(500).json({"msg":"something went wrong"});
    }
 });





//add a product
app.post("/seller/addproduct",TokenAuthentication,async (req,res)=>{
    const {role} = req.payload;
    if (role!=="seller"){
        res.status(400).json({"msg":"you don't have access for this."});
    }
    else{
        try{
            const {name,price,description,imageurl,rating,brand} = req.body;
            const productid = Date.now() + Math.floor(Math.random() * 1000);
            const productsCollection = db.collection("products");
            await productsCollection.insertOne({
                name:name,
                productid:productid,
                price:price,
                rating:rating,
                brand:brand,
                description:description,
                imageurl:imageurl
            });
            res.status(200).json({"msg":"product added sucessfully"});
        }
        catch(e){
            res.status(500).json({"msg":"something went wrong"});
        }
    }

});


//delete a product
app.post("/seller/deleteproduct",TokenAuthentication,async (req,res)=>{
    const {role} = req.payload;
    if (role!=="seller"){
        res.status(400).json({"msg":"you don't have access for this."});
    }
    else{
        try{
            const {productid} = req.body;
            const productsCollection = db.collection("products");
            await productsCollection.deleteOne({
                productid:productid
            });
            res.status(200).json({"msg":"product reomved sucessfully"});
        }
        catch(e){
            res.status(500).json({"msg":"something went wrong"});
        }
    }

});




