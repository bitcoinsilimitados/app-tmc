import React, { Component } from "react";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';

import cons from "../../cons.js";
import abiToken from "../../assets/abi/TokenPRC20.js";

//const BN = Web3.utils.BN;

// https://polygon-mainnet.infura.io/v3/5a0e1e011860401880d5984367e68fbf
//https://polygon-rpc.com  add RPC


const addressToken = ""

let ContractTMC = {}

const contractAddress = cons.SC;

class CrowdFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {

      texto: "Loading...",
      sponsor: "",
      level: "Loading...",
      levelPrice: 0,
      balanceUSDT: "Loading...",
      aprovedUSDT: 0,
      contractUSDT: {}


    };

    this.deposit = this.deposit.bind(this);
    this.estado = this.estado.bind(this);
  }

  async estado() {

    var accountAddress = window.tronWeb.defaultAddress.base58

    //console.log(accountAddress);

    var activeLevels = 0;

    for (var i = 15; i >= 0; i--) {

      if (await ContractTMC.usersActiveX3Levels(accountAddress, i).call()) {
        activeLevels++;
      }

    }

    var levelPrice = await ContractTMC.levelPrice(activeLevels + 1).call();

    var tokenAddress = await ContractTMC.tokenUSDT().call();

    const contractUSDT = await window.tronWeb.contract().at(tokenAddress);

    var balanceUSDT = await contractUSDT.balanceOf(accountAddress).call();

    balanceUSDT = parseInt(balanceUSDT._hex) / 10 ** 6;

    var aproved = await contractUSDT.allowance(accountAddress, contractAddress).call();

    //console.log(aproved);

    if (aproved.remaining) {
      aproved = parseInt(aproved.remaining._hex) / 10 ** 6;

    } else {
      aproved = parseInt(aproved._hex) / 10 ** 6;

    }


    var text;
    if (aproved > 0) {
      if (activeLevels === 0) {
        text = "Register and buy the first level"
      } else {
        text = "Buy next level"
      }

    } else {
      text = "Link Wallet"
    }

    this.setState({
      level: activeLevels,
      levelPrice: parseInt(levelPrice._hex) / 10 ** 6,
      balanceUSDT: balanceUSDT,
      texto: text,
      aprovedUSDT: aproved,
      contractUSDT: contractUSDT
    });

    //console.log(min);
  }

  async deposit() {

    const { level, levelPrice, balanceUSDT, aprovedUSDT, contractUSDT } = this.state;

    var amount = levelPrice;

    amount = parseFloat(amount);

    var accountAddress = window.tronWeb.defaultAddress.base58;

    var balanceInTRX = await window.tronWeb.trx.getBalance(); //number
    balanceInTRX = balanceInTRX / 10 ** 6;

    console.log(balanceInTRX);
    console.log(amount);

    var owner = await ContractTMC.owner().call();

    var direccionSP = window.tronWeb.address.fromHex(owner);

    var aproved = aprovedUSDT;

    if (aproved <= 0) {
      await contractUSDT.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send();
      return;
    }

    var LAST_LEVEL = await ContractTMC.LAST_LEVEL().call();

    if (balanceInTRX >= 50 && aproved >= amount && balanceUSDT >= amount && level < LAST_LEVEL) {

      var loc = document.location.href;
      if (loc.indexOf('?') > 0) {
        var getString = loc.split('?')[1];
        var GET = getString.split('&');
        var get = {};
        for (var i = 0, l = GET.length; i < l; i++) {
          var tmp = GET[i].split('=');
          get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }

        if (get['ref']) {
          tmp = get['ref'].split('#');

          var inversor = await ContractTMC.idToAddress(tmp[0]).call();

          if (await ContractTMC.isUserExists(inversor).call()) {

            direccionSP = window.tronWeb.address.fromHex(inversor);

          }
        }
      }

      this.setState({
        sponsor: direccionSP
      });


      if (await ContractTMC.isUserExists(accountAddress).call()) {


        await ContractTMC.buyNewLevel(level + 1, amount * 10 ** 6).send();


      } else {

        await ContractTMC.registrationExt(direccionSP, amount * 10 ** 6).send();

      }




    } else {

      if (amount > 200 && balanceInTRX > 250) {

        if (amount > balanceInTRX) {
          if (balanceInTRX <= 50) {
            window.alert("You do not have enough funds in your account you place at least 250 TRX");
          } else {
            document.getElementById("amount").value = balanceInTRX - 50;
            window.alert("You must leave 50 TRX free in your account to make the transaction");
          }



        } else {

          document.getElementById("amount").value = amount - 50;
          window.alert("You must leave 50 TRX free in your account to make the transaction");

        }
      } else {
        window.alert("You do not have enough funds in your account you place at least 250 TRX");
      }
    }

  };


  render() {

    return (
      <>
      </>
    );
  }
}

class GeneralInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: "N/A",
      link: "Haz una inversión para obtener el LINK de referido",
      wallet: "00000000"
    }

    this.Link = this.Link.bind(this);
  }

  async Link() {
    let mydireccion = this.state.wallet

    var user = await ContractTMC.users(mydireccion).call();

    if (await ContractTMC.isUserExists(mydireccion).call()) {
      let loc = document.location.href;
      if (loc.indexOf("?") > 0) {
        loc = loc.split("?")[0];
      }

      mydireccion = loc + "?ref=" + parseInt(user.id._hex);
      this.setState({
        id: parseInt(user.id._hex),
        link: mydireccion,
      });
    } else {
      this.setState({
        id: "N/A",
        link: "Haz una inversión para obtener el LINK de referido",
      });
    }
  }

  render() {

    let { wallet } = this.state

    return (<></>
    );
  }
}


class Oficina extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direccion: "",
      link: "Haz una inversión para obtener el LINK de referido",
      registered: false,
      balanceRef: 0,
      totalRef: 0,
      invertido: 0,
      ganado: 0,
      my: 0,
      withdrawn: 0,
      canastas: [(
        <div className="col-lg-3" key={"level" + 1}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 1 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 2}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 2 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 3}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 3 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 4}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 4 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 5}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 5 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 6}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 6 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 7}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 7 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 8}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 8 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 9}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 9 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 10}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 10 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 11}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 11 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 12}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 12 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 13}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 13 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 14}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 14 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      (
        <div className="col-lg-3" key={"level" + 15}>
          <div className="choose__item">
            <span style={{ fontSize: "22px" }}>
              <br />
              <strong>Level 15 (Inactive) </strong>
            </span>
          </div>
        </div>
      ),
      ],
    };

    this.Investors = this.Investors.bind(this);
    this.Link = this.Link.bind(this);
    this.withdraw = this.withdraw.bind(this);
  }

  async Link() {
    let mydireccion = await window.tronWeb.trx.getAccount();
    console.log(mydireccion);
    mydireccion = window.tronWeb.address.fromHex(mydireccion.address);

    var user = await ContractTMC.users(mydireccion).call();

    if (await ContractTMC.isUserExists(mydireccion).call()) {
      let loc = document.location.href;
      if (loc.indexOf("?") > 0) {
        loc = loc.split("?")[0];
      }

      mydireccion = loc + "?ref=" + parseInt(user.id._hex);
      this.setState({
        link: mydireccion,
      });
    } else {
      this.setState({
        link: "Haz una inversión para obtener el LINK de referido",
      });
    }
  }

  async Investors() {
    var direccion = await window.tronWeb.trx.getAccount();
    direccion = window.tronWeb.address.fromHex(direccion.address);

    var LAST_LEVEL = 15;

    var canasta = this.state.canastas;

    var invertido = 0;
    var personas = 0;
    var ganado = 0;

    var levelPrice = [];
    var ownerPrice = [];
    levelPrice[1] = 20;
    ownerPrice[1] = 0;
    ownerPrice[4] = 4;
    var i;
    for (i = 2; i <= LAST_LEVEL; i++) {
      levelPrice[i] = levelPrice[i - 1] * 2;
      if (i >= 5) {
        ownerPrice[i] = ownerPrice[i - 1] * 2;
      } else {
        if (i !== 4) {
          ownerPrice[i] = 0;
        }
      }
    }

    //console.log(levelPrice);
    //console.log(ownerPrice);

    for (i = 1; i <= LAST_LEVEL; i++) {
      if (await ContractTMC.usersActiveX3Levels(direccion, i).call()) {
        invertido += levelPrice[i];

        var matrix = await ContractTMC.usersX3Matrix(direccion, i).call();
        matrix[3] = parseInt(matrix[3]._hex);

        personas += matrix[1].length + matrix[3] * 3;

        ganado += (matrix[1].length + matrix[3] * 3) * ownerPrice[i];

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
        canasta[i - 1] = (
          <div className="col-lg-4" key={"level" + i}>
            <section className="widget Widget_widget__32uL4 widget-auth mx-auto pack pack-enable">
              <header className="Widget_title__1U9X_">
                <div className="pack-header pack-header-enable">
                  <div className="pack-ind"><span className="badge badge-dark-no-border">{i}</span></div>
                  <div className="text-center mb-sm" style={{ padding: '5px' }}><h6>{"       "}{levelPrice[i]}</h6></div>
                </div>
              </header>
              <div aria-hidden="false" className="rah-static rah-static--height-auto" style={{ height: 'auto', overflow: 'visible' }}>
                <div>
                  <div className="Widget_widgetBody__34soD widget-body">
                    <div className="pack-body">
                      <div className="mt row">
                        <span className={"badge-left badge " + estilo1}><i className="fa fa-users"></i></span>
                        <span className={"badge-center badge " + estilo2}><i className="fa fa-users"></i></span>
                        <span className={"badge-right badge  " + estilo3}><i className="fa fa-users"></i></span>
                      </div>
                      <div className="mt row"></div>
                      <div className="mt row"></div>
                      <div className="mt row">
                        <div className="text-center mb-sm" style={{ position: 'relative', left: '20%' }}><button type="submit" className="auth-btn btn btn-success" style={{ color: 'white', width: '100%' }}>Buyed</button></div>

                      </div>
                    </div>
                    <footer>
                      <div color="transparent" className="btn-xs float-left py-0" id="load-parthers-btn"><i className="fa fa-users"></i> {matrix[1].length + (matrix[3] * 3)}</div>
                      <div color="transparent" className="btn-xs float-right py-0" id="load-notifications-btn"><i className="fa fa-refresh"></i> {matrix[3]}</div>
                    </footer>
                  </div>
                </div>
              </div>
            </section>
            <div className="Widget_widgetBackground__1F6dp" style={{ display: 'none' }}></div>
          </div>
        );

      } else {
        canasta[i - 1] = (
          <div className="col-lg-4" key={"level" + i}>
            <section className="widget Widget_widget__32uL4 widget-auth mx-auto pack pack-enable">
              <header className="Widget_title__1U9X_">
                <div className="pack-header pack-header-enable">
                  <div className="pack-ind"><span className="badge badge-dark-no-border">{i}</span></div>
                  <div className="text-center mb-sm" style={{ padding: '5px' }}><h6>{levelPrice[i]}</h6></div>
                </div>
              </header>
              <div aria-hidden="false" className="rah-static rah-static--height-auto" style={{ height: 'auto', overflow: 'visible' }}>
                <div>
                  <div className="Widget_widgetBody__34soD widget-body">
                    <div className="pack-body">
                      <div className="mt row">
                        <span className={"badge-left badge badge-gray" + estilo1}><i className="fa fa-users"></i></span>
                        <span className={"badge-center badge badge-gray" + estilo2}><i className="fa fa-users"></i></span>
                        <span className={"badge-right badge badge-gray" + estilo3}><i className="fa fa-users"></i></span>
                      </div>
                      <div className="mt row"></div>
                      <div className="mt row"></div>
                      <div className="mt row">
                        <div className="text-center mb-sm" style={{ position: 'relative', left: '20%' }}><button type="submit" className="auth-btn btn btn-success" style={{ color: 'white', width: '100%' }}>Buy level</button></div>

                      </div>
                    </div>
                    <footer>
                      <div color="transparent" className="btn-xs float-left py-0" id="load-parthers-btn"><i className="fa fa-users"></i> 0</div>
                      <div color="transparent" className="btn-xs float-right py-0" id="load-notifications-btn"><i className="fa fa-refresh"></i> 0</div>
                    </footer>
                  </div>
                </div>
              </div>
            </section>
            <div className="Widget_widgetBackground__1F6dp" style={{ display: 'none' }}></div>
          </div>
        );
      }

      this.setState({
        canastas: canasta,
      });
    }

    this.setState({
      invertido: invertido,
      ganado: ganado,
      personas: personas,
    });
  }

  async withdraw() {
    var cosa = await ContractTMC.withdraw().send();
    console.log(cosa);
  }

  render() {
    return (<></>

    );
  }
}

