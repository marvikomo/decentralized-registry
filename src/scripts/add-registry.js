const fs = require('fs')
const path = require('path')
const {
  getContractInstance,
  getSignerAddress,
  getEvent,
} = require('../util/web3.util')
const { create } = require('ipfs-http-client')

const projectId = process.env.PROJECT_ID

const projectSecretKey = process.env.PROJECT_SECRETE

const authorization = 'Basic ' + btoa(projectId + ':' + projectSecretKey)

const registryAbi = require('../abis/registry.json')

const contractAddress = '0x1240F511C00Bf1a39610A5ED207D5715E87eE3bF'

// Connect to an IPFS node
const ipfs = create({
  host: 'ipfs.infura.io', // Corrected host without the protocol part
  port: 5001,
  protocol: 'https',
  headers: {
    authorization,
  },
})


console.log(`Current directory: ${process.cwd()}`)



// Function to upload a file to IPFS
async function uploadFile(filePath) {
  try {
    const file = fs.readFileSync(filePath)
    const fileAdded = await ipfs.add({
      path: path.basename(filePath),
      content: file,
    })
    console.log(`Uploaded ${filePath} to IPFS with hash ${fileAdded.cid}`)
    return fileAdded.cid.toString()
  } catch (error) {
    console.error(`Error uploading ${filePath}: `, error)
    return null
  }
}

// Function to find and upload the specified file
async function uploadSpecifiedFile(fileName) {
  const filePath = path.join(__dirname, '../pdfs/' + fileName)
  console.log('filePath', filePath)

  // Check if the file exists and is a PDF
  if (
    fs.existsSync(filePath) &&
    path.extname(fileName).toLowerCase() === '.pdf'
  ) {
    return await uploadFile(filePath)
  } else {
    console.log('File does not exist or is not a PDF:', fileName)
  }
}
//https://ipfs.io/ipfs/QmNuhLLueoEtPcp919fv98rmGgKPb42xAHgEmXn5LmiG2L

const run = async (fileName, dappAddress, dappName) => {
  try {
    let hash = await uploadSpecifiedFile(fileName)
    console.log('hash', hash)

    const registryContractInstance = await getContractInstance(
      contractAddress,
      registryAbi,
    )

    // console.log('registryContractInstance', registryContractInstance)

    let resoponse = await registryContractInstance.registerDApp(
      dappAddress,
      dappName,
      hash,
      {
        from: getSignerAddress(),
      },
    )

    console.log('resoponse', resoponse)
  } catch (err) {
    console.log('Error happened on the trigger job ', err)
  }
}

// Read the filename from the command line arguments
const args = process.argv.slice(2) // Skip the first two default entries

if (args.length < 1) {
  console.log('Please specify a file name')
  process.exit(1)
}

const fileName = args[0]
const dappAddress = args[1]
const dappName = args[2]

run(fileName, dappAddress, dappName).catch(console.error)
