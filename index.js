//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const http = require("http");
const https = require("https");
const axios = require("axios");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const path = require("path");
const assert = require("assert");
const {spawn} = require('child_process');




const app = express();
app.use("/images", express.static('image'));
app.use("/css", express.static('css'));
app.use("/js", express.static('js'));
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true }));
app.use(session({
    secret: "SECRET is efjdkf",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://karan_admin:Kar2003@cluster0.oq0g1g1.mongodb.net/userDB", {useNewUrlParser: true});

mongoose.set('strictQuery', true);

// Schema

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  formData: {
    name: String,
    introduction: String,
    designation: String,
    email: String,
    contact: Number,
    address: String,
    linkedin: String
  },
  edudata: {
    gcollege: String,
    gduration: String,
    gdurationsm: String,
    gdurationsy: String,
    gdurationem: String,
    gdurationey: String,
    glocation: String,
    twcollege: String,
    twduration: String,
    twdurationsm: String,
    twdurationsy: String,
    twdurationem: String,
    twdurationey: String,
    twlocation: String,
    tecollege: String,
    teduration: String,
    tedurationsm: String,
    twdurationsy: String,
    tedurationem: String,
    twdurationey: String,
    telocation: String
  },
  workexp: {
    fcompany: String,
    fduration: String,
    fdurationsm: String,
    fdurationsy: String,
    fdurationem: String,
    fdurationey: String,
    fdesignation: String,
    fdescription: String,
    company2: String,
    duration2: String,
    duration2sm: String,
    duration2sy: String,
    duration2em: String,
    duration2ey: String,
    designation2: String,
    description2: String,
    company3: String,
    duration3: String,
    duration3sm: String,
    duration3sy: String,
    duration3em: String,
    duration3ey: String,
    designation3: String,
    description3: String
  },
  projectinfo: {
    skillsdescription: String,
    project1: String,
    projectduration1: String,
    projectduration1sm: String,
    projectduration1sy: String,
    projectduration1em: String,
    projectduration1ey: String,
    projectdescription1: String,
    project2: String,
    projectduration2: String,
    projectduration2sm: String,
    projectduration2sy: String,
    projectduration2em: String,
    projectduration2ey: String,
    projectdescription2: String,

  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.email});
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));  


app.get("/",function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get("/login", function(req, res){
  if (req.isAuthenticated()){
  res.sendFile(__dirname + '/src/home.html');
  } else {
    res.redirect("/");
  }
});

app.get("/register", function(req, res){
  if (req.isAuthenticated()){
  res.sendFile(__dirname + '/src/home.html');
  } else {
    res.redirect("/");
  }
});



app.get("/auth/google", 
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.sendFile(__dirname+"/src/home.html")
  });

  app.get("/personal", function(req, res){
    if (req.isAuthenticated()){
    res.sendFile(__dirname + '/src/personal.html');
    } else {
      res.redirect("/");
    }
  });

  app.get("/education", function(req, res){
    if (req.isAuthenticated()){
    res.sendFile(__dirname + '/src/education.html');
    } else {
      res.redirect("/");
    }
  });

  app.get("/work", function(req, res){
    if (req.isAuthenticated()){
    res.sendFile(__dirname + '/src/work.html');
    } else {
      res.redirect("/");
    }
  });

  app.get("/project", function(req, res){
    if (req.isAuthenticated()){
    res.sendFile(__dirname + '/src/project.html');
    } else {
      res.redirect("/");
    }
  });

  app.get("/resumes", function(req, res){
    if (req.isAuthenticated()){
    res.sendFile(__dirname + '/src/resumes.html');
    } else {
      res.redirect("/");
    }
  });


  let foundUser;

  app.get("/template1", function(req, res){
    User.findById(req.user.id, function(err, foundUser, response){
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          res.render("template1", {foundUser});
        }
      }
    });
  });


  app.get("/template2", function(req, res){
    User.findById(req.user.id, function(err, foundUser, response){
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          res.render("template2", {foundUser});
        }
      }
    });
  });

  app.get("/template3", function(req, res){
    User.findById(req.user.id, function(err, foundUser, response){
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          res.render("template3", {foundUser});
        }
      }
    });
  });

  app.get("/template4", function(req, res){
    User.findById(req.user.id, function(err, foundUser, response){
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          res.render("template4", {foundUser});
        }
      }
    });
  });



