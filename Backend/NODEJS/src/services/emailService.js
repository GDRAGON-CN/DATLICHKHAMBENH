require("dotenv").config();
import nodemailer from "nodemailer";
let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: `"Giang Hoc PTIT"<nguyentruonggiang2005vp@gmail.com>`,
    to: dataSend.receivedEmail,
    subject: "Thông tin đặt lịch khám bệnh",
    html: getBodyHTMLEmail(dataSend),
  });
};
let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xinchao ${dataSend.patientName} !</h3>
    <p>Bạn nhận ddc email này vì đã đặt lịch khám bệnh online </p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Nếu các thoogn tin trên đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận</p>
    <div>
    <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
    </div>
    <div>Xin chân thành cảm ơn</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName}!</h3>
    <p>You received this email because you booked a medical appointment online.</p>
    <p>Appointment details:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    <p>If the above information is correct, please click the link below to confirm your appointment.</p>
    <div>
      <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
    </div>
    <div>Thank your very much</div>
`;
  }
  return result;
};
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3> Xin Chao ${dataSend.patientName}</h3>
    <p>Ban nahn duoc email nay vi da dat lich kham benh online tren Booking Care </p>
    <p> Thong tin don thuoc/hoa don duoc gui trong file dinh kem </p>
    <div> Xin chan thanh cam on</div>
    `;
  }
  return result;
};
let sendAttachment = async (dataSend) => {
  return new Promise(async (resolveContent, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: `'Giang HOC PTIT' <nguyentruonggiang2005vp@gmail.com>`,
        to: dataSend.email,
        subject: "Ket qua dat lich kham benh",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
      resolveContent(true);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
};
