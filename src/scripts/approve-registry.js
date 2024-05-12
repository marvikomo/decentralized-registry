const fs = require('fs');
const path = require('path');
const {
    getContractInstance,
    getSignerAddress,
  } = require('../util/web3.util')




  const registryAbi = require('../abis/registry.json')
  
  const contractAddress = "0x1240F511C00Bf1a39610A5ED207D5715E87eE3bF"



  const run = async (dappAddress) => {
    try {

      const registryContractInstance = await getContractInstance(
        contractAddress,
        registryAbi,
      )


     let resoponse = await  registryContractInstance.approveDApp(dappAddress, {
        from: getSignerAddress(),
      })

     console.log('resoponse', resoponse)
  
  
    } catch (err) {
      console.log('Error happened on the trigger job ', err)
    }
  }


  // Read the filename from the command line arguments
const args = process.argv.slice(2); // Skip the first two default entries

if (args.length < 1) {
  console.log("Please specify a file name");
  process.exit(1);
}

const dappAddress = args[0];

  

run(dappAddress).catch(console.error);
 