app.get("/home", function(req, res, err){
  User.find({"secret": {$ne: null}}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser) {
        res.sendFile(__dirname+ '/src/home.html', {usersWithSecrets: foundUser});
      }
    }
  });
});
// const options = 'https://www.linkedin.com/in/karan-rajput-5a07a5270';
app.post("/linkedin", function(req, res){
  const pythonProcess = spawn('python3', ["app.py"]);
  pythonProcess.stdout.on('data', (data) => {
      // console.log(data)
      // console.log('Node JS got data ${data}');
      // console.log('Type is : ${typeof data }');
      const mystr = data.toString();
      // console.log('Data To String ${mystr} Type of ${typeof mystr}');
      // console.log(mystr);
  
      const myjson = JSON.parse(mystr);
      // console.log("JSON is: ${myjson}");
      console.log(myjson);
      // console.log(myjson.Data);
      const formData = req.body;
      const name = myjson.Data.full_name;
      const introduction = myjson.Data.summary;
      const designation = myjson.Data.occupation;
      const email = req.body.email1;
      const contact = req.body.contact1;
      const address = myjson.Data.city;
      const linkedin = "abc.com";
// console.log(mystr.Data.full_name);
    
      const edudata = req.body;
      const gcollege = myjson.Data.education[0].school;
      const gduration = myjson.Data.education[0].field_of_study;
      // const gdurationsm = mystr.Data.education[0].starts_at.month;
      // const gdurationsy = mystr.Data.education[0].starts_at.year;
      // const gdurationem = mystr.Data.education[0].ends_at.month;
      // const gdurationey = mystr.Data.education[0].ends_at.year;
      const glocation = myjson.Data.education[0].description;
      const twcollege = myjson.Data.education[1].school;
      const twduration = myjson.Data.education[1].field_of_study;
      // const twdurationsm = mystr.Data.education[1].starts_at.month;
      // const twdurationsy = mystr.Data.education[1].starts_at.year;
      // const twdurationem = mystr.Data.education[1].ends_at.month;
      // const twdurationey = mystr.Data.education[1].ends_at.year;
      const twlocation = myjson.Data.education[1].description;
      const tecollege = myjson.Data.education[2].school;
      const teduration = myjson.Data.education[2].field_of_study;
      // const tedurationsm = mystr.Data.education[2].starts_at.month;
      // const tedurationsy = mystr.Data.education[2].starts_at.year;
      // const tedurationem = mystr.Data.education[2].ends_at.month;
      // const tedurationey = mystr.Data.education[2].ends_at.year;
      const telocation = myjson.Data.education[2].description;
    
      const workexp = req.body;
      const fcompany = myjson.Data.experiences[0].company;
      const fduration = myjson.Data.experiences[0].location;
      // const fdurationsm = mystr.Data.experiences[0].starts_at.month;
      // const fdurationsy = mystr.Data.experiences[0].starts_at.year;
      // const fdurationem = mystr.Data.experiences[0].ends_at.month;
      // const fdurationey = mystr.Data.experiences[0].ends_at.year;
      const fdesignation = myjson.Data.experiences[0].title;
      const fdescription = myjson.Data.experiences[0].description;
      const company2 = myjson.Data.experiences[1].company;
      const duration2 = myjson.Data.experiences[1].location;
      // const duration2sm = mystr.Data.experiences[1].starts_at.month;
      // const duration2sy = mystr.Data.experiences[1].starts_at.year;
      // const duration2em = mystr.Data.experiences[1].ends_at.month;
      // const duration2ey = mystr.Data.experiences[1].ends_at.year;
      const designation2 = myjson.Data.experiences[1].title;
      const description2 = myjson.Data.experiences[1].description;
      const company3 = myjson.Data.experiences[2].company;
      const duration3 = myjson.Data.experiences[2].location;
      // const duration3sy = mystr.Data.experiences[2].starts_at.year;
      // const duration3em = mystr.Data.experiences[2].ends_at.month;
      // const duration3ey = mystr.Data.experiences[2].ends_at.year;
      const designation3 = myjson.Data.experiences[2].title;
      const description3 = myjson.Data.experiences[2].description;
    
      const projectinfo = req.body;
      const skillsdescription = req.body.skillsdescription;
      const project1 = myjson.Data.accomplishment_projects[0].title;
      // const projectduration1sm = mystr.Data.accomplishment_projects[0].starts_at.month;
      // const projectduration1sy = mystr.Data.accomplishment_projects[0].starts_at.year;
      // const projectduration1em = mystr.Data.accomplishment_projects[0].ends_at.month;
      // const projectduration1ey = mystr.Data.accomplishment_projects[0].ends_at.year;
      const projectdescription1 = myjson.Data.accomplishment_projects[1].description;
      const project2 = myjson.Data.accomplishment_projects[1].title;
      // const projectduration2sm = mystr.Data.accomplishment_projects[0].starts_at.month;
      // const projectduration2sy = mystr.Data.accomplishment_projects[0].starts_at.year;
      // const projectduration2em = mystr.Data.accomplishment_projects[0].ends_at.month;
      // const projectduration2ey = mystr.Data.accomplishment_projects[0].ends_at.year;
      const projectdescription2 = myjson.Data.accomplishment_projects[1].description;      

      User.findById(req.user.id,{useCreateIndex: true}, function(err, foundUser){
        if (err) {
          console.log(err);
        } else {
          if (foundUser) {
            // personal info
            foundUser.formData = formData;
            foundUser.formData.name = name;
            foundUser.formData.designation = designation;
            foundUser.formData.introduction = introduction;
            foundUser.formData.email = email;
            foundUser.formData.contact = contact;
            foundUser.formData.address = address;
            foundUser.formData.linkedin = linkedin;
            //education data
            foundUser.edudata = edudata;
            foundUser.edudata.gcollege = gcollege;
            foundUser.edudata.gduration = gduration;
            // foundUser.edudata.gdurationsy = gdurationsy;
            // foundUser.edudata.gdurationem = gdurationem;
            // foundUser.edudata.gdurationey = gdurationey;
            foundUser.edudata.glocation = glocation;
            foundUser.edudata.twcollege = twcollege;
            foundUser.edudata.twduration = twduration;
            // foundUser.edudata.twdurationsy = twdurationsy;
            // foundUser.edudata.twdurationem = twdurationem;
            // foundUser.edudata.twdurationey = twdurationey;
            foundUser.edudata.twlocation = twlocation;
            foundUser.edudata.tecollege = tecollege;
            foundUser.edudata.teduration = teduration;
            // foundUser.edudata.tedurationsy = tedurationsy;
            // foundUser.edudata.tedurationem = tedurationem;
            // foundUser.edudata.tedurationey = tedurationey;
            foundUser.edudata.telocation = telocation;
            
            //work data
            foundUser.workexp = workexp;
            foundUser.workexp.fcompany = fcompany;
            foundUser.workexp.fduration = fduration;
            // foundUser.workexp.fdurationsy = fdurationsy;
            // foundUser.workexp.fdurationem = fdurationem;
            // foundUser.workexp.fdurationey = fdurationey;
            foundUser.workexp.fdesignation = fdesignation;
            foundUser.workexp.fdescription = fdescription;
            foundUser.workexp.company2 = company2;
            foundUser.workexp.duration2 = duration2;
            // foundUser.workexp.duration2sy = duration2sy;
            // foundUser.workexp.duration2em = duration2em;
            // foundUser.workexp.duration2ey = duration2ey;
            foundUser.workexp.designation2 = designation2;
            foundUser.workexp.description2 = description2;
            foundUser.workexp.company3 = company3;
            foundUser.workexp.duration3 = duration3;
            // foundUser.workexp.duration3sy = duration3sy;
            // foundUser.workexp.duration3em = duration3em;
            // foundUser.workexp.duration3ey = duration3ey;
            foundUser.workexp.designation3 = designation3;
            foundUser.workexp.description3 = description3;

            //project data
            foundUser.projectinfo = projectinfo;
            foundUser.projectinfo.skillsdescription = skillsdescription;
            foundUser.projectinfo.project1 = project1;
            // foundUser.projectinfo.projectduration1sm = projectduration1sm;
            // foundUser.projectinfo.projectduration1sy = projectduration1sy;
            // foundUser.projectinfo.projectduration1em = projectduration1em;
            // foundUser.projectinfo.projectduration1ey = projectduration1ey;
            foundUser.projectinfo.projectdescription1 = projectdescription1;
            foundUser.projectinfo.project2 = project2;
            // foundUser.projectinfo.projectduration2sm = projectduration2sm;
            // foundUser.projectinfo.projectduration2sy = projectduration2sy;
            // foundUser.projectinfo.projectduration2em = projectduration2em;
            // foundUser.projectinfo.projectduration2ey = projectduration2ey;
            foundUser.projectinfo.projectdescription2 = projectdescription2;

            foundUser.save(function(){
              res.sendFile(__dirname + "/src/resumes.html");
            });
          }
        }
      });
  });
  
});

