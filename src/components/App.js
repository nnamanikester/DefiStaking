import * as React from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import ParticleSettings from "./ParticleSettings";

const App = () => {
  const [account, setAccount] = React.useState("0x0");
  const [tether, setTether] = React.useState({});
  const [rwd, setRwd] = React.useState({});
  const [decentralBank, setDecentralBank] = React.useState({});
  const [tetherBalance, setTetherBalance] = React.useState("0");
  const [rwdBalance, setRwdBalance] = React.useState("0");
  const [stakingBalance, setStakingBalance] = React.useState("0");
  const [loading, setLoading] = React.useState(true);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected! You can checkout MetaMask!");
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();

    // Lead Tether Data
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tetherContract = new web3.eth.Contract(
        Tether.abi,
        tetherData.address
      );
      setTether(tetherContract);
      const tetherBal = await tetherContract.methods
        .balanceOf(accounts[0])
        .call();
      setTetherBalance(tetherBal.toString());
    } else {
      window.alert(
        "Error! Tether contract not deployed - no detected  network!"
      );
    }

    // Load RWD Data
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwdContract = new web3.eth.Contract(RWD.abi, rwdData.address);
      setRwd(rwdContract);
      const rwdBal = await rwdContract.methods.balanceOf(accounts[0]).call();
      setRwdBalance(rwdBal.toString());
    } else {
      window.alert("Error! RWD contract not deployed - no detected  network!");
    }

    // Load Decentral Bank Data
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBankContract = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      setDecentralBank(decentralBankContract);
      const stakingBal = await decentralBankContract.methods
        .stakingBalance(accounts[0])
        .call();
      setStakingBalance(stakingBal.toString());
    } else {
      window.alert(
        "Error! Decentral Bank contract not deployed - no detected  network!"
      );
    }

    setLoading(false);
  };

  React.useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const stakeTokens = (amount) => {
    setLoading(true);
    tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        decentralBank.methods
          .depositTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };

  const unstakeTokens = () => {
    decentralBank.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  return (
    <div className="App" style={{ position: "relative" }}>
      <div style={{ position: "absolute" }}>
        <ParticleSettings />
      </div>

      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px", minHeight: "100vm" }}
          >
            <div>
              {loading ? (
                <p
                  id="loader"
                  className="text-center"
                  style={{ margin: "30px", color: "white" }}
                >
                  LOADING PLEASE...
                </p>
              ) : (
                <Main
                  tetherBalance={tetherBalance}
                  rwdBalance={rwdBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unstakeTokens={unstakeTokens}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
