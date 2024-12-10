import React, { Component } from "react";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';

import cons from "../../cons.js";
import abiToken from "../../assets/abi/TokenPRC20.js";

var BigNumber = require('bignumber.js');

// https://polygon-mainnet.infura.io/v3/5a0e1e011860401880d5984367e68fbf
//https://polygon-rpc.com  add RPC


const addressToken = "0x3e8E9D68eAe41A1cCd95b4E063DAdc05925E193b"
const contractAddress = "0x07216598f9fc6186C949172aF12d2BDFc83c9882"

let ContractTMC = {}


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
      //balanceUSDT: balanceUSDT,
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
      metamask: false,
      wallet: "Loading...",
      admin: false,
      id: "Loading...",
      level: "Loading...",
      balanceUSDT: new BigNumber(0),
      texto: "Loading...",
      link: "",

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

          const provider = await detectEthereumProvider();

          let web3 = new Web3(provider);
          let contractToken = new web3.eth.Contract(
            abiToken,
            addressToken
          );


          let isAdmin = false;
          let from = accounts[0] //"0x2198b0D4f54925DCCA173a84708BA284Ac85Cc37"
          let balance = parseInt(await contractToken.methods.balanceOf(from).call({ from }))
          let decimals = parseInt(await contractToken.methods.decimals().call({ from }))


          console.log(balance , decimals)

          balance = new BigNumber(balance).shiftedBy(-decimals)
          console.log(balance.toString(10))

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


          this.setState({
            wallet: from,
            balanceUSDT: balance,
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
            metamask: false,
            admin: false,
          })
        });



    } else {

      if(typeof window.ethereum === 'undefined'){
        console.log("No se ha detectado Metamask")
        
      }

    }


  }

  render() {

    let { wallet, id, balanceUSDT, level, levelPrice, texto, link, ganado, invertido, personas, canastas } = this.state

    return (
      <div className="row" style={{ marginTop: "100px", fontSize: '16px', color: "gray" }}>
        <div className="col-3">
          <div className="row">
            <p style={{ textAlign: 'center', marginBottom: '0px'}}><span style={{ fontWeight: 'bold', color:'white', wordBreak: 'break-all', fontSize: '1.3rem' }}>{wallet} </span></p>
            <table className="table" style={{border: "none"}}>
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
          <div className="row">

            <input id="link" required="" name="link" placeholder="Link" value={link} type="text" className="input-transparent pl-3 form-control" disabled />
            <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => { 
              if(link !== ""){
                navigator.clipboard.writeText(link); 
                window.alert("link copied!") 
              }
            }} style={{ color: 'white', width: '90%' }}>Copy referal link <span className="input-group-text"><i className="fa fa-clipboard text-white"></i></span></button>

          </div>
        </div>

        <div className="col-9">
          <div className="row">
            <div className="col-4">
              <h2 style={{ color: "white" }}>Earned:</h2>
              <p>
                {ganado | 0} USDT
              </p>
            </div>
            <div className="col-4">
              <h2 style={{ color: "white" }}>My invested:</h2>
              <p>
                {invertido | 0} USDT
              </p>
            </div>
            <div className="col-4">
              <h2 style={{ color: "white" }}>People:</h2>
              <p>
                {personas | 0}
              </p>
            </div>
          </div>

          <div className="row">
            {canastas}
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
