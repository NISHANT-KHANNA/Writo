const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//connect to mongo database
mongoose.connect("mongodb://localhost:27017/writo",{
	useNewUrlParser: true,
  useUnifiedTopology: true,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/"); // Ensure this directory exists
   },
   filename: function (req, file, cb) {

      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
   },
});

const upload = multer({ storage: storage });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//defining the user schema
const userdataSchema = new mongoose.Schema({
   username : String,
   email : String , 
   password : String , 
   cpassword : String,
   course: String,
   joinDate:Date,
   mobile: {
    type: String, // You can also use Number type if needed
    required: false, // Make it optional for now
  }

});

const Userdata = mongoose.model("Userdata",userdataSchema);


// defining the admin schema
const admindataSchema = new mongoose.Schema({
   username : String,
   email : String , 
   password : String , 
   cpassword : String,
   
});

const Admindata = mongoose.model("Admindata",admindataSchema);


// defining the course schema 
const courseDataSchema =new mongoose.Schema({
        course: { type: String, required: true, unique: true },
        subjects: [
        {
            subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectData' },
            subjectName: { type: String }
        }
    ]
});
const CourseData = mongoose.model("CourseData",courseDataSchema);

//deifing the subject schema
const subjectDataSchema =new mongoose.Schema({
        subject: { type: String, required: true},
        courseName: { type: String }, // Store the course name
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseData' } // Store course ID reference
});
const SubjectData = mongoose.model("SubjectData",subjectDataSchema);

//deifing the subject schema
const examDataSchema =new mongoose.Schema({
        test: { type: String, required: true},
        description: { type: String},
        courseName: { type: String }, // Store the course name
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseData' } // Store course ID reference
});
const ExamData = mongoose.model("ExamData",examDataSchema);


// defining the test schema
const testDataSchema =new mongoose.Schema({
	    question : String,
        options :[String],
        correctAnswer :String,
        course :String,
        subject :String,
        level :String,
        testBox :String
});
const TestData = mongoose.model("TestData",testDataSchema);


///////////////////////////////////////////////////////////////////////
const questionSchema =new mongoose.Schema({
        question : String,
        options :[String],
        correctAnswer :String,
        course :String,
        subject :String,
        level :String,
        testBox :String
});
const QuestionData = mongoose.model("QuestionData",questionSchema);
////////////////////////////////////////////////////////////////////////

// Defining the attempt schema
const attemptDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata', required: true }, // Reference to the user
    name:String,
    course:String,
    
    statusT1:{type:String , default:"not attempted"},
    startT1:{type:Date ,default:null},
    endT1:{type:Date ,default:null},
    
    statusT2:{type:String , default:"not attempted"},
    startT2:{type:Date ,default:null},
    endT2:{type:Date ,default:null},
    
    statusT3:{type:String , default:"not attempted"},
    startT3:{type:Date ,default:null},
    endT3:{type:Date ,default:null},

});

const AttemptData = mongoose.model("AttemptData", attemptDataSchema);

// Defining the attempt schema
const attemptDataSchema2 = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata', required: true }, // Reference to the user
    name:String,
    course:String,    
    attempts:[
    {
        test:String,
        status: { type: String, default: "not attempted" },
        start:{type:Date ,default:null},
        end:{type:Date ,default:null},
    }]
});

const AttemptData2 = mongoose.model("AttemptData2", attemptDataSchema2);


// Defining the result schema
const resultDataSchema2 = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata', required: true }, // Reference to the user
    name:String,
    course:String,
    results:[
    {
        test:String,
        status: { type: String, default: null },
        score:{type:String , default:null},
    }]
    
});

const ResultData2 = mongoose.model("ResultData2", resultDataSchema2);



// Defining the result schema
const resultDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata', required: true }, // Reference to the user
    name:String,
    course:String,
    
    statusT1:{type:String , default:null},
    scoreT1:{type:String , default:null},
        
    statusT2:{type:String , default:null},
    scoreT2:{type:String , default:null},
        
    statusT3:{type:String , default:null},
    scoreT3:{type:String , default:null},
    
});

const ResultData = mongoose.model("ResultData", resultDataSchema);


