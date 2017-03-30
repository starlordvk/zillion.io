var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var image_downloader = require('image-downloader');
var path=require('path');
var http = require('http');
var fs = require('fs');
    
var mkdirp = require('mkdirp');

var Scraper = require ('images-scraper'),
fs = require('fs')
, request = require('request'),
google = new Scraper.Google();
mongoose.Promise = global.Promise;


  //connect to mongoDB

mongoose.connect("mongodb://varun:varun@ds153699.mlab.com:53699/todo",function(err){

    if(err)
        console.log("Connection to database failed");
    else
        console.log("Connection to database successful");   

});
    



//Creating a schema for database
var todoSchema=new mongoose.Schema({

item:String

});


//creating model for mongoDB
var todoModel=mongoose.model("todoModel",todoSchema);



//for posts requests
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function getModifiedFileName(filename){
    return filename.replace(/[|&;$%@"<>()+,]/g, "");
}


module.exports=function (app) {

  app.get("/todo",function (request,response) {

    //get data from db and pass it to the response
    todoModel.find({},function(err,data){

      if(err) throw err;
       response.render("toDo",{todos:data});
    });

   

  });


  //handles scraping and downloading
  app.post("/todo",urlencodedParser,function (request,response) {

    //get data from the view and aad it to the database
    var item=request.body.item;

    var newToDoItem=todoModel(request.body).save(function(err,data){
      if(err) throw err;
       response.json(data);
   
    });

        var newdirectory;


    console.log(request.body);  
  
  google.list({
    keyword: request.body.item,
    num: 15,
    rlimit: 1,
    detail: true,
    nightmare: {
        show: true
    }
})
.then(function (res) {
    console.log('first 15 results from google', res);

    mkdirp('assets/'+item+'/', function(err) { 
     newdirectory='assets/'+item+'/';
    if(err)
        throw err;
    console.log(newdirectory+" directory created");


});

 
    for (var i = 0; i < res.length; i++) 

    {
      



       options = {
                    url:res[i].url,
                    dest: 'assets/'+item+'/image'+i+'.jpg',        
                    done: function(err, filename, image) 
                    {
                    
                      if (err) {
                        throw err;
                      }
                      console.log('File saved to', filename);
                    },
              };
              
                image_downloader(options);
   

     }
   
    

  });
   

});

  app.get("/searched",function (request,response) {
    console.log("hello");

   response.sendFile(path.join(__dirname+'/../views/searched.html'));
    
});

  //handles deletion
  app.delete("/todo/:item",function (request,response) {

    //delete item from the DB
    todoModel.find({item:request.params.item}).remove(function(err,data){
      if(err) throw err;
      response.json(data);
    });
    
});


} 