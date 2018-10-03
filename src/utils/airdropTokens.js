const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const web3 = new Web3();
// FIXME URL部分は適宜書き換えてください。
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/v3/7176a78a223348978e81566e54b30cfc'));

// FIXME 送金先のアドレス、あなたの秘密鍵、そしてコントラクトアドレスです。
const target = '0x6d6B1C7C339deBBD3Ae44c845308b0Ba9759EC3D';
const privateKey = '7BC7767D1314906F57B7C5CC8297FEE9D76446EE6E61D4DEE9362FF24F6E5A50';
const contractAddress = '0xd556Da745f046Ab8C66060773606241320f35704';

// 秘密鍵からアカウントを取得します。
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

// FIXME ABIファイルを読み込む必要があるので、用意するなどしてください。ちなみにABIはjsonなのでrequireで読み込めます。
//const abi = require('airdropAbi.json')


const abi = [{
  'constant': false,
  'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
  'name': 'transfer',
  'outputs': [{'name': 'success', 'type': 'bool'}],
  'payable': false,
  'stateMutability': 'nonpayable',
  'type': 'function'
},{
  'constant': true,
  'inputs': [],
  'name': 'decimals',
  'outputs': [{'name': '', 'type': 'uint256'}],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
}];
const contract = new web3.eth.Contract(abi, contractAddress);

const parameter = {
  from: account.address,
  to: contractAddress
};

contract.methods.decimals().call()
  .then((decimals) => {
    /*
    transferの2つめの引数は送金額です。この場合だと100.0を送金します。
    罠として、ERC20トークンにおけるamountなどの概念は小数点以下の桁数(decimals)に大きく左右されます。
    例として、decimalsが0の場合に一番少ない数は当然1ですが、decimalsが1の場合でも1です。decimalsが18でも1です。
    つまり、decimalsが1の場合に1.0を表すのは10になりますし、18の場合で1.0を表す場合は1000000000000000000になります。
    ですから、コード通りに(10 ** decimals)をかけてあげることで適切な値にしています。
    */
    parameter.data = contract.methods.transfer(target, 100 * (10 ** decimals)).encodeABI();
    return web3.eth.estimateGas(parameter);
  })
  .then((gasLimit) => {
    // estimateGasを実行した瞬間とトランザクションを送信する瞬間で変化が起きる可能性があるので若干の余裕を持たせると安心です。
    parameter.gasLimit = web3.utils.toHex(gasLimit + 100000);
    console.info(parameter.gasLimit);
    return web3.eth.getGasPrice();
  })
  .then((gasPrice) => {
    parameter.gasPrice = web3.utils.toHex(gasPrice);
    console.info(parameter.gasPrice);
    return web3.eth.getTransactionCount(account.address);
  })
  .then((count) => {
    /*
    この場合、nonceはgetTransactionCountの値をそのまま入れれば良いですが、実際はトランザクション毎にインクリメントする必要がある値ですから、トランザクションを複数生成する際はその点注意が必要です。
    具体的には、複数のトランザクションを作成して、その後にsendするようなケースの場合に、nonceのインクリメントを忘れていて同一の値になっていると1つ目以降のトランザクションはエラーになってしまいます。
    */
    parameter.nonce = count;
    const transaction = new Tx(parameter);
    transaction.sign(Buffer.from(account.privateKey, 'hex'));
    web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
      .once('transactionHash', (hash) => {
        console.info('transactionHash', 'https://etherscan.io/tx/' + hash);
      })
      .once('receipt', (receipt) => {
        console.info('receipt', receipt);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.info('confirmation', confirmationNumber, receipt);
      })
      .on('error', console.error);
  })
  .catch(console.error);
