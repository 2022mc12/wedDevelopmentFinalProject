import request from 'supertest';
import * as main from '../app.mjs';
// For a list of references, please check the references section of README


describe("Add Courses", ()=>{
    it("Able to GET the /addTaken page with no errors", done=>{
        request(main.app).get('/addTaken').expect(200, done)
    });
    it("Entering a value into the form adds it to the list of courses", done=>{
        request(main.app).post('/addTaken').type('form').send({'addCourse':'CSCI-UA 101'}).expect(res=>{
            if(!main.coursesTaken.includes("CSCI-UA 101")){
                throw new Error("course not added");
            }
            
        }).end(done);
    });
    it("POST to /addTaken will redirect to /addTaken", done=>{
        request(main.app).post('/addTaken').type('form').send({'addCourse':'CSCI-UA 102'}).expect(res=>{
            res.headers["Location"] == "linserv1.cims.nyu.edu:20108/addTaken";
        }).expect(302, done);
    });
});

describe("Delete Courses", ()=>{
    it("Able to GET the /deleteTaken page with no errors", done=>{
        request(main.app).get('/deleteTaken').expect(200, done);
    });
    it("Entering a value into the form deletes it from the list of courses", done=>{
        request(main.app).post('/deleteTaken').type('form').send({'deleteCourse':'CSCI-UA 101'}).expect(res=>{
            if(main.coursesTaken.includes("CSCI-UA 101")){
                throw new Error("course not deleted");
            }
        }).end(done);    
    });
    it("POST to /deleteTaken will redirect to /deleteTaken", done=>{
        request(main.app).post('/deleteTaken').type('form').send({'deleteCourse':'CSCI-UA 102'}).expect(res=>{
            res.headers["Location"] == "linserv1.cims.nyu.edu:20108/deleteTaken";
        }).expect(302, done);
    });
});
