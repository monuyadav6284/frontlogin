import cors from "cors";
import  express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import validator from "validator";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
 

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length >= 3;
      },
      message: "Name must have at least 3 characters",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    
  },
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull" });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now." });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