app.post("/education", function(req, res){
  const formData = req.body;
  const name = req.body.name;
  const designation = req.body.designation;
  const introduction = req.body.introduction;
  const email = req.body.email;
  const contact = req.body.contact;
  const address = req.body.address;
  const linkedin = req.body.linkedin;

  User.findById(req.user.id,{useCreateIndex: true}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.formData = formData;
        foundUser.save(function(){
          res.sendFile(__dirname + "/src/education.html");
        });
      }
    }
  });
});

app.post("/workexperience", function(req, res){
  const edudata = req.body;
  const gcollege = req.body.gcollege;
  const gduration = req.body.gduration;
  const glocation = req.body.glocation;
  const twcollege = req.body.twcollege;
  const twduration = req.body.twduration;
  const twlocation = req.body.twlocation;
  const tecollege = req.body.tecollege;
  const teduration = req.body.teduration;
  const telocation = req.body.telocation;

  User.findById(req.user.id,{useCreateIndex: true}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.edudata = edudata;
        foundUser.save(function(){
          res.sendFile(__dirname + "/src/work.html");
        });
      }
    }
  });
});

app.post("/project", function(req, res){
  const workexp = req.body;
  const fcompany = req.body.fcompany;
  const fduration = req.body.fduration;
  const fdesignation = req.body.fdesignation;
  const fdescription = req.body.fdescription;
  const company2 = req.body.company2;
  const duration2 = req.body.duration2;
  const designation2 = req.body.designation2;
  const description2 = req.body.description2;
  const company3 = req.body.company3;
  const duration3 = req.body.duration3;
  const designation3 = req.body.designation3;
  const description3 = req.body.description3;

  User.findById(req.user.id,{useCreateIndex: true}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.workexp = workexp;
        foundUser.save(function(){
          res.sendFile(__dirname + "/src/project.html");
        });
      }
    }
  });
});

