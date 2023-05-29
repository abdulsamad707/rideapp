const mysql=require("mysql");


const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ride_app"
});
con.connect((err)=>{
   if(!err){

   }
});
module.exports=con;
