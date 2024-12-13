import React, { Component } from "react";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';


import abiToken from "../../assets/abi/TokenPRC20.js";
import abiTMC from "../../assets/abi/TMC-v2.js";

import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

var BigNumber = require('bignumber.js');

// https://polygon-mainnet.infura.io/v3/5a0e1e011860401880d5984367e68fbf
//https://polygon-rpc.com  add RPC

const contractAddress = "0x07216598f9fc6186C949172aF12d2BDFc83c9882"

class BackOffice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      metamask: false,
      wallet: "Loading...",
      admin: false,
      id: "Loading...",
      level: "Loading...",
      balanceUSDT: new BigNumber(0),
      texto: "Loading...",
      link: "Loading...",
      decimals: 6,
      canastas: [],
      owner: undefined,
      sponsor: undefined,

      contract: {
        web3: null,
        token: null,
        principal: null
      }
    };

    this.conectar = this.conectar.bind(this);
    this.estado = this.estado.bind(this);

    this.withdraw = this.withdraw.bind(this);
    this.deposit = this.deposit.bind(this);

    this.getSponsor = this.getSponsor.bind(this);

  }

  async componentDidMount() {

    setTimeout(() => {
      this.conectar();

    }, 3 * 1000)

    let inicio = setInterval(() => {
      this.conectar();
      this.estado();
    }, 30 * 1000);

    this.setState({ intervalo: inicio });

    // instalar disparadores window.ethereum.on("accountsChanged", handleAccountsChanged)

    window.ethereum.on("accountsChanged", () => {
      this.conectar();
      this.estado();
    })

    //remover disparadores  window.ethereum.removeListener("accountsChanged", handleAccountsChanged) // .removeAllListeners()


  }

  async componentWillUnmount() {
    clearInterval(this.state.intervalo);
    window.ethereum.removeAllListeners();
  }

  async conectar() {


    let { metamask } = this.state


    if (typeof window.ethereum !== 'undefined' && !metamask) {


      this.setState({
        metamask: true
      })


      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x98A' }], // poligon Mainet 0x89
      })


      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async (accounts) => {

          let from = accounts[0] //"0x2198b0D4f54925DCCA173a84708BA284Ac85Cc37"

          const provider = await detectEthereumProvider();

          let web3 = new Web3(provider);

          const principal = new web3.eth.Contract(
            abiTMC,
            contractAddress
          );

          let addressToken = await principal.methods.tokenUSDT().call({ from })

          this.setState({addressToken})

          const token = new web3.eth.Contract(
            abiToken,
            addressToken
          );

          let balance = parseInt(await token.methods.balanceOf(from).call({ from }))
          let decimals = parseInt(await token.methods.decimals().call({ from }))

          balance = new BigNumber(balance).shiftedBy(-decimals)

          let verWallet = from;
          let loc = document.location.href;


          if (loc.indexOf('?') > 0 && loc.indexOf('&wallet=') > 0) {

            verWallet = loc.split('?')[1];
            if (loc.indexOf('=') > 0) {
              verWallet = verWallet.split('=')[1];
              if (loc.indexOf('#') > 0) {
                verWallet = verWallet.split('#')[0];
              }
            }

            if (loc.indexOf('view') > 0) {

              if (!web3.utils.isAddress(verWallet)) {
                verWallet = ""//await binaryProxy.methods.idToAddress(verWallet).call({ from: accounts[0] });
              }
            }

          }


          await this.setState({
            wallet: from,
            balanceUSDT: balance,
            currentAccount: verWallet,
            decimals,
            contract: {
              web3,
              token,
              principal
            }
          })

          this.estado()

        })
        .catch((error) => {
          console.error(error)
          this.setState({
            metamask: false,
            admin: false,
          })
        });



    } else {

      if (typeof window.ethereum === 'undefined') {
        console.log("No se ha detectado Metamask")

      }

    }


  }

  async estado() {

    let { wallet, decimals, contract, link } = this.state

    this.getSponsor()

    let from = wallet
    var activeLevels = 0;

    for (var i = 15; i >= 0; i--) {

      if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from })) {
        activeLevels++;
      }

    }

    let levelPrice = await contract.principal.methods.levelPrice(activeLevels + 1).call({ from })
    levelPrice = new BigNumber(parseInt(levelPrice)).shiftedBy(-decimals)

    let balanceUSDT = await contract.token.methods.balanceOf(wallet).call({ from });
    balanceUSDT = new BigNumber(parseInt(balanceUSDT)).shiftedBy(-decimals)

    let aprovedUSDT = await contract.token.methods.allowance(wallet, contractAddress).call({ from });
    aprovedUSDT = new BigNumber(parseInt(aprovedUSDT)).shiftedBy(-decimals)


    let texto = "Buy next level"

    if (activeLevels === 0) {
      texto = "Register and buy the first level"
    }

    if (activeLevels === 0) {
      texto = "Register and buy the first level"
    }

    if (activeLevels === 15) {
      texto = "You reach the last level"
    }

    if (aprovedUSDT.toNumber() === 0) {
      texto = "Link Wallet"
    }

    let owner = await contract.principal.methods.owner().call({ from: wallet });

    this.setState({
      level: activeLevels,
      levelPrice,
      texto,
      balanceUSDT,
      aprovedUSDT,
      owner,
      isOwner: owner === wallet
    });


    if (await contract.principal.methods.isUserExists(wallet).call({ from: wallet })) {
      let user = await contract.principal.methods.users(wallet).call({ from: wallet });

      link = document.location.origin + "?backoffice&ref=" + parseInt(user.id);
      this.setState({
        id: parseInt(user.id),
        link,
      });
    } else {
      this.setState({
        id: "N/A",
        link: "Make an investment to get the referral LINK",
      });
    }

    var LAST_LEVEL = 15;

    let { canastas } = this.state;

    let invertido = 0;
    let personas = 0;
    let ganado = 0;

    let levelsPrice = [];
    levelsPrice[1] = 20;

    for (i = 2; i <= LAST_LEVEL; i++) {
      levelsPrice[i] = levelsPrice[i - 1] * 2;
    }

    for (i = 1; i <= LAST_LEVEL; i++) {
      if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from: wallet })) {
        invertido += levelsPrice[i];

        var matrix = await contract.principal.methods.usersX3Matrix(wallet, i).call({ from: wallet });
        matrix[3] = parseInt(matrix[3])

        personas += matrix[1].length + matrix[3] * 3;

        ganado += (matrix[1].length + matrix[3] * 3) * levelsPrice[i];


        var rango = matrix[1].length + ((matrix[3] * 3) % 3);
        var estilo1, estilo2, estilo3;
        switch (rango) {
          case 1:
            estilo1 = "badge-on";
            estilo2 = "";
            estilo3 = "";

            break;
          case 2:
            estilo1 = "badge-on";
            estilo2 = "badge-on";
            estilo3 = "";

            break;

          case 0:
            estilo1 = "badge-on";
            estilo2 = "badge-on";
            estilo3 = "badge-on";

            break;

          default:
            break;
        }
        if (rango) {
        }

        //console.log(ganado);
        canastas[i - 1] = (
          <div className="col-3" style={{ color: 'green', textAlign: 'center' }} key={"level" + i}>
            <h3 style={{ color: 'white' }}>Level {i} </h3>
            <div className="mt row">
              <span className={"badge-left badge badge-gray" + estilo1}><i className="fa fa-users"></i></span>{"  "}
              <span className={"badge-center badge badge-gray" + estilo2}><i className="fa fa-users"></i></span>{"  "}
              <span className={"badge-right badge badge-gray" + estilo3}><i className="fa fa-users"></i></span>
            </div>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'white', width: '200px' }}> {levelsPrice[i]} USDT</button>
            <div>
              <i className="fa fa-users"></i> {matrix[1].length + (matrix[3] * 3)} {'  |  '}
              <i className="fa fa-refresh"></i> {matrix[3]}
            </div>

          </div>
        );

      } else {
        canastas[i - 1] = (
          <div className="col-4" style={{ color: "red" }} key={"level" + i}>
            <h3>Level {i} {levelPrice[i]}</h3>
            <div className="mt row">
              <span className={"badge-left badge badge-gray" + estilo1}><i className="fa fa-users"></i></span>{"  "}
              <span className={"badge-center badge badge-gray" + estilo2}><i className="fa fa-users"></i></span>{"  "}
              <span className={"badge-right badge badge-gray" + estilo3}><i className="fa fa-users"></i></span>
            </div>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'white', width: '100%' }}> {levelsPrice[i]} USDT</button>
            <div color="transparent" className="btn-xs float-left py-0" id="load-parthers-btn"><i className="fa fa-users"></i> 0</div>
            <div color="transparent" className="btn-xs float-right py-0" id="load-notifications-btn"><i className="fa fa-refresh"></i> 0</div>

          </div>
        );
      }

      this.setState({
        canastas,
      });
    }

    this.setState({
      invertido: invertido,
      ganado: ganado,
      personas: personas,
    });



  }

  async getSponsor() {

    let { owner, wallet, contract } = this.state

    let sponsor = owner;
    let loc = document.location.href;
    if (loc.indexOf('?') > 0) {
      let getString = loc.split('?')[1];
      let GET = getString.split('&');
      let get = {};
      let tmp;
      for (var i = 0, l = GET.length; i < l; i++) {
        tmp = GET[i].split('=');
        get[tmp[0]] = unescape(decodeURI(tmp[1]));
      }

      if (get['ref']) {
        tmp = get['ref'].split('#')[0];

        let inversor = await contract.principal.methods.idToAddress(tmp).call({ from: wallet });

        if (await contract.principal.methods.isUserExists(inversor).call({ from: wallet })) {

          sponsor = inversor;
          cookies.set('sponsor', '' + sponsor)

        }
      } else {
        sponsor = cookies.get('sponsor')

        if (sponsor === undefined) sponsor = owner


      }

      this.setState({ sponsor })

      return sponsor
    }

  }

  async deposit() {

    let { level, levelPrice, balanceUSDT, aprovedUSDT, contract, wallet, decimals, isView } = this.state;

    if (isView) return;

    let LAST_LEVEL = parseInt(await contract.principal.methods.LAST_LEVEL().call({ from: wallet }))

    console.log(levelPrice, balanceUSDT.toNumber())

    if (level >= LAST_LEVEL) {
      window.alert("You reached the last level");
      return;
    }

    if (levelPrice > balanceUSDT.toNumber()) {
      window.alert("You do not have enough funds in your account");
      return;
    }


    let direccionSP = await this.getSponsor();

    if (aprovedUSDT.toNumber() <= levelPrice) {
      try {

        const gasPrice = await contract.web3.eth.getGasPrice();
        await contract.token.methods.approve(contractAddress, new BigNumber("655340").shiftedBy(decimals)).send({ from: wallet, gasPrice })

      } catch (error) {
        console.log(error)
      }
      return;
    }

    this.setState({
      sponsor: direccionSP
    });


    if (await contract.principal.methods.isUserExists(wallet).call({ from: wallet })) {
      try {

        const gasPrice = await contract.web3.eth.getGasPrice();
        await contract.principal.methods.buyNewLevel(level + 1, levelPrice * 10 ** 6).send({ from: wallet, gasPrice });


      } catch (error) {
        console.log(error)
      }


    } else {
      try {

        const gasPrice = await contract.web3.eth.getGasPrice();
        await contract.principal.methods.registrationExt(direccionSP, levelPrice * 10 ** 6).send({ from: wallet, gasPrice });



      } catch (error) {
        console.log(error)
      }

    }
  }


  async withdraw() {
    let { contract, wallet, isView } = this.state
    if (isView) return;

    contract.principal.methods.withdraw().send({ from: wallet })
      .then(() => {
        alert("Is done")
      })
      .catch((e) => {
        alert("Error: " + e.toString())
      })
  }

  render() {

    let { wallet, id, balanceUSDT, level, levelPrice, texto, link, ganado, invertido, personas, canastas, isOwner } = this.state

    let ChangeToken = !isOwner ? <></> : <>Change principal token <br></br> <button>USDT</button><button>DAI</button><button>USDC</button></>



    return (<>
      <div className="row" style={{ marginTop: "100px", fontSize: '16px', color: "gray" }}>
        <div className="col-four">
          <div className="row">
            <p style={{ textAlign: 'center', marginBottom: '0px' }}><span style={{ fontWeight: 'bold', color: 'white', wordBreak: 'break-all', fontSize: '1.3rem' }}>{wallet} </span></p>
            <table className="table" style={{ border: "none" }}>
              <tbody>
                <tr>
                  <td>
                    My id
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 'bold' }}>{id}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Balance
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {balanceUSDT.toString(10)} <strong>USDT</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    Level
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {level}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <button onClick={() => this.deposit()} type="button" className="auth-btn btn btn-success btn-sm" style={{ color: 'white', width: '100%' }}>{texto}</button>
                    <p >Price {levelPrice | 0} USDT </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row" style={{ textAlign: 'center' }}>

            {link}

            <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => {
              if (link !== "") {
                navigator.clipboard.writeText(link);
                window.alert("link copied!")
              }
            }} style={{ color: 'white', width: '100%' }}>Copy referal link <span className="input-group-text"><i className="fa fa-clipboard text-white"></i></span></button>

          </div>
          {ChangeToken}
        </div>

        <div className="col-eight">
          <div className="row">
            <div className="col-four" style={{ textAlign: 'center' }}>
              <h2 style={{ color: "white", marginTop: '0px' }}>Earned:</h2>
              <p>
                {ganado | 0} USDT
              </p>
            </div>
            <div className="col-four" style={{ textAlign: 'center' }}>
              <h2 style={{ color: "white", marginTop: '0px' }}>My invested:</h2>
              <p>
                {invertido | 0} USDT
              </p>
            </div>
            <div className="col-four" style={{ textAlign: 'center' }}>
              <h2 style={{ color: "white", marginTop: '0px' }}>People:</h2>
              <p>
                {personas | 0}
              </p>
            </div>
          </div>

          <div className="row " style={{marginLeft: 'auto'}}>
            {canastas}
          </div>




        </div>

      </div>

      <div className="row" style={{paddingTop: '50px'}}>
        <div className="col-six" style={{textAlign: 'right'}}>
          <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-users"></i> Number partners in the slot</div>
        </div>
        <div className="col-six " >
          <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-refresh"></i> Recycle count</div>
        </div>

      </div>
    </>);
  }
}


export default BackOffice