// user registeration page -------------------------------------------------------------------------------------------------------
app.post("/register",async(req ,res)=>{
	const {username,email,password,cpassword,course} = req.body;

	if(!username || !email || !password || !cpassword || !course ){
		return( res.status(400).send("please provide information"));
	}

	const existingUser = await Userdata.findOne({email});
	if(existingUser){
		return(res.status(400).send("user exists"));
	}
	if(password !== cpassword){
		return(res.status(400).send("password not matched"));
	}
    const joinDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
	const newUser = new Userdata({username,email,password,course,joinDate});
	await newUser.save();

	// const newAttempt = new AttemptData({
	// 	   userId :newUser._id,
	// 	   name:username,
	// 	   course:course,
	// 	   //all the rest things are defaultly so no need to add them specifically
	//    });
    // await newAttempt.save();

    const tests = await ExamData.find({courseName:course}).select('test');
    const testAttempts = tests.map((test)=>({
        test:test.test,
        status:"not attempted",
        start:null,
        end:null
    }));

    // Create AttemptData record with dynamic test attempts
        const newAttempt = new AttemptData2({
            userId: newUser._id,
            name: username,
            course: course,
            attempts: testAttempts // Dynamically assigned
        });
        await newAttempt.save();
	res.status(201).send("user registered");
});


//  user login page ------------------------------------------------------------------------------------------------------------------
app.post("/login",async(req ,res)=>{
      const {email,password} =req.body;
      if (!email || !password) {
         return res.status(400).send('Please provide both email and password');
       }
      const User = await Userdata.findOne({email,password});
      if(!User){
      	return res.status(400).send({message:'Invalid username or password'});
      }
      res.status(200).json({message:'Login successful', userId:User._id ,username:User.username , course: User.course });

});

// app.post("/profile",async(req,res)=>{
//     const {userId} = req.body;
//     if(!userId){
//        return res.status(400).send("error in fetching");
//     }
//     const Profile = await Userdata.findOne({userId});
//     res.json(Profile);
// });

app.post("/profile", async (req, res) => {
  const { userId } = req.body;
  let _id  =userId;
  if (!userId) {
    return res.status(400).send("Error in fetching profile: Missing userId");
  }

  try {
    const profile = await Userdata.findOne({ _id });
    
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send("Server error");
  }
});


//add mobile number to the existing user
app.post("/addMobile",async(req,res)=>{
  const { userId, mobile } = req.body;
  let _id = userId;
  if (!userId || !mobile) {
    return res.status(400).send('User ID and mobile number are required.');
  }
  const user = await Userdata.findOne({ _id });
  if (!user) {
      return res.status(404).send('User not found');
  }
  if (!user.mobile) {
      user.mobile = mobile;
      await user.save();

    }
     res.json({message:"Mobile added successfully",user});

});

// before starting test it will check fot the attempt of that test ---------------------------------------------------------------------
app.post("/startTest",async(req,res)=>{
    const {userId,username,course,testId} =req.body;
    const user = await AttemptData.findOne({userId,course});
    console.log(user);
    if(!user){
    	return res.status(400).send("Attempt Data Not Found");
    }
    
    if(testId==="t1" && user.statusT1 !== "not attempted"){
    	return res.status(400).send("Test1 Attempted Before");
    }
    if(testId==="t2" && user.statusT2 !== "not attempted"){
    	return res.status(400).send("Test2 Attempted Before");
    }
    if(testId==="t3" && user.statusT3 !== "not attempted"){
    	return res.status(400).send("Test3 Attempted Before");
    }

    const startTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    if(testId==="t1"){
    	user.statusT1 = "in-progress";
    	user.startT1 = startTime;
    }
    else if(testId==="t2"){
    	user.statusT2 = "in-progress";
    	user.startT2 = startTime;
    }
    else if(testId==="t3"){
    	user.statusT3 = "in-progress";
    	user.startT3 = startTime;
    }
    await user.save();
    return res.status(200).send({message: `Test ${testId} has started successfully`});
});

app.post("/startTest2", async (req, res) => {
    const { userId, course, testId } = req.body;

    // Retrieve the user's attempt data for the specified course
    const user = await AttemptData2.findOne({ userId, course });
    if (!user) {
        return res.status(400).send("Attempt Data Not Found");
    }

    // Find the attempt entry for the specified test
    const testAttempt = user.attempts.find(attempt => attempt.test === testId);
    if (!testAttempt) {
        return res.status(400).send(`Test ${testId} not found`);
    }

    // Check if the test was already attempted
    if (testAttempt.status !== "not attempted") {
        return res.status(400).send(`Test ${testId} has already been attempted`);
    }

    // Update the test status to "in-progress" and set the start time
    testAttempt.status = "in-progress";
    testAttempt.start = new Date(); // Directly set the current time

    // Save the updated attempt data
    await user.save();
    res.status(200).send({ message: `Test ${testId} has started successfully` });
});



// Fetch questions for a specific test using an aggregate pipeline ------------------------------------------------------
// app.post("/fetchQuestions", async (req, res) => {
//     const { course, testId } = req.body;

//     try {
//         const questions = await TestData.aggregate([
//             { $match: { course: course, testBox: testId } },  // Use testId here
//             { $sample: { size: 30 } }
//         ]);

