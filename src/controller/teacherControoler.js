var Quiz = require("../models/quiz.js");
var User = require("../models/user.js");
var Question = require("../models/question.js");
const jwt = require("jsonwebtoken");

exports.createQuiz = (req, res) => {
  Oid = req.userId;
  Oemail = req.email;
  var quiz = new Quiz({
    quizname: req.body.quizname,
    quizdescription: req.body.description,
    owner: Oid,
    owneremail: Oemail,
  });
  quiz.save((error, qz) => {
    if (error) {
      //console.log(error);
      res.json({ msg: "some error!" });
    } else {
      res.status(200).json({ message: "Quiz added" });
    }
  });
};

exports.getUploadquiz = (req, res) => {
  Quiz.find({ owner: req.userId, upload: false }, (err, qz) => {
    if (err) {
      // console.log(error);
      res.json({ msg: "some error!" });
    } else {
      res.json({ quiz: qz });
    }
  });
};

exports.seeStudent = (req, res) => {
  User.find({ role: "student" }, (err, usr) => {
    // console.log("student " + usr.length);
    if (err) {
      //console.log(error);
      res.json({ msg: "some error!" });
    } else {
      res.json({ user: usr });
    }
  });
};

exports.seeTeacher = (req, res) => {
  User.find({ role: "teacher" }, (err, usr) => {
    if (err) {
      // console.log(error);
      res.json({ msg: "some error!" });
    } else {
      res.json({ user: usr });
    }
  });
};

exports.getallquiz = (req, res) => {
  Quiz.find({}, (err, qz) => {
    if (err) {
      //console.log(error);
      res.json({ msg: "some error!" });
    } else {
      res.json({ quiz: qz });
    }
  });
};

exports.addQuestion = (req, res) => {
  Question.find({ quizid: req.body.quizid }, (err, q) => {
    if (err) {
      //console.log(error);
      res.json({ msg: "some error!" });
    } else {
      var question = new Question({
        quizid: req.body.quizid,
        questionId: q.length + 1,
        questionText: req.body.questionText,
        answer: req.body.answer,
        options: req.body.options,
      });

      question.save((error, qsn) => {
        if (error) {
          //console.log(error);
          res.json({ msg: "some error!" });
        } else {
          res.status(200).json({ message: "Question added" });
        }
      });
    }
  });
};

exports.uploadQuiz = (req, res) => {
  //console.log(req.body);
  Question.find({ quizid: req.body.id }, (err, qz) => {
    if (err) {
      //console.log(error);
      res.json({ msg: "some error!" });
    } else {
      if (qz.length < 5) {
        res.json({
          msg: "You must have 5 question in the quiz for upload quiz",
        });
      } else {
        Quiz.updateOne(
          { _id: req.body.id },
          { upload: true },
          function (err, user) {
            if (err) {
              //console.log(err);
              res.json({ msg: "something went wrong!!" });
            } else {
              const io = req.app.get("io");
              io.emit("quizcrud", "Quiz Curd done here");
              res.json({ message: "quiz uploaded!" });
            }
          }
        );
      }
    }
  });
};

exports.deleteQuiz = (req, res) => {
  var id = req.params.id;
  // console.log(req.params.id);
  Quiz.deleteOne({ _id: id }, (err) => {
    if (err) {
      res.json({ msg: "Somthing went wrong!!" });
    }
  });
  Question.deleteMany({ quizid: id }, (err) => {
    if (err) {
      res.json({ msg: "Somthing went wrong!!" });
    }
  });
  const io = req.app.get("io");
  io.emit("quizcrud", "Quiz Curd done here");
  res.status(200).json({ msg: "yes deleted user " });
};

exports.getHomequiz = (req, res) => {
  Quiz.find({ owner: req.userId, upload: true }, (err, qz) => {
    if (err) {
      // console.log(error);
      res.json({ msg: "some error!" });
    } else {
      res.json({ quiz: qz });
    }
  });
};

exports.getAllQuestion = (req, res) => {
  Question.find({ quizid: req.params.id }, (err, qz) => {
    if (err) {
      //console.log(error);
      res.json({ errormsg: "some error!" });
    } else {
      res.json({ msg: qz });
    }
  });
};

exports.deleteQuestion = (req, res) => {
  var id = req.params.id;
  Question.deleteOne({ _id: id }, (err) => {
    if (err) {
      res.json({ msg: "Somthing went wrong!!" });
    }
  });
  res.json({ msg: "yes deleted  " });
};

exports.verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("unauthorized req");
  }
  let token = req.headers.authorization.split(" ")[1];
  // console.log(token);
  if (token == "null") {
    return res.status(401).send("unauthorized req");
  }
  let payload = jwt.verify(token, "secretkey");
  if (!payload) {
    return res.status(401).send("unauthorized req");
  }
  req.userId = payload.subject;
  req.email = payload.email;
  next();
};
