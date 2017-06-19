/// <reference path="./../CarOutput.ts" />
import CarOutput = Avito.CarOutput;

const phantomjs = require('phantomjs-prebuilt');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const nodemailerSettings = require('./settings.nodemailer.json');

schedule.scheduleJob('*/10 * * * *', function () {
    exec();
});
exec();

function exec() {
    var program = phantomjs.exec('./bin/parser.js');
    program.stdout.pipe(process.stdout);
    program.stderr.pipe(process.stderr);
    program.on('exit', function () {
        const fs = require('fs');
        fs.readdir('output', (err, files) => {
            let freshCars:Array<CarOutput> = [];
            files.forEach(file => {
                var cars:Array<CarOutput> = JSON.parse(fs.readFileSync('output/' + file, 'utf8'));
                cars.forEach(car => {
                    if (car.fresh === true) {
                        car.fresh = false;
                        freshCars.push(car);
                        console.log('new! ' + car.url);
                    }
                });
                fs.writeFile('output/' + file, JSON.stringify(cars));
            });

            if (freshCars.length) {
                notifyByEmail(freshCars);
            }
        });
    });
}

function notifyByEmail(freshCars:Array<CarOutput>) {
    let transporter = nodemailer.createTransport(nodemailerSettings.mailer);
    let html = '<ul>';
    freshCars.forEach(car => {
        html += `<li><a href="https://avito.ru/${car.url}">${car.description} / ${car.url} / ${car.price}</a></li>`;
    });
    html += '</ul>';

    let mailOptions = {
        from: nodemailerSettings.mailOptions.from,
        to: nodemailerSettings.mailOptions.to,
        subject: `${freshCars.length} new cars!`,
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}