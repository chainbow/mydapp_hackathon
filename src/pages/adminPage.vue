<template>
  <q-page
    padding
    class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <h3>4.管理员页面</h3>
      <br>
      <br>
      <h5>手续费总额: 168.2345 ETH</h5>
      <br>
      <q-input
        v-model="toAddress"
        float-label="提现至钱包"
        placeholder="0x123456787890... ..."/>
      <br>
      <q-input
        v-model="inputTokenAmount"
        type="number"
        float-label="提现数量"
        placeholder="100"/>
      <br>

      <q-btn
        label="提现"
        color="primary"
        @click="sendToken"/>
      <br>
      <br>
      <br>
      <q-btn
        label="查看挂单一览"
        color="secondary"
        @click="sendToken"/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <q-btn
        label="查看成交一览"
        color="secondary"
        @click="sendToken"/>
      <br>
      <h5>手续费收入一览</h5>
      <table class="q-table">
        <thead>
        <tr>
          <th class="text-left">Token名称</th>
          <th class="text-left">数量</th>
          <th class="text-left">结束时间↑</th>
          <th class="text-left">卖主地址</th>
          <th class="text-left">成交价格（ETH）</th>
          <th class="text-left">手续费</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>CBB</td>
          <td>1000</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
          <td>0.88</td>
          <td>0.44</td>
        </tr>
        <tr>
          <td>IHT</td>
          <td>2000</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
          <td>0.66</td>
          <td>0.33</td>
        </tr>
        <tr>
          <td>BNB</td>
          <td>1000</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
          <td>0.54</td>
          <td>0.27</td>
        </tr>
        <tr>
          <td>IOST</td>
          <td>1000</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
          <td>1</td>
          <td>0.5</td>
        </tr>
        <tr>
          <td>ETOS</td>
          <td>1000</td>
          <td>2018-10-04 04:21:00</td>
          <td>0x9a...c48f</td>
          <td>100</td>
          <td>50</td>
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
