const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "this is our little secret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const user = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  const newUser = new user({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/login", (req, res) => {
  user.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, () => {
  console.log("server started at port 3000");
});
