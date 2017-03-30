var express= require("express");
var morgan=require("morgan");

var toDoController=require("./controllers/toDoController");
var app=express();

//to log in the requests in cmd
app.use(morgan('dev'));

//set up view engine
app.set("view engine","ejs");

//static files
app.use(express.static("./public"))


//fire controllers
toDoController(app);


//listen on port
app.listen(3000);
console.log("Listening on port 3000");
