var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
const { render } = require('ejs');
const { request } = require('express');

var app = express();
mongoose.connect("mongodb://localhost/thotsApp",{useNewUrlParser: true, useUnifiedTopology: true});
//App config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Mongoose-Schema
var thotSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
//Mongoose-Model
var Thots = mongoose.model("Thots", thotSchema);
/*thots.create({
    title: "Thots-Test",
    image: "https://i.redd.it/3c42u3k5fxx11.jpg",
    body: "Hello, This is a thot test app 00017"
});*/

//Routes

/***********************index*************************/
app.get("/", function(req, res){
    res.redirect("/thots");
});
app.get("/thots", function(req, res){
    Thots.find({}, function(err, foundThot){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("index", {thots : foundThot});
        }
    });
});
/***********************new route*********************/
app.get("/thots/new", function(req, res){
    res.render("new");
});
/*********************create route*******************/
app.post("/thots", function(req, res){
    req.body.thot.body = req.sanitize(req.body.thot.body);
    Thots.create(req.body.thot, function(err, newThot){
        if(err){
            console.log("ERROR!");
        }else{
            res.redirect("/thots");
        }
    });
});
/*********************show route*********************/
app.get("/thots/:id", function(req, res){
    Thots.findById(req.params.id, function(err, foundThot){
        if(err){
            res.redirect("/thots");
        }else{
            res.render("show", {thot:foundThot});
        }
    });
});
/*********************edit route*********************/
app.get("/thots/:id/edit", function(req, res){
    Thots.findById(req.params.id, function(err, foundThot){
        if(err){
            res.redirect("/thots");
        }else{
            res.render("edit", {thot:foundThot});
        }
    });
});
/*********************update route*********************/
app.put("/thots/:id", function(req, res){
    req.body.thot.body = req.sanitize(req.body.thot.body);
    Thots.findByIdAndUpdate(req.params.id, req.body.thot, function(err, updatedThot){
        if(err){
            res.redirect("/thots");
        }else{
            res.redirect("/thots/" + req.params.id);
        }
    });
});
/*********************delete route*********************/
app.delete("/thots/:id", function(req, res){
    Thots.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/thots");
        }else{
            res.redirect("/thots");
        }
    });
});

app.listen(8080, function(){
    console.log("Thot begones....///");
});