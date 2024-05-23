
const express=require('express');
const app=express();
const port= 3300;

const bodyParser=require('body-parser'); 

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/hastalar.html");
});


app.use(bodyParser.urlencoded({extended: false}))
app.get('/submit',function(req,res){
  console.log("Data Saved");
})


const {Pool,Client}= require('pg');

const connectionString='postgressql://postgres:merve2302@localhost:5432/hasta_takip'


const client= new Client({
    connectionString:connectionString
})


app.post("/",(req,res)=>{
    const { hastaid,ad,aoyad,dogumtarih}=req.body
    client.connect()
    client.query('INSERT INTO Form VALUES ($1, $2, $3,$4)', [hastaid, ad,soyad,dogumtarih], (err,res)=> {
        console.log(err,res);
        client.end() 
    })
   
    res.sendFile(__dirname + "/views/hastalar.html");
  })



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  });