//         if (questions.length === 0) {
//             return res.status(400).send("No questions found for the selected course and test. ");
//         }

//         return res.status(200).json({ questions });
//     } catch (error) {
//         console.error("Error fetching questions:", error);
//         return res.status(500).send("Error fetching questions");
//     }
// });

app.post("/fetchQues", async (req, res) => {
    const { course, testId } = req.body;

    try {
        const questions = await QuestionData.aggregate([
            { $match: { course: course, testBox: testId } },  // Use testId here
            { $sample: { size: 30 } }
        ]);

        if (questions.length === 0) {
            return res.status(400).send("No questions found for the selected course and test. ");
        }

        return res.status(200).json({ questions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).send("Error fetching questions");
    }
});

//End Test Page-----------------------------------------------------------------------------------------------------------------------------
app.post('/endTest', async (req, res) => {
    const { userId,username, course, testId, answers, questionIds } = req.body;

    try {
        const user = await AttemptData2.findOne({ userId, course });
        
    // Find the attempt entry for the specified test
    const testAttempt = user.attempts.find(attempt => attempt.test === testId);
    if (!testAttempt) {
        return res.status(400).send(`Test ${testId} not found`);
    }

    //Prevent re-attempting the same test after completion
    if (testAttempt.status === "completed") {
        return res.status(400).send(`Test ${testId} has already been attempted`);
    }

        // Fetch questions that appeared in the test

        // const questions = await TestData.find({ _id: { $in: questionIds }, course, testBox: testId });
        const questions = await QuestionData.find({ _id: { $in: questionIds }, course, testBox: testId });

        let score = 0;
        let feedback =[];

        // Compare user's answers with correct answers
        questions.forEach((question) => {
            let userAnswer = answers[question._id];
            let userAnswerIndex = -1; // Default index for unanswered questions
            let userAnswerImage = ""; // Default image for unanswered questions

            const correctAns = question.correctAnswer;
            if(!userAnswer){
                userAnswer = "Not Answered";
                
            }
            else{
               userAnswerIndex = parseInt(userAnswer.slice(6)) - 1;
               userAnswerImage = question.options[userAnswerIndex];
            }
            
            const isCorrect = userAnswer===correctAns;
            
            const correctAnsIndex = parseInt(correctAns.slice(6)) - 1;
            const correctAnswerImage = question.options[correctAnsIndex];

            console.log("User Answer:", userAnswer);
            console.log("Correct Answer:", correctAns);
            console.log("User Answer Index:", userAnswerIndex);
            console.log("User Answer Image:", userAnswerImage);
            console.log("Correct Answer Index:", correctAnsIndex);
            console.log("Correct Answer Image:", correctAnswerImage);

        //array of objects of feedback
            feedback.push({
               questionId : question._id,
               question: question.question,
               correctAnswer: correctAns,
               correctAnswerImage:correctAnswerImage || "",
               userAnswer: userAnswer,
               userAnswerImage:userAnswerImage || "",
               isCorrect: isCorrect,
            });

// const userAnswer = answers[question._id];
//     const correctAns = question.correctAnswer;

//     if (!userAnswer || !correctAns) {
//         console.error(`Missing data for question ID: ${question._id}`);
//         console.error(`userAnswer: ${userAnswer}, correctAns: ${correctAns}`);
//         return; // Skip this iteration if data is missing
//     }

//     const userAnswerIndex = parseInt(userAnswer.slice(6)) - 1;
//     const correctAnsIndex = parseInt(correctAns.slice(6)) - 1;

//     // Validate indices
//     if (
//         userAnswerIndex < 0 ||
//         userAnswerIndex >= question.options.length ||
//         correctAnsIndex < 0 ||
//         correctAnsIndex >= question.options.length
//     ) {
//         console.error(`Invalid index for question ID: ${question._id}`);
//         console.error(`userAnswerIndex: ${userAnswerIndex}, correctAnsIndex: ${correctAnsIndex}`);
//         return; // Skip this iteration if indices are invalid
//     }

//     const userAnswerImage = question.options[userAnswerIndex];
//     const correctAnswerImage = question.options[correctAnsIndex];

//     const isCorrect = userAnswer === correctAns;

//     console.log("User Answer:", userAnswer);
//     console.log("Correct Answer:", correctAns);
//     console.log("User Answer Index:", userAnswerIndex);
//     console.log("User Answer Image:", userAnswerImage);
//     console.log("Correct Answer Index:", correctAnsIndex);
//     console.log("Correct Answer Image:", correctAnswerImage);
// // Push feedback
    






            if (isCorrect) {
                 score += 1;
            }
        });
        
        const totalQuestions = questions.length;
        const passingScore = Math.ceil(totalQuestions / 2); // Half of the total questions
        const status = score >= passingScore ? 'Passed' : 'Failed';
        
        const endTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        
    // Update the test status to "in-progress" and set the start time
    testAttempt.status = "completed";
    testAttempt.end = endTime; // Directly set the current time

    // Save the updated attempt data
    await user.save();
        
        // await user.save();
        

       // // Check if a result document for this user already exists
       //  let result = await ResultData.findOne({ userId: userId });

       //  if (result) {
       //      // If a document exists, update it based on the testId
       //      if (testId === "T1") {
       //          result.statusT1 = status;
       //          result.scoreT1 = score;
       //      } else if (testId === "t2") {
       //          result.statusT2 = status;
       //          result.scoreT2 = score;
       //      } else if (testId === "t3") {
       //          result.statusT3 = status;
       //          result.scoreT3 = score;
       //      }

       //      await result.save();
       //  } 
       //  else {
       //      // If no document exists, create a new one
       //      result = new ResultData({
       //          userId: userId,
       //          name: username,
       //          course: course,
       //          statusT1: testId === "T1" ? status : undefined,
       //          scoreT1: testId === "T1" ? score : undefined,
       //          statusT2: testId === "t2" ? status : undefined,
       //          scoreT2: testId === "t2" ? score : undefined,
       //          statusT3: testId === "t3" ? status : undefined,
       //          scoreT3: testId === "t3" ? score : undefined,
       //      });

       //      await result.save();
       //  }

    // Check if a result document for this user already exists
        let student = await ResultData2.findOne({ userId: userId });

        if (student) {
            // If a document exists, update it based on the testId
            const testResult = student.results.find(result => result.test === testId);
            if (testResult) {
                testResult.status = status;
                testResult.score = score;
            }
            else {
           // Add new test if it doesn't exist
           student.results.push({
            test: testId,
            status: status,
            score: score,
        });
    }
            await student.save();
        } 
        else {

             const tests = await ExamData.find({courseName:course}).select('test');
             const testResult = tests.map((test)=>({
                 test:test.test,
                 status:testId===test.test?status : null,
                 score:testId===test.test?score : null,
             }));

    // Create AttemptData record with dynamic test attempts
             const newResult = new ResultData2({
                 userId: userId,
                 name: username,
                 course: course,
                 results: testResult // Dynamically assigned
             });
             await newResult.save();


            // If no document exists, create a new one
            // result = new ResultData({
            //     userId: userId,
            //     name: username,
            //     course: course,
                
            //     status: testId === "T1" ? status : undefined,
            //     scoreT1: testId === "T1" ? score : undefined,
            //     statusT2: testId === "t2" ? status : undefined,
            //     scoreT2: testId === "t2" ? score : undefined,
            //     statusT3: testId === "t3" ? status : undefined,
            //     scoreT3: testId === "t3" ? score : undefined,
            // });

            // await result.save();
        }
    
        // Send the feedback object to the client
        res.status(200).send({ feedback,score,status });
    } 

    catch (err) {
        console.error('Error ending test:', err);
        res.status(500).send('Error ending test');
    }
});

// app.post('/endTest', async (req, res) => {
//     const { userId, username, course, testId, answers, questionIds } = req.body;

//     try {
//         const user = await AttemptData2.findOne({ userId, course });

//         const testAttempt = user.attempts.find(attempt => attempt.test === testId);
//         if (!testAttempt) {
//             return res.status(400).send(`Test ${testId} not found`);
//         }

//         if (testAttempt.status === "completed") {
//             return res.status(400).send(`Test ${testId} has already been attempted`);
//         }

//         const questions = await TestData.find({ _id: { $in: questionIds }, course, testBox: testId });

//         let score = 0;
//         let feedback = [];

//         questions.forEach((question) => {
//             const userAnswer = answers[question._id];
//             const isCorrect = userAnswer === question.correctAnswer;

//             feedback.push({
//                 questionId: question._id,
//                 question: question.question,
//                 correctAnswer: question.correctAnswer,
//                 userAnswer: userAnswer || "Not Answered",
//                 isCorrect: isCorrect,
//             });

//             if (isCorrect) {
//                 score += 1;
//             }
//         });

//         const totalQuestions = questions.length;
//         const passingScore = Math.ceil(totalQuestions / 2);
//         const status = score >= passingScore ? 'Passed' : 'Failed';

//         testAttempt.status = "completed";
//         testAttempt.end = new Date();

//         await user.save();

//         let student = await ResultData2.findOne({ userId: userId });

//         if (student) {
//             const testResult = student.results.find(result => result.test === testId);
//             if (testResult) {
//                 testResult.status = status;
//                 testResult.score = score;
//             }
//             await student.save();
//         } else {
//             const tests = await ExamData.find({ courseName: course }).select('test');
//             const testResult = tests.map((test) => ({
//                 test: test.test,
//                 status: testId === test.test ? status : null,
//                 score: testId === test.test ? score : null,
//             }));

//             const newResult = new ResultData2({
//                 userId: userId,
//                 name: username,
//                 course: course,
//                 results: testResult,
//             });
//             await newResult.save();
//         }

//         res.status(200).send({ feedback, score, status });
//     } catch (err) {
//         console.error('Error ending test:', err);
//         res.status(500).send('Error ending test');
//     }
// });


//Result Data Page---------------------------------------------------------------------------------------------------------------------------
app.post('/fetchResult',async(req,res)=>{
     const {userId} = req.body;
     const result = await ResultData2.findOne({userId});
     const attempt = await AttemptData2.findOne({userId});
     if(!result || !attempt){
        return res.status(400).send("No test given");
     }
     res.status(200).send({result,attempt});
});

// app.post('/fetchResult',async(req,res)=>{
//      const {userId} = req.body;
//      const result = await ResultData.findOne({userId});
//      const attempt = await AttemptData.findOne({userId});
//      if(!result || !attempt){
//         return res.status(400).send("No test given");
//      }
//      res.status(200).send({result,attempt});
// });
// admin registeration page -----------------------------------------------------------------------------------------------------------------
app.post("/register-admin", async (req, res) => {
	const { username, email, password, cpassword } = req.body;
  
	if (!username || !email || !password || !cpassword) {
	  return res.status(400).send("Please provide complete information");
	}
  
	const existingUser = await Admindata.findOne({ email });
	if (existingUser) {
	  return res.status(400).send("Admin already exists");
	}
  
	if (password !== cpassword) {
	  return res.status(400).send("Passwords do not match");
	}
  
	const newAdmin = new Admindata({ username, email, password}); 
	await newAdmin.save();
	res.status(201).send("Admin registered successfully");
  });
  

// admin login page ---------------------------------------------------------------------------------------------------------------
app.post("/admin/login",async(req ,res)=>{
	const {email,password} =req.body;
	if (!email || !password) {
	   return res.status(400).send('Please provide both email and password');
	 }
	const Admin = await Admindata.findOne({email,password});
	if(!Admin){
		return res.status(400).send({message:'Invalid username or password'});
	}
	res.status(200).json({message:'Login successful', adminId:Admin._id , adminName:Admin.username});

});


// Fetch all registered students
app.get('/admin/students', async (req, res) => {
    try {
      const students = await Userdata.find();
      res.json(students);
    }
     catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).send('Server error');
    }
  });


