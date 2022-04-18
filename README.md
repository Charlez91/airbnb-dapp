# Airbnb-Starter

A decentralized version of airbnb with node, moralis, web3uikit and solidity on polygon(https://polygonscan.com/address/0xb0e1b6fe8a2D7D2a9Aa740Ee324B1f3B4E30b546). The solidity smart contract was written using the truffle framework while the front end was written using react. Database storage for static file was using ipfs. while storage for bookings and all was on the blockchain.


Run yarn to install dependencies and run yarn start to run app.

The airbnb folder contains the smart contract written in the truffle framework. <code>npm install -g truffle</code> and run '<code>truffle compile</code>' and <code>truffle migrate --network matic</code> to deploy to polygonscan. I have already configured the polygon nodes  and truffle config to deploy on matic network. You need to create a .env file and put your mnemonic phrase in. You can use the AIRBNB.sol file in remix as an alternative though.

A dockerfile is written by me and added incase you want to containerize your app. run <code>docker build -ti <--your preferred name--> </code>to build a docker image. den run <code>docker run -tid 3000:3000 <--preferred name --></code> to run container of app. read docker documentation for more. this docker file was intended for windows people do have issues running with yarn on mac special config is required.
