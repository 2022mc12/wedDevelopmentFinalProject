import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    coursesTaken:[String]
});

const RequiredCoursesSchema = new mongoose.Schema({
    program: String,
    courses:[{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const CourseSchema = new mongoose.Schema({
    name: String,
    prerequisites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}] 
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
mongoose.model('RequiredCourses', RequiredCoursesSchema);
mongoose.model('Course', CourseSchema);