// Fetch all result of all students of particular course
app.post('/admin/scoreboard', async (req, res) => {
    try {
      let {course} = req.body;
      course = course.toUpperCase();
      const students = await ResultData2.find({course});
      res.json(students);
    }
     catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).send('Server error');
    }
  });


//admin dashboard -----------------------
// app.get('/admin/dashboard', async (req, res) => {
//   try {
//     const courses = ["JEE", "NEET", "10th", "12th"];
//     const userCounts = {};
//     const questionCounts = {};
//     const months =  ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
//     const jeeData = [];
//     const neetData = [];

//     for (const course of courses) {
//       userCounts[course] = await Userdata.countDocuments({ course });
//       questionCounts[course] = await TestData.countDocuments({ course });
//     }
//     for(const month of months){
//         const jeeUserCount = await Userdata.countDocuments({
//             course:"JEE",
//             joinDate:{
//                 $gte:new Date(`2024-${month}-01`),
//                 $lt: new Date(`2024-${month}-31`)
//             }
//          });
//         const neetUserCount = await Userdata.countDocuments({
//             course:"NEET",
//             joinDate:{
//                 $gte:new Date(`2024-${month}-01`),
//                 $lt: new Date(`2024-${month}-31`)
//             }
//          });
//     jeeData.push(jeeUserCount);
//     neetData.push(neetUserCount);
//     }
//     res.json({userCounts,questionCounts,jeeData,neetData});
//   } catch (error) {
//     console.error("Error fetching course counts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

