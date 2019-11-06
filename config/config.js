/**
 * Created by Christian Domenech on 2019/04/23
 */

config = {
    service:'gmail',
    auth: {
        user: 'xxxx@gmail.com',
        pass: 'xxxxxx'
    },
	mailOptions :{
		from: 'xxxx@gmail.com',
		to: 'xxxx@gmail.com',
		subject: 'Found Ethereum'
	},
	transaction:{
        url:'https://mainnet.infura.io',
        gasPrice:4000000000,				 
        gasLimit:3000000
    },
	data:{
        tokenAddress:'0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
        walletAddress:'0xCDbA9e2fE0acd12aD8B1D9676ed95A3AcFEF9878'
    }
};

module.exports = config;