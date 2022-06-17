const Joi = require("joi");
const fs = require("fs/promises");
const jpc = require("joi-password-complexity");

// const UserToken = require("../models/UserToken");
// const AccessToken = require("../models/accessToken");
// const toPdf = require("../mso-pdf/mso-pdf");

const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

const path = require("path");

//models are imported here
const Status = require("../models/Status");

const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SCRET,
  process.env.REDIRECT_URI
);

OAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

async function sendMail(
  reciever,
  subject,
  text,
  html,
  attachments,
  time,
  data,
  user
) {
  try {
    //list out the files inside the folder
    const p = path.join(__dirname, `../uploads/`);
    console.log("path : " + p);
    // const files = await fs.promises.readdir(attachments[0].path);
    // for (const file of files) console.log(file);

    fs.readdir(p).then((files) => {
      console.log("files : " + files);
      for (const file of files) {
        fs.readdir(path.join(p, file)).then((f) => {
          console.log(f);
        });
      }
    });

    const accesstoken = await OAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SCRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accesstoken.token,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: reciever,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments,
    };

    setTimeout(async () => {
      transporter
        .sendMail(mailOptions)
        .then((info) => {
          Status.findOneAndUpdate({ userid: user._id }).then((s) => {
            s.status.push({
              status: "Mail sent",
              data: data,
              bool: true,
            });
            s.save();
          });
          console.log("Email send: " + info);
        })
        .catch((err) => {
          Status.findOneAndUpdate({ userid: user._id }).then((s) => {
            s.status.push({
              status: "Mail not sent",
              data: data,
              bool: false,
            });
            s.save();
          });
          console.log("Error : " + err);
        });
    }, time);
  } catch (error) {
    console.log(error);
  }
}

const JOISchema = {
  account: Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9]*$/)
      .min(3)
      .max(16)
      .required(),
    email: Joi.string().email().required().label("Email"),
    password: jpc().required().label("Password"),
  }),
  accountlogin: Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9]*$/)
      .min(3)
      .max(16)
      .required(),
    password: jpc().required().label("Password"),
  }),
  token: Joi.object({
    refreshtoken: Joi.string().required().label("Refresh Token"),
  }),
};

// const validRefreshToken = async (refreshToken) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_PRIVATE_TOKEN_SECRET,
//       (err, decoded) => {
//         if (err) {
//           return reject({ message: "Invalid refresh token" });
//         }
//         return resolve({
//           token: decoded,
//           message: "Valid refresh token",
//         });
//       }
//     );
//   });
// };

// const generateToken = async (user) => {
//   try {
//     const accessToken = await jwt.sign(
//       {
//         email: user.email,
//       },
//       process.env.ACCESS_PRIVATE_TOKEN_SECRET,
//       {
//         expiresIn: "10m",
//       }
//     );

//     const refreshToken = await jwt.sign(
//       {
//         email: user.email,
//       },
//       process.env.REFRESH_PRIVATE_TOKEN_SECRET,
//       {
//         expiresIn: "30d",
//       }
//     );

//     UserToken.findOne({ user: user._id }).then(async (t) => {
//       if (t) await t.remove();
//       await new UserToken({
//         userId: user._id,
//         token: refreshToken,
//       }).save();
//     });

//     AccessToken.findOne({ user: user._id }).then(async (t) => {
//       if (t) await t.remove();
//       await new AccessToken({
//         userId: user._id,
//         token: accessToken,
//       }).save();
//     });
//     return Promise.resolve({ accessToken, refreshToken });
//   } catch (error) {
//     //error should be handled from where it is calling this function
//     return Promise.reject(error);
//   }
// };

/****************************************************** */
/****************************************************** */

const convert2PDFandMail = async (
  // dirname,
  base_folder,
  filename,
  i,
  jsonData,
  user
) => {
  // toPdf.convert(
  //   path.join(__dirname, `../uploads/${base_folder}`, filename + i + "G.ppt"),
  //   path.join(__dirname, `../uploads/${base_folder}`, filename + i + "G.pdf"),
  //   async function (errors) {
  //     if (errors) console.log(errors);

  //     console.log(
  //       "ppt file located here",
  //       path.join(
  //         __dirname,
  //         `../uploads/${base_folder}`,
  //         filename + i + "G.ppt"
  //       )
  //     );
  //     console.log(
  //       "generated pdf is located here",
  //       path.join(
  //         __dirname,
  //         `../uploads/${base_folder}`,
  //         filename + i + "G.pdf"
  //       )
  //     );

  //     console.log("pdf generated for " + filename + i + "G.ppt");
  //   }
  //   );
  const fileInput = await fs.readFile(
    path.join(__dirname, `../uploads/${base_folder}`, filename + i + "G.ppt")
  );
  libre.convertAsync(fileInput, "pdf", undefined).then((pdfBuff) => {
    fs.writeFile(
      path.join(__dirname, `../uploads/${base_folder}`, filename + i + "G.pdf"),
      pdfBuff
    ).then(async () => {
      console.log("pdf generated for " + filename + i + "G.ppt");
      await sendMail(
        jsonData[i]["EMAIL"],
        `Certificate:  ${jsonData[i]["CATEGORY"]}`,
        `Here is your certificate for ${jsonData[i]["CATEGORY"]}, the file is attached to the mail.`,
        `<h2>Here is your certificate for <b>${jsonData[i]["CATEGORY"]}</b>, the file is attached to the mail.</h2>`,
        [
          {
            filename: `${jsonData[i]["NAME"]}_certificate.pdf`,
            path: path.join(
              __dirname,
              `../uploads/${base_folder}`,
              filename + i + "G.pdf"
            ),
          },
        ],
        1000 * i,
        jsonData[i],
        user
      );
    });
  });
};

const rmFolder = (dirname, base_folder) => {
  fs.rm(
    path.join(dirname, `../uploads/`, base_folder),
    { recursive: true, force: true },
    (err) => {
      if (err) {
        throw err;
      }

      console.log(
        `\n\n${path.join(dirname, `../uploads/`, base_folder)} is deleted!`
      );
    }
  );
  console.log(base_folder + " folder deleted");
};

module.exports = {
  JOISchema,
  // generateToken,
  // validRefreshToken,
  convert2PDFandMail,
  rmFolder,
};