app.get('/admin/dashboard', async (req, res) => {
  try {
    const totalUsers = await Userdata.countDocuments();
    const totalCourses = await CourseData.countDocuments();
    const totalTests = await ExamData.countDocuments();
    const totalQuestions = await QuestionData.countDocuments();

    //User counts by course 
    const userByCourse = await Userdata.aggregate([
       {$group:{_id:'$course' , count:{$sum:1}}},
    ]);
    // Question counts by course
    const questionByCourse = await QuestionData.aggregate([
       {$group:{_id:'$course' , count:{$sum:1}}},
    ]);
    //Test counts by course
    const testByCourse = await ExamData.aggregate([
       {$group:{_id:'$courseName' , count:{$sum:1}}},
    ]);
    
    // counting the users joined of different courses on diffferent months
    const courses = await Userdata.distinct("course");
    const months =["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const monthlyData =[];

    for(const course of courses){
        const monthlyCounts=[];
        for(const month of months){
            const userCount = await Userdata.countDocuments({
                course,
                joinDate:{
                   $gte:new Date(`2024-${month}-01`),
                   $lt: new Date(`2024-${month}-31`)
                }
            });
            monthlyCounts.push(userCount);
        }
        monthlyData.push({course,monthlyCounts});

    }
    res.status(200).json({
      totalUsers,
      totalCourses,
      totalTests,
      totalQuestions,
      userByCourse,
      questionByCourse,
      testByCourse,
      monthlyData
    });

  }
  catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// app.post('/admin/scoreboard', async (req, res) => {
//     try {
//       let { course } = req.body;   // Destructure course from req.body
//       course = course.toUpperCase();  // Convert course to uppercase

//       const students = await ResultData.find({ course });
      
//       res.json(students);
//     }
//     catch (error) {
//       console.error('Error fetching student data:', error);
//       res.status(500).send('Server error');
//     }
// });

// question adding page---------------------------------------------------------------------------------------------------------
// Route to handle question submission
app.post(
   "/addQues",
   upload.fields([
      { name: "questionImage", maxCount: 1 },
      { name: "option1", maxCount: 1 },
      { name: "option2", maxCount: 1 },
      { name: "option3", maxCount: 1 },
      { name: "option4", maxCount: 1 },
   ]),
   async (req, res) => {
      try {
         const { correctAnswer, course, subject, level, testBox } = req.body;

         // Check if all required files are present
         if (
            !req.files ||
            !req.files["questionImage"] ||
            !req.files["option1"] ||
            !req.files["option2"] ||
            !req.files["option3"] ||
            !req.files["option4"]
         ) {
            return res.status(400).send("All images are required.");
         }

         const questionData = {
            question: req.files["questionImage"][0].filename,
            options: [
               req.files["option1"][0].filename,
               req.files["option2"][0].filename,
               req.files["option3"][0].filename,
               req.files["option4"][0].filename,
            ],
            correctAnswer, // e.g., "Option1"
            course,
            subject,
            level,
            testBox,
         };

         const newQuestion = new QuestionData(questionData);
         await newQuestion.save();

         res.status(201).send("Question added successfully!");
      } catch (err) {
         console.error("Error adding question:", err);
         res.status(500).send(`Error adding question: ${err.message}`);
      }
   }
);


// question adding page---------------------------------------------------------------------------------------------------------
app.post("/addCourse",async(req,res)=>{
    const {course} = req.body;
   
    const existingCourse = await CourseData.findOne({course});
    if(existingCourse){
        return res.status(400).send('Course exists ');
    }
    const newCourse= new CourseData({course});
    await newCourse.save();
    res.status(201).send("added successfully");

});

 
// delete the course 
app.delete('/deleteCourse/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        // Delete all subjects, tests, and questions related to the course
        await SubjectData.deleteMany({ courseId }); // Deletes all subjects related to the course
        await ExamData.deleteMany({ courseId }); // Deletes all exams related to the course
        await TestData.deleteMany({ courseId }); // Deletes all questions related to the course

        // Delete the course itself
        const deletedCourse = await CourseData.findByIdAndDelete(courseId);

        // If no course was found, return a 404 error
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Send a success response
        res.status(200).json({ message: "Course and all related data deleted successfully" });
    } catch (error) {
        console.error("Error deleting course and related data:", error);
        res.status(500).json({ message: "Error deleting course and related data" });
    }
});


// fetch all the list of courses availbale 
app.get('/getCoursesName',async(req,res)=>{
    const courses = await CourseData.find();
    res.json(courses);
});

// fetch all the list of subjects and tests availbale 
app.get('/getTestsAndSubjects',async(req,res)=>{
    const tests = await ExamData.find();
    const subjects = await SubjectData.find();
    res.json({tests,subjects});
});

// fetch all the list of tests and subjects from the selected course 
app.post('/getTestsAndSubjects',async(req,res)=>{
    const {course} = req.body;
    let courseName = course.toUpperCase();
    const tests = await ExamData.find({courseName});
    const subjects = await SubjectData.find({ courseName });
    res.status(200).json({tests,subjects});
});

// app.post('/getStudentDashboardData',async(req,res)=>{
//     const {userId,course} = req.body;
//     let courseName = course.toUpperCase();
//   try {
//     const tests = await ExamData.find({courseName});
//     const testCount = await ExamData.countDocuments({courseName});
 
//     const attemptdata = await AttemptData2.findOne({userId,course});
//     const resultdata = await ResultData2.findOne({userId,course});
//     let testGiven = 0;
//     let testNotGiven = 0;
//     let passedTest =0;
//     let failedTest =0;
    
//     for (const test of tests){
//        const attempt = attemptdata?.attempts.find((data)=>data.test === test.test);
//        if(attempt){
//          attempt.status === "completed" ? ++testGiven : ++testNotGiven;
//        }
//        else {
//         ++testNotGiven;
//       }
//     }

//     for (const test of tests){
//        const result = resultdata?.results.find((data)=>data.test === test.test);
//        if(result && result.status){
//          result.status === "Passed" ? ++passedTest : ++failedTest;
//        }
//        else {
//         ++testNotGiven;
//       }
//     }
//     res.status(200).json({testCount,testGiven,testNotGiven,passedTest,failedTest});
//   }
//   catch(error){
//    res.status(500).json({ error: "An error occurred while fetching dashboard data" });
//   }
// });

app.post('/getStudentDashboardData', async (req, res) => {
  const { userId, course } = req.body;
  const courseName = course.toUpperCase();

  try {
    // Fetch tests, attempt data, and result data
    const tests = await ExamData.find({ courseName });
    const testCount = tests.length;
    const attemptData = await AttemptData2.findOne({ userId, course });
    const resultData = await ResultData2.findOne({ userId, course });

    // Initialize counters
    let testGiven = 0;
    let testNotGiven = 0;
    let passedTest = 0;
    let failedTest = 0;

    // Process test attempts
    for (const test of tests) {
      const attempt = attemptData?.attempts.find((data) => data.test === test.test);
      if (attempt) {
        attempt.status === "completed" ? ++testGiven : ++testNotGiven;
      } else {
        ++testNotGiven;
      }
    }

    // Process test results
    for (const test of tests) {
      const result = resultData?.results.find((data) => data.test === test.test);
      if (result && result.status) {
        result.status === "Passed" ? ++passedTest : ++failedTest;
      }
    }

    res.status(200).json({ testCount, testGiven, testNotGiven, passedTest, failedTest });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "An error occurred while fetching dashboard data" });
  }
});

