const express=require("express")
const app=express()
const port =4500;
require("./dbconnection/dbconnectivity")
const test=require("./model/user")
const router=require("./router/route");
const staticroutes=require("./router/staticroutes")
 
 
app.use(express.json())
app.use("/api",router);
app.use("/api/static",staticroutes);

 
 
app.post("/",async(req,res)=>{
    try{
        const createData=new test(req.body)
        const result=await createData.save();
        res.send(result);
        console.log(result);


    }catch(error){ 
        console.log(error)

    }
})
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})