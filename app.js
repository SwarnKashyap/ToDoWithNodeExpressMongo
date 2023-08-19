//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB").then(console.log("connected")).catch((err)=>console.log(err));

const itemSchema = {
  task : String
};

const Item = mongoose.model("Item",itemSchema);
const task1 = new Item({
  task : "Greating!!! "
});

const task2 = new Item({
  task : "Welcome to To do List "
});

const task3= new Item({
  task : "Hope you are doing well "
});

const defaultItem = [task1,task2,task3];




app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {

const day = date.getDate();
Item.find({})
.then((ans)=>{ 
  if(ans.length===0){
    Item.insertMany(defaultItem)
    .then(console.log("inserted"))
    .catch((err)=>{console.log(err);});
    res.redirect("/");
  }else{
    res.render("list", {listTitle: day, newListItems: ans});
  }
})
.catch((err)=>{console.log(err);});

 

});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  // console.log(itemName);
  const newTask = new Item({
    task : itemName
  });
  newTask.save();
  res.redirect("/");
});


app.post("/delete",function(req,res){
  const id = req.body.checkbox;
  Item.findByIdAndRemove(id).then(console.log("deleted")).catch((err)=>{console.log(err);});
  res.redirect("/");
})







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
