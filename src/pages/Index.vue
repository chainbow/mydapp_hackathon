<template>
  <q-page
    padding
    class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
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

    <br>
    <code>{{ abiCode }}</code>
    <br>

    <q-input
      v-model="tokenContractAddress"
      float-label="Token Contract Address"
      placeholder="0x123456787890... ..."/>
    <br>

    <q-btn
      label="getBalance"
      color="primary"
      @click="getBalance"/>
    <br>

    <div>
      Balance: {{ balance }}
    </div>

  </q-page>
</template>

<style>
</style>

<script>
import metaCoinContract from '../../build/contracts/MetaCoin.json'
import ethereum from '../utils/ethereum.js'

export default {
  name: 'PageIndex',
  data: function () {
    return {
      web3: null,
      version: '',
      account: '',
      network: {},
      tokenContractAddress: '0x6fdf6c34972c1dde408891a4e1957bbc5f734a17',
      abiCode: ''

    }
  },
  created: async function () {
    console.log(metaCoinContract)
    this.abiCode = metaCoinContract.abi
    this.web3 = ethereum.getWeb3()
    this.version = await this.web3.version
    this.account = await ethereum.currentAccount()
    this.network = await ethereum.currentNetwork()
  },
  methods: {
    async getBalance () {
      try {
        const contractInstance = new this.web3.eth.Contract(this.abiCode, this.tokenContractAddress)

        let balance = await contractInstance.methods.getBalance(this.account).call()
        console.log(balance)
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>
