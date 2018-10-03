<template>
  <q-page
    padding
    class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <h3>3.挂单详细页面</h3>
      <br>
      <br>
      倒计时：剩余01天 04:21:00
      <br>
      <br>
      合约地址：0x9a51f8fdd2d43c79da4549d452d35970bbefc48f
      <br>
      <br>
      Token名：CBB
      <br>
      <br>
      数   量：1000
      <br>
      <br>
      结束时间：2018-10-04 04:21:00
      <br>
      <br>
      起拍价格：0.1
      <br>
      <br>
      现在价格：0.88
      <br>
      <br>
      <q-input
        v-model="inputTokenAmount"
        type="number"
        float-label="出价（ETH）"
        placeholder="1"/>
      本次应付款： 0.12 ETH
      <br>

      <q-btn
        label="确定出价"
        color="primary"
        @click="sendToken"/>
      <br>
      <br>
      是否结算：未结算
      <br>
      <q-btn
        label="手动结算"
        color="red"
        @click="sendToken"/>

      <h5>历史出价</h5>
      <table class="q-table">
        <thead>
        <tr>
          <th class="text-left">出价（ETH）</th>
          <th class="text-left">出价时间↑</th>
          <th class="text-left">竞价者地址</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>0.88</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
        </tr>
        <tr>
          <td>0.66</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
        </tr>
        <tr>
          <td>0.44</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
        </tr>
        <tr>
          <td>0.2</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
        </tr>
        <tr>
          <td>0.1</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
        </tr>

        </tbody>
      </table>
    </div>
  </q-page>
</template>

<script>
import ethereum from '../utils/ethereum.js'

export default {
  data: function () {
    return {
      web3: null,
      version: '',
      account: '',
      network: {},
      tokenContractAddress: '0x9a51f8fdd2d43c79da4549d452d35970bbefc48f',
      toAddress: '0x5d12c33385446f27a953b3cc9df99cdcc61fa4db',
      inputTokenAmount: 1

    }
  },
  created: async function () {
    console.log(ethereum)
    this.web3 = ethereum.getWeb3()
    this.version = await this.web3.version
    this.account = await ethereum.currentAccount()
    this.network = await ethereum.currentNetwork()
  },
  computed: {},
  methods: {
    async sendToken () {
      try {
        const Erc20Abi = [{
          'constant': false,
          'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
          'name': 'transfer',
          'outputs': [{'name': 'success', 'type': 'bool'}],
          'payable': false,
          'stateMutability': 'nonpayable',
          'type': 'function'
        },
        {
          'constant': true,
          'inputs': [],
          'name': 'decimals',
          'outputs': [{'name': '', 'type': 'uint256'}],
          'payable': false,
          'stateMutability': 'view',
          'type': 'function'
        }
        ]

        // Bug/Issue: decimals = ?

        const contractInstance = new this.web3.eth.Contract(Erc20Abi, this.tokenContractAddress)

        let decimals = await contractInstance.methods.decimals().call()
        console.log(decimals)

        let result = await contractInstance.methods.transfer(this.toAddress,
          (this.inputTokenAmount * (10 ** decimals)).toString())
          .send({
            from: this.account
          }).on('error', async (err) => {
            console.error(err)
          })
        console.log(result)
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>
