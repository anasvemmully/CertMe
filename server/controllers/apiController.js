const {
  JOISchema,
  // generateToken,
  // validRefreshToken,
  convert2PDFandMail,
  rmFolder,
} = require("../controllers/tools");

const User = require("../models/User");
const bcrypt = require("bcrypt");

const Status = require("../models/Status");

const xlsx = require("xlsx");
const uuid = require("uuid");
const path = require("path");
// const jwt = require("jsonwebtoken");
const passport = require("passport");

const carbone = require("carbone");
const fs = require("fs");

//check if upload folder exist if not exist create it
(() => {
  if (!fs.existsSync(path.join(__dirname, "../uploads"))) {
    fs.mkdirSync(path.join(__dirname, "../uploads"));
  }
})();

const registerAccountPOST = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const { error } = JOISchema.account.validate({
      username,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }
    User.exists({ email }, async (err, exists) => {
      if (err) {
        return res.status(400).json({
          message: "Something Went Wrong",
        });
      }
      if (exists) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        salt: salt,
      });
      await user.save();

      res.status(201).json({
        message: "Account created successfully",
      });
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const loginAccountPOST = async (req, res, next) => {
  try {
    console.log(req);

    passport.authenticate("local", (err, user, info) => {
      console.log("info :  " + info);
      if (err) {
        res.status(401).send({
          message: "authentication error",
        });
      } else if (!user) {
        res.status(401).send({
          message: "Incorrect Username or Password",
        });
      } else {
        req.logIn(user, (err) => {
          if (err) {
            res.status(401).send({
              message: "authentication error",
            });
          } else {
            return res.status(200).json({
              user: { username: user.username, email: user.email },
              message: "Login successful 😊 👌",
            });
          }
        });
      }
    })(req, res, next);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const logoutAccountPOST = async (req, res, next) => {
  try {
    req.logOut(() => {
      res.status(200).send({
        message: "Logout Successful",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const verifyGET = async (req, res) => {
  try {
    console.log("verify get :" + req.isAuthenticated());
    if (req.isAuthenticated()) {
      return res.status(200).json({
        user: { username: req.user.username, email: req.user.email },
        message: "User is authenticated",
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      user: null,
      message: "Something went wrong",
    });
  }
};

const upload = async (req, res) => {
  const base_folder = uuid.v4();
  try {
    const { csv, ppt } = req.files;
    if (!req.files) {
      throw new Error("No file uploaded");
    } else {
      //check if file is csv , excel or ppt
      if (csv && ppt) {
        if (
          !(
            (csv.mimetype !== "text/csv" ||
              csv.mimetype !== "application/vnd.ms-excel" ||
              csv.mimetype !==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") &&
            (ppt.mimetype !== "application/vnd.ms-powerpoint" ||
              ppt.mimetype !==
                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
              ppt.mimetype !==
                "application/vnd.openxmlformats-officedocument.presentationml.slideshow")
          )
        ) {
          throw new Error("Invalid file type");
        } else {
          //save ppt file to the uploads folder
          const filename = base_folder + ".ppt";

          //csv reading and overwriting ppt is happening here
          // also need to check if excel and csv work interchangably

          const workbook = xlsx.read(csv.data);

          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          const csvData = xlsx.utils.sheet_to_csv(worksheet);
          const jsonData = [];
          const csvLine = csvData.split("\n");
          if (!(csvLine > 50)) {
            fs.mkdirSync(path.join(__dirname, "../uploads/", base_folder));
            /********************************************************* */
            //*********CHECKING IF DIRECTORY EXISTING OR NOT********** */
            /********************************************************* */
            fs.exists(
              path.join(__dirname, "../uploads/", base_folder),
              (exists) => {
                console.log(
                  exists ? "The directory already exists" : "Not found!"
                );
              }
            );
            console.log("created base folder ");
            /********************************************************* */
            //*********CHECKING IF DIRECTORY EXISTING OR NOT********** */
            /********************************************************* */

            await ppt
              .mv(path.join(__dirname, `../uploads/${base_folder}`, filename))
              .then(() => console.log("file placed as " + filename))
              .catch((err) => {
                console.log(err);
                throw new Error("Something went wrong");
              });
            const fields = csvLine[0].split(",");
            if (!fields.includes("EMAIL")) {
              throw new Error("email column not found");
            }

            //delete the model
            Status.deleteMany({ userid: req.user._id }).then(async () => {
              await new Status({
                userid: req.user._id,
                fields: fields,
              }).save();
            });

            for (let j = 1; j < csvLine.length; j++) {
              var obj = {};
              const values = csvLine[j].split(",");

              for (let i = 0; i < fields.length + 1; i++) {
                if (i === fields.length) {
                  obj["@count"] = values.length;
                } else obj[fields[i]] = values[i];

                console.log(obj);
                if (
                  obj["EMAIL"] &&
                  !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    obj["EMAIL"]
                  )
                ) {
                  throw new Error("Invalid excel file");
                }
              }
              if (obj["@count"] !== fields.length) {
                return res.status(400).json({
                  message: "Please upload a valid excel file",
                });
              }
              jsonData.push(obj);
            }

            console.log(jsonData.length);

            for (let i = 0; i < jsonData.length; i++) {
              if (jsonData[i]["@count"] === fields.length) {
                carbone.render(
                  path.join(__dirname, `../uploads/${base_folder}`, filename),
                  jsonData[i],
                  async (err, result) => {
                    if (err) {
                      console.log(err);
                      throw new Error("Something went wrong");
                    }
                    console.log("generating certificate for  " + i);
                    fs.writeFileSync(
                      path.join(
                        __dirname,
                        `../uploads/${base_folder}`,
                        filename + i + "G.ppt"
                      ),
                      result
                    );
                    console.log("__dirname at apicontroller.js : " + __dirname);
                    console.log("base_folder at apicontroller.js : " + base_folder);

                    convert2PDFandMail(
                      // __dirname,
                      base_folder,
                      filename,
                      i,
                      jsonData,
                      req.user
                    );
                  }
                );
              } else continue;
            }

            setTimeout(() => {
              rmFolder(__dirname, base_folder);
            }, 1000 * 180);

            return res.status(200).json({
              message:
                "Certificate generated successfully, wait for few minutes",
            });
          } else {
            return res.status(400).json({
              message: "You can only upload upto 50 details",
            });
          }
        }
      } else {
        throw new Error("Invalid File type");
      }
    }
  } catch (error) {
    rmFolder(__dirname, base_folder);
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const viewStatus = async (req, res) => {
  try {
    Status.findOne({ userid: req.user._id })
      .then((status) => {
        res.status(200).json({
          message: "Status fetched",
          status: status.status,
          fields: status.fields,
        });
      })
      .catch(() => {
        throw new Error("Something went wrong");
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  registerAccountPOST,
  loginAccountPOST,
  // AccessTokenPOST,
  logoutAccountPOST,
  verifyGET,
  viewStatus,
  upload,
};