class BackOffice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      provider: {},
      admin: false,
      metamask: false,
      conectado: false,
      currentAccount: "0x0000000000000000000000000000000000000000",

      contract: {
        web3: null,
        contractToken: null,
        binaryProxy: null
      }
    };

    this.conectar = this.conectar.bind(this);

  }

  async componentDidMount() {

    let inicio = setInterval(() => {
      this.conectar();
    }, 3 * 1000);

    this.setState({ intervalo: inicio });

    // instalar disparadores window.ethereum.on("accountsChanged", handleAccountsChanged)

    //remover disparadores  window.ethereum.removeListener("accountsChanged", handleAccountsChanged) // .removeAllListeners()


  }

  async componentWillUnmount() {
    clearInterval(this.state.intervalo);
  }

  async conectar() {

    if (window.ethereum) {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
        });
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    } else {
      // if no window.ethereum then MetaMask is not installed
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    } 
    

    let {metamask} = this.state


    if (typeof window.ethereum !== 'undefined' && !metamask) {


      this.setState({
        metamask: true
      })

    console.log("here2")

/*
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], //137
      })

      */

    console.log("here1")


    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async (accounts) => {

          

          console.log(accounts)

          const provider = await detectEthereumProvider();

          let web3 = new Web3(provider);
          let contractToken = new web3.eth.Contract(
            abiToken,
            addressToken
          );


          let isAdmin = false;
          let cuenta = accounts[0] //"0x2198b0D4f54925DCCA173a84708BA284Ac85Cc37"//
          let balance = await contractToken.methods.balanceOf(cuenta).call({ from: cuenta })

          console.log(balance)

          let verWallet = accounts[0];
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


          this.setState({
            conectado: true,
            currentAccount: verWallet,
            admin: isAdmin,
            contract: {
              web3: web3,
              contractToken: contractToken,
              //binaryProxy: binaryProxy
            }
          })

        })
        .catch((error) => {
          console.error(error)
          this.setState({
            conectado: false,
            admin: false,
            contract: {
              web3: null,
              contractToken: null,
              binaryProxy: null
            }
          })
        });



    } else {
      console.log("no se ha detectado Metamask")

      this.setState({

        metamask: false,
        conectado: false,
        admin: false,
        contract: {
          web3: null,
          contractToken: null,
          binaryProxy: null
        }
      })

    }


  }

  render() {

    let { wallet } = this.state

    return (
      <div className="row" style={{ marginTop: "100px", fontSize: '16px' , color: "gray" }}>
        <div className="col-3">
          <div className="row">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <p >My id</p>
                    <p >Wallet</p>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold' }}>{this.state.id}</p>
                    <p style={{ textAlign: 'right', wordBreak: 'break-all' }}>{wallet} <i className="fa fa-clipboard text-white"></i></p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style={{ fontSize: '18px' }}>Balance</p>
                    <p style={{ fontSize: '18px' }}>Level</p>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px' }}>{this.state.balanceUSDT} <strong>USDT</strong></p>
                    <p style={{ fontSize: '18px' }}>{this.state.level}</p>
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
                    <button onClick={() => this.deposit()} type="button" className="auth-btn btn btn-success btn-sm" style={{ color: 'white', width: '100%' }}>{this.state.texto}</button>
                    <p >Price {this.state.levelPrice} USDT <br></br>You must have ~ 50 TRX to make the transaction</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">

            <input id="link" required="" name="link" placeholder="Link" value={this.state.link} type="text" className="input-transparent pl-3 form-control" disabled />
            <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => { navigator.clipboard.writeText(this.state.link); window.alert("link copied!") }} style={{ color: 'white', width: '90%' }}>Copy referal link <span className="input-group-text"><i className="fa fa-clipboard text-white"></i></span></button>

          </div>
        </div>

        <div className="col-9">
          <div className="row">
            <div className="col-4">
              <h2 style={{color: "white"}}>Earned:</h2>
              <p>
                {this.state.ganado} USDT
              </p>
            </div>
            <div className="col-4">
              <h2 style={{color: "white"}}>My invested:</h2>
              <p>
                {this.state.invertido} USDT
              </p>
            </div>
            <div className="col-4">
              <h2 style={{color: "white"}}>People:</h2>
              <p>
                {this.state.personas | 0}
              </p>
            </div>
          </div>

          <div className="row">
            {this.state.canastas}
          </div>

          <div className="row">
            <div className="col-6 ">
              <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-refresh"></i> Recycle count</div>
            </div>
            <div className="col-6">
              <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-users"></i> Number partners in the slot</div>
            </div>
          </div>


        </div>

      </div>

    );
  }
}


export default BackOffice
