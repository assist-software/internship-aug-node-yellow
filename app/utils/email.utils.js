const nodeMailer = require('nodemailer');

exports.send = function (req, res) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,  //true for 465 port, false for other ports
        auth: {
            user: 'testprogramareasi@gmail.com',
            pass: 'Test@123'
        }
    });
    const mailOptions = {
        from: '"Your Name" <testprogramareasi@gmail.com>', // sender address
        to: 'andrei.seby45@yahoo.com', // list of receivers
        subject: 'Test send email  ', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };
    transporter.send(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(400).send({ success: false })
        } else {
            res.status(200).send({ success: true });
        }
    });
}