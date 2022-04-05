var Quiz = require("../models/quiz.js");
var Question = require("../models/question.js");
const jwt = require("jsonwebtoken");

exports.getallquiz = (req, res) => {
  Quiz.find({ upload: true }, (err, qz) => {
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

exports.verifyToken = (req, res, next) => {
  //console.log(req.headers.authorization.split(" ")[1]);
  if (!req.headers.authorization) {
    return res.status(401).send("unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  // console.log(token);
  if (token == "null") {
    return res.status(401).send("unauthorized request");
  }
  let payload = jwt.verify(token, "secretkey");
  if (!payload) {
    return res.status(401).send("unauthorized request");
  }
  req.userId = payload.subject;
  req.email = payload.email;
  next();
};
