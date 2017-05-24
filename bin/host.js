var phantomjs = require('phantomjs-prebuilt');
var nodemailerSettings = require('./settings.nodemailer.json');
var program = phantomjs.exec('./bin/parser.js');
program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', function () {
    var fs = require('fs');
    fs.readdir('output', function (err, files) {
        var freshCars = [];
        files.forEach(function (file) {
            var cars = JSON.parse(fs.readFileSync('output/' + file, 'utf8'));
            cars.forEach(function (car) {
                if (car.fresh === true) {
                    car.fresh = false;
                    freshCars.push(car);
                    console.log('new! ' + car.url);
                }
            });
            fs.writeFile('output/' + file, JSON.stringify(cars));
        });
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport(nodemailerSettings.mailer);
        var html = '<ul>';
        freshCars.forEach(function (car) {
            html += "<li><a href=\"https://avito.ru/" + car.url + "\">" + car.description + " / " + car.price + "</a></li>";
        });
        html += '</ul>';
        var mailOptions = {
            from: nodemailerSettings.mailOptions.from,
            to: nodemailerSettings.mailOptions.to,
            subject: freshCars.length + " new cars!",
            html: html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    });
});
