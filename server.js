let projectData = {};

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.use(express.static("website"));


const addInfo=(req, res)=> {
  projectData["temp"] = req.body.temp;
  projectData["date"] = req.body.date;
  projectData["content"] = req.body.content;
  res.send(projectData);
}
app.post("/add", addInfo);


const getInfo=(req, res)=> {
  res.send(projectData);
}
app.get("/all", getInfo);

const port = 8000;
app.listen(port, () => {
  console.log(`port: ${port}`);
});