//add subject to the subject collection of the particular course
// app.post('/addSubject',async(req,res)=>{
//     const {subject,courseId} = req.body;
    
//     const existingSubject = await SubjectData.findOne({subject,courseId});
//     if(existingSubject){
//         return res.status(400).send('Subject exists ');
//     }
//     const newSubject = new SubjectData({subject,courseId});
//     await newSubject.save();

//     //update the subject array of course collection with the new added subject
//     const course = await CourseData.findById(courseId);
//     course.subject.push(newSubject._id);
//     await course.save();
//     res.status(201).send("subject added successfuly");
// })

app.post('/addSubject', async (req, res) => {
    const { subject, courseId } = req.body;

    try {
        const course = await CourseData.findById(courseId);
        const courseName = course.course;
        const existingSubject = await SubjectData.findOne({ subject, courseId });
        if (existingSubject) {
            return res.status(400).send('Subject already exists.');
        }
        const newSubject = new SubjectData({ subject, courseName,courseId });
        await newSubject.save();

        // Update the course's subject array
        
        if (course) {
            course.subjects.push({ subjectId: newSubject._id, subjectName: newSubject.subject });
            await course.save();
            return res.status(201).send("Subject added successfully");
        } else {
            return res.status(404).send("Course not found");
        }
    } catch (error) {
        console.error("Error in /addSubject:", error);
        return res.status(500).send("Internal server error");
    }
});


