const fs = require('fs');
const path = require('path');
const {
    getContractInstance,
  } = require('../util/web3.util')



  const registryAbi = require('../abis/registry.json')
  
  const contractAddress = "0x1240F511C00Bf1a39610A5ED207D5715E87eE3bF"




  const run = async (e) => {
    try {

      const registryContractInstance = await getContractInstance(
        contractAddress,
        registryAbi,
      )

     let resoponse = await  registryContractInstance.getAllDAppsDetails()

     console.log('resoponse', resoponse)
  
  
    } catch (err) {
      console.log('Error happened on the trigger script ', err)
    }
  }


  

run().catch(console.error);