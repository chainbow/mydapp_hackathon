const PrivateKeyProvider = require("truffle-privatekey-provider");
const privateKey = "";

module.exports = {
  networks: {
    ropsten: {
      provider: function () {
        return new PrivateKeyProvider(privateKey, "https://ropsten.infura.io/");
      },
      network_id: 3,
      gas: 5000000
    },
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
