const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
let day = require('./date.js')
// console.log(day());
let workList =[];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
mongoose.connect("mongodb+srv://shreyashgawande:Shreyash8902@cluster0.pl1g7kw.mongodb.net/ussghsiud", {useNewUrlParser: true});

const itemsSchema = {
  name: String,
};
const Item =mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name : "Welcome to the to do list "
});


const defaultItems =[item1];
//Schema for different list
const listSchema = {
  name : String,
  items : [itemsSchema]
};
const List = mongoose.model("List",listSchema);
//



app.get('/',function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
       if(err){
         console.log(err);
       }
       else{
         console.log("successfully inserted");
       }

     });
      res.redirect("/");
   }
   else{
       res.render("list",{ListTitle:"Today" , newListItems: foundItems});
   }

  });
});
app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name : customListName,
          items :defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }
      else{
       res.render("list",{ListTitle:foundList.name,newListItems: foundList.items});
      }
    }
  });



});
app.post('/',function(req,res){
  console.log(req.body);
  const itemName  =req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if(listName === "Today"){
  item.save();
  res.redirect("/");
}
else{
  List.findOne({name: listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  })
}

});
app.post("/delete",function(req,res){
  const checkedItemId = (req.body.checkbox);
  const listName = req.body.listName;
  if(listName === "Today"){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully deleted checked item");
      res.redirect("/");
    }
    }
  );
}
else{
  List.findOneAndUpdate(
    {name: listName},
    {$pull : {items:{_id : checkedItemId}}},
    function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    }
  );
}
});
app.get("/work",function(req,res){
  res.render("list",{ListTitle:"Work List",newListItems: workList})
});

app.get("/about",function(req,res){
  res.render("about");
})
const PORT = process.env.PORT || 3100
app.listen(PORT,function(){
  console.log("Server is running on localport "+PORT);
});
