import './config.mjs';
import './db.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
    secret: 'secret',
    saveUninitialized: false,
    resave: false
};

const User = mongoose.model('User');
const RequiredCourses = mongoose.model('RequiredCourses');
const Course = mongoose.model('Course');

// Refer to readme for a list of references for the passport code
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


let coursesTaken = [];

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", (req, res)=>{
    // Passport login code references these tutorials:
        //https://mherman.org/blog/user-authentication-with-passport-dot-js/
        //https://cs.nyu.edu/courses/spring24/CSCI-UA.0467-001/_site/slides/16/auth.html#/
        //https://www.geeksforgeeks.org/node-js-authentication-using-passportjs-and-passport-local-mongoose/ 
    // Refer to README for a list of other general references/documentation for the passport code
    passport.authenticate('local', (err, account)=>{
        if (err){
            res.render("login", {error:err});
        } else{
            req.logIn(account,()=>{
                coursesTaken = req.user.coursesTaken; // replace the progress with the user info (if info was addded before login) 
                res.redirect("/my-tracker");
            });
        }
    })(req, res);
});


app.get("/createUser", (req, res)=>{
    res.render("createUser");
});

app.post("/createUser", async (req, res)=>{
    // Passport login authentication code references these tutorials:
        //https://mherman.org/blog/user-authentication-with-passport-dot-js/
        //https://cs.nyu.edu/courses/spring24/CSCI-UA.0467-001/_site/slides/16/auth.html#/
        //https://www.geeksforgeeks.org/node-js-authentication-using-passportjs-and-passport-local-mongoose/ 
    // Refer to README for a list of other general references/documentation for the passport code
    User.register(new User({username:req.body.username}), req.body.password, async (err)=>{
        if(err){
            res.render('createUser', {error:err});
        } else {
            res.redirect("/login");
        }
    });
});




// creates a list of courses that are available in the database
const listAllCourses = await Course.find({});
const courseNames = [];

for (const course of listAllCourses) {
    const temp = course.name.substring(0, 4);
    if (temp === "CSCI" || temp === "MATH") {
        courseNames.push(course.name);
    }
}
courseNames.sort();


app.get("/addTaken", (req, res) => {
    res.render("addTaken", { coursesTaken: coursesTaken, courseNames: courseNames });
});

app.post("/addTaken", async (req, res) => {
    // checks if the course is added already
    const addedAlready = coursesTaken.reduce((status, element) => {
        if (element === req.body.addCourse) {
            return status || true;
        }
        return status || false;
    }, false);
    // if the course is not added, then add it to the list of courses taken
    // if the course is added already, don't add it
    if (req.body.addCourse === "") {
        res.redirect("/addTaken");
    } else if (!addedAlready) {
        coursesTaken.push(req.body.addCourse);
        if (req.user){
            await User.findOneAndUpdate({username: req.user.username}, {coursesTaken: coursesTaken});
        }



        res.redirect("/addTaken");
    } else {
        res.redirect("/addTaken");
    }

});

app.get("/deleteTaken", (req, res) => {
    res.render("deleteTaken", { coursesTaken: coursesTaken });
});


app.post("/deleteTaken", async (req, res) => {
    const toDelete = req.body.deleteCourse;
    let courseIndex = -1;
    courseIndex = coursesTaken.reduce((itemLocation, element, index) => {
        // sets the courseIndex to the location of the element that matches
        // if it doesn't match, do not change the courseIndex
        if (element === toDelete) {
            itemLocation = index;
        } 
        return itemLocation;
    }, courseIndex);
    // if course to delete is not in the list, don't do anything
    // if it is, delete it
    if (courseIndex !== -1) {
        coursesTaken.splice(courseIndex, 1);
        if (req.user){
            await User.findOneAndUpdate({username: req.user.username}, {coursesTaken: coursesTaken});
        }

    }
    res.redirect("/deleteTaken");
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

let program = "Computer Science Major";


app.get("/my-tracker", async (req, res) => {
    const defaultProgram = program === "Computer Science Major";
    const coursesRequired = await RequiredCourses.findOne({ program: program }).populate('courses');
    const courseAndPrereqsInfo = [];

    // for each course required for the major/minor program
    for (const course of coursesRequired.courses) {
        await course.populate("prerequisites");

        //for each prerequisite for the course, the name of the prerequisite courses are extracted
        const numPrereqs = course.prerequisites.length;
        let prereqNames = "";
        const prereqArr = [];
        for (let i=0; i<numPrereqs; i++){
            prereqArr.push(course.prerequisites[i].name);
            prereqNames += course.prerequisites[i].name;
            if (i!== numPrereqs-1){
                prereqNames +=", ";
            }
        }

        let taken = false;
        let canBeTaken = false;

        if (course.name === "CS Major Electives(5)" || course.name === "CS Minor Required Elective"){
            // This addresses the elective requirements for the major program
            if (course.name === "CS Major Electives(5)"){
                let count = 0;
                for (const item of coursesTaken){
                    const temp = item.substring(0,9);
                    if (temp === "CSCI-UA.4"){
                        count ++;
                    } 
                }
                if (count >=5){
                    taken = true;
                }
            } else if (coursesTaken.includes("CSCI-UA.202")||coursesTaken.includes("CSCI-UA.310")){
                    // This addresses the elective requirements for the minor program
                    taken = true;
                } else{
                    for (const item of coursesTaken){
                        const temp = item.substring(0,9);
                        if (temp === "CSCI-UA.4"){
                            taken = true;
                        } 
                    }                
                }
            
        }else if (coursesTaken.includes(course.name)){
            // This is used for the rest of the courses 
            taken = true;
        } else {
            canBeTaken = prereqArr.reduce((accumulator, element)=>{
                const temp = coursesTaken.includes(element);
                return (temp) && accumulator;
            }, true);
        }
        
        const canNotTake = !(taken || canBeTaken); // this is true ONLY if both the course is not taken AND cannot be taken

        // then the course name, prerequisite courses names, and if the course is taken are are placed in an object 
        courseAndPrereqsInfo.push({ name: course.name, prerequisites: prereqNames, taken:taken, canBeTaken:canBeTaken, canNotTake:canNotTake });
    }

    res.render("myTracker", { courseRequired: courseAndPrereqsInfo, programName: program, default: defaultProgram });
});


app.post("/my-tracker", (req, res) => {
    program = req.body.program;
    res.redirect("/my-tracker");
});

app.get("/logout", (req, res)=>{
    req.logout(err=>{
        if (!err){
            coursesTaken =[];
            res.redirect('/login');
        }        
    });
});

app.listen(process.env.PORT ?? 3000);

export {
    app,
    coursesTaken
};