// delete the subject 
app.delete('/deleteSubject/:subjectId', async (req, res) => {
    const { subjectId } = req.params;

    try {
       
        // Delete the subject
        const deletedSubject = await SubjectData.findByIdAndDelete(subjectId);

        // If no sunject was found, return a 404 error
        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Send a success response
        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(500).json({ message: "Error deleting subject" });
    }
});



//add test of the particular course 
app.post('/addTest',async(req,res)=>{
const {test,description,courseId} = req.body;

const course = await CourseData.findById(courseId);
const courseName = course.course;
const existingTest = await ExamData.findOne({ test, courseId });
        if (existingTest) {
            return res.status(400).send('Test already exists.');
        }
        const newTest = new ExamData({ test,description, courseName,courseId });
        await newTest.save();

        // Update student attempts using $addToSet
        await AttemptData2.updateMany(
            { course: courseName }, // Filter students of the given course
            { 
                $addToSet: { 
                    attempts: { 
                        test: test,
                        status: 'not attempted', 
                        start: null, 
                        end: null 
                    } 
                } 
            }
        );

        res.status(201).send("test added successfully");

});

// delete the exam 
app.delete('/deleteExam/:examId/:course/:test', async (req, res) => {
    const { examId,course,test} = req.params;

    try {
       
        await TestData.deleteMany({ course,testBox:test }); // Deletes all questionss related to the test
        // Delete the exam
        const deletedExam = await ExamData.findByIdAndDelete(examId);

        // If no exam was found, return a 404 error
        if (!deletedExam) {
            return res.status(404).json({ message: "exam not found" });
        }

        // Send a success response
        res.status(200).json({ message: "exam deleted successfully" });
    } catch (error) {
        console.error("Error deleting exam:", error);
        res.status(500).json({ message: "Error deleting exam" });
    }
});


