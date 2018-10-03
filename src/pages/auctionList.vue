<template>
  <q-page
    padding
    class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <h3>2.挂单列表页面</h3>

      <q-search v-model="search" />
      <br>
      <q-toggle v-model="checked" label="只看自己" />
      <br>
      <br>
      <q-btn-toggle
        v-model="model"
        toggle-color="primary"
        color="amber"
        text-color="black"
        rounded
        glossy
        :options="[
          {label: 'All', value: 'all'},
          {label: '未结束', value: 'open'},
          {label: '已成交', value: 'finish'}
        ]"
      />
      <br>
      <br>

      <div>
        <table class="q-table">
          <thead>
          <tr>
            <th class="text-left">Token名称</th>
            <th class="text-left">数量</th>
            <th class="text-left">价格（ETH）</th>
            <th class="text-left">结束时间↑</th>
            <th class="text-left">是否结束</th>
            <th class="text-left">是否结算</th>
            <th class="text-left">卖主地址</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>CBB</td>
            <td>1000</td>
            <td>0.88</td>
            <td>2018-10-04 04:21:00</td>
            <td>No</td>
            <td>No</td>
            <td>0x9a...c48f</td>
          </tr>
          <tr>
            <td>IHT</td>
            <td>2000</td>
            <td>0.88</td>
            <td>2018-10-04 04:21:00</td>
            <td>yes</td>
            <td>No</td>
            <td>0x9a...c48f</td>
          </tr>
          <tr>
            <td>BNB</td>
            <td>1000</td>
            <td>0.88</td>
            <td>2018-10-04 04:21:00</td>
            <td>yes</td>
            <td>yes</td>
            <td>0x9a...c48f</td>
          </tr>
          <tr>
            <td>IOST</td>
            <td>1000</td>
            <td>0.88</td>
            <td>2018-10-04 04:21:00</td>
            <td>No</td>
            <td>No</td>
            <td>0x9a...c48f</td>
          </tr>
          <tr>
            <td>ETOS</td>
            <td>1000</td>
            <td>0.88</td>
            <td>2018-10-04 04:21:00</td>
            <td>No</td>
            <td>No</td>
            <td>0x9a...c48f</td>
          </tr>

          </tbody>
        </table>
      </div>
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
