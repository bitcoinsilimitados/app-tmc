import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';

import Web3 from "web3";

import abiToken from "../../assets/abi/TokenPRC20.js";
import abiTMC from "../../assets/abi/TMC-v2.js";

import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

var BigNumber = require('bignumber.js');

// https://polygon-mainnet.infura.io/v3/5a0e1e011860401880d5984367e68fbf
//https://polygon-rpc.com

const RPC = "https://rpc.cardona.zkevm-rpc.com"

const contractAddress = "0x07216598f9fc6186C949172aF12d2BDFc83c9882"

const wallet0x = "0x0000000000000000000000000000000000000000";

class BackOffice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      decimals: 6,
      walletView: wallet0x,
      sponsor: wallet0x,
      balanceUSDT: new BigNumber(0),
      levelPrice: new BigNumber(0),
      ganado: new BigNumber(0),
      idSponsor: new BigNumber(0),
      admin: false,
      tokenName: "",
      id: "Loading...",
      wallet: "Loading...",
      level: "Loading...",
      team: "Loading...",
      texto: "Loading...",
      link: "Loading...",
      canastas: [],
      owner: undefined,
      addressToken: undefined,

      contract: {
        ready: false,
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
    this.changeToken = this.changeToken.bind(this);

    this.getTeam = this.getTeam.bind(this);
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

    window.ethereum.on("accountsChanged", () => { this.conectar(); this.estado(); })

  }

  async componentWillUnmount() {
    clearInterval(this.state.intervalo);
    window.ethereum.removeAllListeners();
  }

  async conectar() {

    let { contract, wallet, walletView } = this.state

  
    if (typeof window.ethereum !== 'undefined') {

      let idRed = 2442

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x'+idRed.toString(16) }], 
      })

      wallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(async (a) => { return a[0] })
          .catch((e) => { console.error(e); return wallet0x; });
      
    }

    let from = wallet

    let web3 = new Web3(RPC);
    contract.web3 = web3;

    let loc = document.location.href;

    if (this.props.isView) {

      if (loc.indexOf('&wallet=') > 0) {
        loc = loc.split('&wallet=')[1];
        loc = loc.split('&')[0];
        loc = loc.split('#')[0];
        loc = loc.toLowerCase()

        try {
          walletView = web3.utils.toChecksumAddress(loc)
        } catch (error) {
          let msg = "Error: " + (error.toString()).split('Error:')[1]
          console.log(msg)
          //window.alert(msg)
          walletView = wallet0x
        } finally {
          this.setState({ walletView })
        }
      }


      from = walletView

      if (walletView === wallet0x) {
        walletView = await contract.principal.methods.owner().call({ from })
      }


    }


    if (!contract.ready) {

      if(this.props.isView){
        alert("is view mode")

      }
      contract.principal = new web3.eth.Contract(
        abiTMC,
        contractAddress
      );

      let addressToken = await contract.principal.methods.tokenUSDT().call({ from })

      contract.token = new web3.eth.Contract(
        abiToken,
        addressToken
      );

      let decimals = parseInt(await contract.token.methods.decimals().call({ from }))
      let tokenName = await contract.token.methods.symbol().call({ from })

      contract.ready = true;

      this.setState({contract, addressToken, decimals, tokenName })

    }


    this.setState({
      wallet,
      
    })

    this.estado()


  }

  async estado() {

    let { wallet, walletView, decimals, contract, link, tokenName } = this.state

    if (!contract.ready) return;

    this.getSponsor()

    let from = wallet
    if(this.props.isView) wallet = walletView
    var activeLevels = 0;
    let team = []

    for (var i = 15; i >= 0; i--) {

      if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from })) {
        activeLevels++;
      }

    }

    let levelPrice = await contract.principal.methods.levelPrice(activeLevels + 1).call({ from })
    levelPrice = new BigNumber(parseInt(levelPrice)).shiftedBy(-decimals)

    let balanceUSDT = await contract.token.methods.balanceOf(wallet).call({ from });
    balanceUSDT = new BigNumber(parseInt(balanceUSDT)).shiftedBy(-decimals)

    //console.log(balanceUSDT.toString(10))

    let aprovedUSDT = await contract.token.methods.allowance(wallet, contractAddress).call({ from });
    aprovedUSDT = new BigNumber(parseInt(aprovedUSDT)).shiftedBy(-decimals)


    let texto = "Buy | " + levelPrice.toString(10) + tokenName;

    if (activeLevels === 0) {
      texto = "Register | " + levelPrice.toString(10) + tokenName;
    }

    if (activeLevels === 15) {
      texto = "Max Level Reached"
    }

    if (aprovedUSDT.toNumber() === 0) {
      texto = "CONNECT WALLET"
    }

    let owner = await contract.principal.methods.owner().call({ from });

    this.setState({
      level: activeLevels,
      levelPrice,
      texto,
      balanceUSDT,
      aprovedUSDT,
      owner,
      isOwner: owner.toLowerCase() === wallet.toLowerCase()
    });


    if (await contract.principal.methods.isUserExists(wallet).call({ from })) {
      let user = await contract.principal.methods.users(wallet).call({ from });

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
    let ganado = new BigNumber(0);

    let levelsPrice = [];
    levelsPrice[1] = 20;

    for (i = 2; i <= LAST_LEVEL; i++) {
      levelsPrice[i] = levelsPrice[i - 1] * 2;
    }

    for (i = 1; i <= LAST_LEVEL; i++) {
      let estilo1, estilo2, estilo3 = '';

      let countPersonas, ciclos = 0;

      if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from })) {
        invertido += levelsPrice[i];

        let matrix = await contract.principal.methods.usersX3Matrix(wallet, i).call({ from });
        ciclos = parseInt(matrix[3])

        if (matrix[1].length > 0) {
          team = [...team, ...matrix[1]]
          team = [...new Set(team)]
        }

        countPersonas = matrix[1].length + (ciclos * 3)
        personas += countPersonas;

        let factor = countPersonas/3
        let cantidad = parseInt(factor)*2
        factor = (''+factor).split('.')

        if(factor.length > 1){
          factor = factor[1]
          if(factor.indexOf('3') >= 0) {
            factor = 1
          }else{
            factor = 2
          }
        }else{
          factor = 0
        }
        
        cantidad = parseInt(cantidad)+parseInt(factor)

        ganado = new BigNumber(cantidad).times(levelsPrice[i]).plus(ganado);
        
        let rango = matrix[1].length + ((ciclos * 3) % 3);

        if (countPersonas > 0) {
          switch (rango) {
            case 1:
              estilo1 = '#009030';
              estilo2 = 'gray';
              estilo3 = 'gray';

              break;
            case 2:
              estilo1 = '#009030';
              estilo2 = '#009030';
              estilo3 = 'gray';

              break;

            case 0:
              estilo1 = '#009030';
              estilo2 = '#009030';
              estilo3 = '#009030';

              break;

            default:
              estilo1 = 'gray';
              estilo2 = 'gray';
              estilo3 = 'gray';
              break;
          }
        }


        if (rango) {
        }


        canastas[i - 1] = (
          <Col md={4} style={{ width: '200px', margin: '1.05rem', padding: '2% 1%', textAlign: 'center', borderStyle: 'solid', borderWidth: '2px', borderColor: 'white', borderRadius: '10px' }} key={"level" + i}>
            <h3 style={{ color: 'white', margin: '2px', padding: '2px' }}>{i}</h3>
            <span style={{ color: "white" }}>{levelsPrice[i]} {tokenName}</span><br></br>
            <span className={"badge-left badge badge-gray"} style={{ color: estilo1 }}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge badge-gray"} style={{ color: estilo2 }}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge badge-gray"} style={{ color: estilo3 }}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'black', width: '80%', backgroundColor: 'gray', cursor: 'not-allowed', fontWeight: 'bold', borderRadius: '5px', borderStyle: 'none' }}> Buyed</button>
            <br></br>
            <i className="fa fa-users" style={{ color: countPersonas > 0 ? '#009030' : '' }}></i> {countPersonas} {'  |  '}
            <i className="fa fa-refresh" style={{ color: ciclos > 0 ? '#009030' : '' }}></i> {ciclos}

          </Col>
        );

      } else {
        canastas[i - 1] = (
          <Col md={4} style={{ width: '200px', margin: '1.1rem', padding: '2% 1%', textAlign: 'center', borderStyle: 'solid', borderWidth: '2px', borderColor: 'white', borderRadius: '10px' }} key={"level-" + i}>
            <h3 style={{ color: 'white', marginTop: '10px' }}>{i} </h3>
            <span style={{ color: "white" }}>{levelsPrice[i]} {tokenName}</span><br></br>
            <span className={"badge-left badge badge-gray"}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge badge-gray"}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge badge-gray"}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="btn" onClick={() => { this.deposit() }} style={{ color: 'white', width: '80%', backgroundColor: '#009030', borderRadius: '5px', fontWeight: 'bold', borderStyle: 'none' }}> <b>Buy Level</b></button>
            <br></br>
            <i className="fa fa-users"></i> 0 {'  |  '}
            <i className="fa fa-refresh"></i> 0

          </Col>
        );
      }

      this.setState({
        canastas,
      });
    }

    this.getTeam(team)

    this.setState({
      invertido: invertido,
      ganado: ganado,
      personas: personas,
    });



  }

  async getTeam(list) {

    let { wallet, contract } = this.state

    let from = wallet;

    //console.log(list)
    let count = list.length;

    for (let index = 0; index < list.length; index++) {
      count += parseInt((await contract.principal.methods.users(list[index]).call({ from })).partnersCount);
    }

    this.setState({ team: count })

    return count
  }

  async getSponsor() {

    let { owner, wallet, walletView, contract } = this.state

    let from = wallet;
    if(this.props.isView) wallet = walletView

    let sponsor = owner;
    let loc = document.location.href;
    if (!await contract.principal.methods.isUserExists(wallet).call({ from })) {

      sponsor = cookies.get('sponsor')

      if (sponsor === undefined) sponsor = owner

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

          let inversor = await contract.principal.methods.idToAddress(tmp).call({ from });

          if (await contract.principal.methods.isUserExists(inversor).call({ from })) {

            sponsor = inversor;
            cookies.set('sponsor', '' + sponsor, { maxAge: 86400 * 30 })

          }
        }

      }

    } else {
      let user = await contract.principal.methods.users(wallet).call({ from })
      sponsor = user.referrer
    }

    let userSponsor = await contract.principal.methods.users(sponsor).call({ from })

    this.setState({
      sponsor,
      idSponsor: new BigNumber(userSponsor.id)
    })

    return sponsor

  }

  async deposit() {

    if (this.props.isView) return;

    let { level, levelPrice, balanceUSDT, aprovedUSDT, contract, wallet, decimals } = this.state;

    let from = wallet;

    let LAST_LEVEL = parseInt(await contract.principal.methods.LAST_LEVEL().call({ from }))


    if (level >= LAST_LEVEL) {
      window.alert("You reached the last level");
      return;
    }

    if (levelPrice.toNumber() > balanceUSDT.toNumber()) {
      window.alert("You do not have enough funds in your account");
      return;
    }

    let direccionSP = await this.getSponsor();
    const gasPrice = await contract.web3.eth.getGasPrice();


    if (aprovedUSDT.toNumber() <= levelPrice.toNumber()) {
      try {

        await contract.token.methods.approve(contractAddress, new BigNumber("1000000").shiftedBy(decimals).toString(10)).send({ from: wallet, gasPrice })

      } catch (error) {
        console.log(error)
        window.alert("Error approve: " + error.toString());
      }
      return;
    }

    this.setState({
      sponsor: direccionSP
    });


    if (await contract.principal.methods.isUserExists(wallet).call({ from })) {
      try {

        await contract.principal.methods.buyNewLevel(level + 1, levelPrice * 10 ** 6).send({ from, gasPrice });


      } catch (error) {
        console.log(error)
        window.alert("Error buy level: " + error.toString());
        return;
      }


    } else {
      try {

        await contract.principal.methods.registrationExt(direccionSP, levelPrice * 10 ** 6).send({ from, gasPrice });



      } catch (error) {
        console.log(error)
        window.alert("Error register: " + error.toString());
        return;
      }

    }
  }


  async withdraw() {
    if (this.props.isView) return;

    let { contract, wallet } = this.state

    contract.principal.methods.withdraw().send({ from: wallet })
      .then(() => {
        alert("Is done")
      })
      .catch((e) => {
        alert("Error: " + e.toString())
      })
  }

  async changeToken(token) {
    if (this.props.isView) return;

    let { wallet, contract } = this.state

    contract.methods.ChangeTokenUSDT(token).sen({ from: wallet })
      .then(() => { alert("change is done") })
      .catch(console.error)

  }

  render() {


    let { wallet, walletView, id, balanceUSDT, level, texto, link, idSponsor, sponsor, ganado, personas, canastas, isOwner, team, addressToken, tokenName } = this.state

    if(this.props.isView){
      wallet = walletView
    }

    let ChangeToken = <></>

    if (isOwner && !this.props.isView) {
      ChangeToken = (
        <Row>
          <Col>
            Change principal token: <br></br>
            <button onClick={() => this.changeToken("0xc2132D05D31c914a87C6611C10748AEb04B58e8F")}>USDT</button>
            <button onClick={() => this.changeToken("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063")}>DAI</button>
            <button onClick={() => this.changeToken("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359")}>USDC</button>
          </Col>
        </Row>)
    }


    return (<>
      <Container style={{ marginTop: "100px", fontSize: '16px', color: "white" }}>
        <Row >
          <Col>
            <Container>
              <Row>
                <Col md>
                  <p style={{ textAlign: 'center', marginBottom: '0px' }}><span style={{ fontWeight: 'bold', color: 'white', wordBreak: 'break-all', fontSize: '1.3rem' }}>{wallet} </span></p>
                  <table className="table" >
                    <tbody>
                      <tr>
                        <td>
                          Balance
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {balanceUSDT.dp(2).toString(10)} <strong>{tokenName}</strong>
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
                      <tr>
                        <td>
                          My ID
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold' }}>{id}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Partners
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold' }}>{team}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Team
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold' }}>{personas}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Profit
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold' }}>{ganado.dp(2).toString(10) } {tokenName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Sponsor
                        </td>
                        <td style={{ textAlign: 'right', wordBreak: "break-all" }}>
                          {idSponsor.dp(0).toString()}:{sponsor}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row style={{ textAlign: 'center', marginBottom: '0px' }}>
                <Col md>
                  <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => this.deposit()} style={{ color: 'white', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }} >{texto}</button>
                </Col>
              </Row>
              <Row style={{ textAlign: 'center', marginBottom: '0px', }}>
                <Col md>

                  <p style={{ border: 'solid white', borderRadius: '5px', padding: '2px', margin: '10px' }}>{link}</p>

                  <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => {
                    if (link !== "") {
                      navigator.clipboard.writeText(link);
                      window.alert("link copied!")
                    }
                  }} style={{ color: 'white', width: '325px', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }}>Copy referal link <span><i className="fa fa-clipboard text-white"></i></span></button>
                </Col>
              </Row>

              {ChangeToken}
            </Container>
          </Col>

        </Row>
        <Row >
          <Col >
            <Container>

              <Row lg={4} >
                {canastas}

              </Row>

            </Container>
          </Col>

        </Row>

        <Row style={{ paddingTop: '40px' }}>
          <div className="col-six" style={{ textAlign: 'right' }}>
            <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-users"></i> Number partners in the slot</div>
          </div>
          <div className="col-six " >
            <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-refresh"></i> Recycle count</div>
          </div>

        </Row>
      </Container>
      <div>Token: {addressToken}</div>
    </>);
  }
}


export default BackOffice