// Fetch all questions

app.get('/admin/questions', async (req, res) => {
  try {
      const questions = await QuestionData.find(); // Fetch all questions
      res.json(questions);
  } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).send('Server error');
  }
});


//get the question for the admin update question page
app.get('/getQuestion/:questionId',async(req,res)=>{
    const {questionId} = req.params;
    const question = await QuestionData.findById(questionId);
    if(!question){
        return res.status(400).send("no question matched");
    }
    res.json(question);
});

//update the question 

app.put(
  "/updateQuestion/:questionId",
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "option1", maxCount: 1 },
    { name: "option2", maxCount: 1 },
    { name: "option3", maxCount: 1 },
    { name: "option4", maxCount: 1 },
  ]),
  async (req, res) => {
    const { questionId } = req.params;
    const { correctAnswer, course, subject, level, testBox } = req.body;

    try {
      // Get the original question from the database to check the current filenames for images
      const originalQuestion = await QuestionData.findById(questionId);

      if (!originalQuestion) {
        return res.status(404).json({ message: "Question not found." });
      }

      // Safely build the updated data
      const updatedData = {
        question: req.files?.["questionImage"]?.[0]?.filename || originalQuestion.question,
        options: [
          req.files?.["option1"]?.[0]?.filename || originalQuestion.options[0],
          req.files?.["option2"]?.[0]?.filename || originalQuestion.options[1],
          req.files?.["option3"]?.[0]?.filename || originalQuestion.options[2],
          req.files?.["option4"]?.[0]?.filename || originalQuestion.options[3],
        ],
        correctAnswer: correctAnswer || originalQuestion.correctAnswer,
        course: course || originalQuestion.course,
        subject: subject || originalQuestion.subject,
        level: level || originalQuestion.level,
        testBox: testBox || originalQuestion.testBox,
      };

      const updatedQuestion = await QuestionData.findByIdAndUpdate(
        questionId,
        updatedData,
        { new: true }
      );

      if (!updatedQuestion) {
        return res.status(404).json({
          message: "Question not found. Update failed.",
        });
      }

      res.json({
        message: "Question updated successfully",
        updatedQuestion,
      });
    } catch (error) {
      console.error("Error updating question:", error.message, error.stack);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
);


// delete the question 
app.delete('/deleteQuestion/:questionId', async (req, res) => {
    const { questionId } = req.params;

    try {
        // Attempt to delete the question by its ID
        const deletedQuestion = await QuestionData.findByIdAndDelete(questionId);

        // If no question was found with the given ID, return a 404 error
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Send a success response
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);

        // Send an error response
        res.status(500).json({ message: "Error deleting question" });
    }
});





// sample ..................................-------------------------------------------------..........................................

// const multer  = require('multer')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage: storage });

//  const imageData =upload.fields([
//      {name:"questionImage",maxCount:1},
//      {name:"option1",maxCount:1},
//      {name:"option2",maxCount:1},
//      {name:"option3",maxCount:1},
//      {name:"option4",maxCount:1},
// ]);
// app.post("/addQues",imageData,async(req,res)=>{
//     try{
//         const {correctAnswer,course,subject,level,testBox}  = req.body;
//         const questionData ={
//             question:req.files["questionImage"][0].filename,
//             options:[
//                req.files["option1"][0].filename,
//                req.files["option2"][0].filename,
//                req.files["option3"][0].filename,
//                req.files["option4"][0].filename,
//             ],
//             correctAnswer,
//             course,
//             subject,
//             level,
//             testBox,
//         };
//         const newQuestion = new QuestionData(questionData);
//         await newQuestion.save();
//         res.status(201).send("Question Added Successfully");
//     }
//     catch(err){
//         res.status(500).send("Error adding question.");
//     }
// });

// const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, "uploads/"); // Ensure this directory exists
//    },
//    filename: function (req, file, cb) {

//       const uniqueName = `${Date.now()}-${file.originalname}`;
//       cb(null, uniqueName);
//    },
// });

// const upload = multer({ storage: storage });











//server listening port ---------------------------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port,()=>console.log("server is running "));





