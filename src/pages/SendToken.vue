<template>
  <q-page
    padding
    class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <h3>sendTransaction(Send Eth to Address)</h3>
      <q-input
        v-model="tokenContractAddress"
        float-label="Token Contract Address"
        placeholder="0x123456787890... ..."/>
      <br>
      <q-input
        v-model="toAddress"
        float-label="To Address"
        placeholder="0x123456787890... ..."/>
      <br>
      <q-input
        v-model="inputTokenAmount"
        type="number"
        float-label="Amount"
        placeholder="1"/>
      <br>

      <q-btn
        label="Send Token"
        color="primary"
        @click="sendToken"/>

      <h3>Ethereum</h3>
      <div v-if="web3">
        <table class="q-table striped">
          <thead>
          <tr>
            <th class="text-left">Property</th>
            <th class="text-left">Value</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Web3 Version</td>
            <td>{{ version }}</td>
          </tr>
          <tr>
            <td>Current Network</td>
            <td>{{ network }}</td>
          </tr>
          <tr v-if="account">
            <td>Current Account</td>
            <td>{{ account }}</td>
          </tr>
          <tr v-else>
            <td colspan="2">Please Unlock Account in web3 provider</td>
          </tr>

          </tbody>
        </table>
      </div>
      <div v-else>
        <h4>Web3 Provider未検出</h4>
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
          (this.inputTokenAmount * (10 ** 18)).toString())
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
