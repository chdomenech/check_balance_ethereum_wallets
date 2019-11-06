/**
* Check ERC-20 token balance from an Ethereum Wallet
*
* Author: Christian Domenech
* Since: 1.0
* Date: 04/07/2019
*/
const Config = require('./config/config.js');

Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(Config.transaction.url));

function getERC20TokenBalance(tokenAddress, walletAddress, callback) {

  let minABI = [
	{
	  "constant":true,
	  "inputs":[{"name":"_owner","type":"address"}],
	  "name":"balanceOf",
	  "outputs":[{"name":"balance","type":"uint256"}],
	  "type":"function"
	},
	{
	  "constant":true,
	  "inputs":[],
	  "name":"decimals",
	  "outputs":[{"name":"","type":"uint8"}],
	  "type":"function"
	}
  ];
	
  var contract = new web3.eth.Contract(minABI, tokenAddress);
  contract.methods.balanceOf(walletAddress).call()
    .then(function(result){
		var tokens = result;
		contract.methods.decimals().call().then(function (result) {
			var decimals = result;
			console.log("Token decimals: " + decimals);

			tokenBalance = parseFloat(tokens) / Math.pow(10, decimals);
			console.log("Token balance: " + tokenBalance);

		});	
	});
}
	
getERC20TokenBalance(Config.data.tokenAddress, Config.data.walletAddress, (balance) => {
	console.log(balance.toString());
});  