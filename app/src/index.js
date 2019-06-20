import Web3 from "web3";
import starNotaryContract from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  accounts: null,
  instance: null,
  token:parseInt(window.localStorage.getItem('tokenCnt')) || 1,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryContract.networks[networkId];
      this.instance = new web3.eth.Contract(
        starNotaryContract.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.accounts = accounts;
      this.getStars()

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  getStars : async function() {
      const ul = document.getElementById('stars')
      for (var i = 1; i <= this.token; i++) {
          const star = await this.instance.methods.starTokenMap(i).call()
          const price = await this.instance.methods.starsForSale(i).call()
          ul.innerHTML = `${ul.innerHTML}<li>${star}, ${price}</li>`
      }
  },

  createStar : async function() {

      const token = ++this.token
      const starname = document.getElementById('starname').value
      const price = parseInt(document.getElementById('price').value)
      console.log(`${starname}, ${price}, ${token}`)

      await this.instance.methods.createStar(document.getElementById('starname').value, token).send({from : this.accounts[0]})
      console.log("createStar works")
      await this.instance.methods.putUpForSale(token, parseInt(document.getElementById('price').value)).send({from : this.accounts[0]})
      console.log("putUpForSale works")
      const starName = await this.instance.methods.starTokenMap(token).call()
      console.log(`starName is ${starName}`)
      window.localStorage.setItem('tokenCnt', token)
      const ul = document.getElementById('stars')
      ul.innerHTML = `${ul.innerHTML}<li>${starname}, ${price}</li>`
      document.getElementById('starname').value = ''
      document.getElementById('price').value = ''
  },

};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
