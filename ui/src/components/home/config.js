export const contractConfig = {
  address: '0x9c7ACBb796F8acA9456A4f45fA21cdCf4A7A9e64',
  url: 'https://api.s0.b.hmny.io',
  abi: [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cnt",
          "type": "uint256"
        }
      ],
      "name": "getContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  defaultGasPrice: '0.005',
  defaultGasLimit: '1000000',
  eventApiDomain: 'https://harmony-explorer-testnet.firebaseio.com',
}