app.post("/resumes", function(req, res){
  const projectinfo = req.body;
  const skillsdescription = req.body.skillsdescription;
  const project1 = req.body.project1;
  const projectduration1 = req.body.projectduration1;
  const projectdescription1 = req.body.projectdescription1;
  const project2 = req.body.project2;
  const projectduration2 = req.body.projectduration2;
  const projectdescription2 = req.body.projectdescription2;


  User.findById(req.user.id,{useCreateIndex: true}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.projectinfo = projectinfo;
        foundUser.save(function(){
          res.sendFile(__dirname + "/src/resumes.html");
        });
      }
    }
  });
});


/* Logout */
  
app.get("/logout", function(req, res){
    req.logout(function(err){
        if (err) {
            return next(err);
        }
    });

    res.redirect("/");
    console.log("User is logout");
});

/* Register */

app.post("/register", function(req, res){

    User.register({ username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.sendFile(__dirname+ '/');

        }
        else {
            passport.authenticate("local")(req, res, function(){
              res.sendFile(__dirname+ '/src/home.html');
            });
        }
    });
    
});
/* Login */
app.post("/login", function(req, res){

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.sendFile(__dirname+ "/src/home.html");
        });
      }
    });
  
  });
  
/* Hosting Details */
const port = process.env.PORT || 3000

const server = http.createServer(app);

server.listen(port, function(){
    console.log("Server Started");
});