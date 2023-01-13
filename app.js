const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");

const app = express();
let items =["Buy mobile","Have Lunch","Go to college"];
let workList =[];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.get('/',function(req,res){
  let day = date();
  res.render("list",{ListTitle:day , newListItems:items});

});
app.post('/',function(req,res){
  console.log(req.body);
  let item =req.body.newItem;
  if(req.body.list==="Work"){
    workList.push(item);
    console.log(item);
    res.redirect("/work");
  }
  else{
    items.push(item);
    console.log(item);
    res.redirect("/");
  }

});
app.get("/work",function(req,res){
  res.render("list",{ListTitle:"Work List",newListItems: workList})
});

app.get("/about",function(req,res){
  res.render("about");
})

app.listen(3100,function(){
  console.log("Server is running on localport 3100");
});
