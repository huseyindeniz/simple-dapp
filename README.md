# simple-dapp
Simple decentralized application (dApp) demonstration

# How to run?

1. Download [Ganache](https://trufflesuite.com/ganache/)
2. Start Ganache, create a new ethereum workspace, start it and leave it as open 
3. Open the blokchain folder with VSCode
4. Open terminal
5. Run ```npx hardhat run scripts/deploy.ts```
6. You will see the address of the HelloWorld contract on the console log. Copy it.
7. Open the frontend folder with VSCode
8. Open the file src/features/helloWorld/chains/ganache.ts
9. Paste the contract address you copied before into the contract address variable and save it.
10. Run ```npm i``` and then run ```npm start```, it will open the simple-dapp in your browser
11. Open Metamask and import any acccount from Ganache
12. Click the Connect button in the simple-dapp application


![gif](https://github.com/huseyindeniz/simple-dapp/raw/main/docs/Animation4.gif)
