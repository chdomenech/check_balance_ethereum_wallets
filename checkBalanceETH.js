/**
* Check ETH balance from an Ethereum Wallet
*
* Author: Christian Domenech
* Since: 1.0
* Date: 04/07/2019
*/
const Config = require('./config/config.js');

Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));
const secp256k1 = require('secp256k1');
const keccak = require('keccak');
const randomBytes = require('randombytes');
const fs = require('fs');
var util = require('util');
var nodemailer = require('nodemailer');

/** formats for error and log files*/
var end = new Date().valueOf();
var log_name = '/log/resume' + end + '.log'
var log_error = '/log/error/error' + end + '.log'


var log_file = fs.createWriteStream(__dirname + log_name, {
    flags: 'w'
});

var error_file = fs.createWriteStream(__dirname + log_error, {
    flags: 'w'
});

var log_stdout = process.stdout;


console.log = function(d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

console.error = function(d) {
    error_file.write(util.format(d) + '\n');
};
/** end format */


var transporter = nodemailer.createTransport({
    service: Config.service,
    auth: {
        user: Config.auth.user,
        pass: Config.auth.pass
    }
});

/** email options */
var mailOptions = {
	from: Config.mailOptions.from,
	to: Config.mailOptions.to,
	subject: Config.mailOptions.subject,
	text: ""
};

	/**
	* Generate/Read if exist a wallet with private key 
	* @param privateKey
	*/
	function privateKeyToAddress(privateKey) {
		const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1);
		return keccak('keccak256').update(pub).digest().slice(-20).toString('hex');
	}

	/** check 5000 wallets */
	for (var i = 0; i < 5000; i++) {

			let keyprivate = randomBytes(32);
			let fromAddress = "0x" + privateKeyToAddress(keyprivate).toString('hex');
			keyprivate = keyprivate.toString('hex')

			/** read eth balance from wallet */
			web3.eth.getBalance(fromAddress).then(function(result) {

				/** read eth amount*/
				let cantETH = web3.utils.fromWei(result, 'ether');
				
				/** print in log */
				var message = "PK : " + keyprivate + " | " + "Address : " + fromAddress + " | Balance " + cantETH + " eth";
				mailOptions.text= message;
				console.log(message); 

				/** sending email if that wallet contain eth balance */
				if (cantETH > 0) {			
				
					/** send email */
					transporter.sendMail(mailOptions, function(error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});
				}
			}).catch(e => console.error(`.catch(${e})`));
	}