import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';

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
      metamask: false,
      wallet: "Loading...",
      admin: false,
      id: "Loading...",
      level: "Loading...",
      balanceUSDT: new BigNumber(0),
      levelPrice: new BigNumber(0),
      texto: "Loading...",
      link: "Loading...",
      decimals: 6,
      canastas: [],
      owner: undefined,
      sponsor: undefined,
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

    /**
    window.ethereum.on("_initialized", () => { this.conectar(); this.estado(); })
    window.ethereum.on("connect", () => { this.conectar(); this.estado(); })
    window.ethereum.on("accountsChanged", () => { this.conectar(); this.estado(); })
    window.ethereum.on("chainChanged", () => { this.conectar(); this.estado(); })
 
    */

    //window.ethereum.on("disconnect", disconnectWallet)

    //remover disparadores  window.ethereum.removeListener("accountsChanged", handleAccountsChanged) // .removeAllListeners()


  }

  async componentWillUnmount() {
    clearInterval(this.state.intervalo);
    //window.ethereum.removeAllListeners();
  }

  async conectar() {


    let { metamask, contract } = this.state

    let provider;
    let wallet = wallet0x;

    if(this.props.isView){
      provider = RPC;
    }

    if (typeof window.ethereum !== 'undefined' && !metamask) {

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x98A' }], // poligon Mainet 0x89
      })

      if(!this.props.isView){
        wallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async (accounts) => {

          this.setState({metamask: true})

          return accounts[0]

        })
        .catch((error) => {
          console.error(error)
          this.setState({
            metamask: false,
          })
          return wallet0x
        });
      }

      provider = await detectEthereumProvider();

    }

    let web3 = new Web3(provider);
    contract.web3 = web3

    let loc = document.location.href;

    if(this.props.isView){

      wallet = wallet0x

      if (loc.indexOf('&wallet=') > 0 ) {
        loc = loc.split('&wallet=')[1];
        loc = loc.split('&')[0];
        loc = loc.split('#')[0];
        loc = loc.toLowerCase()

        try {
          wallet = web3.utils.toChecksumAddress(loc)
          
        } catch (error) {
          let msg =  "Error: " + (error.toString()).split('Error:')[1]
          console.log(msg)
          //window.alert(msg)
        }
      }

      
    }


    if(!contract.ready){
      contract.principal = new web3.eth.Contract(
        abiTMC,
        contractAddress
      );

      let addressToken = await contract.principal.methods.tokenUSDT().call({ from: wallet })
      .catch(console.log)

      this.setState({ addressToken })

      contract.token = new web3.eth.Contract(
        abiToken,
        addressToken
      );

      contract.ready = true;
    }

    if(wallet === wallet0x){
      wallet = await contract.principal.methods.owner().call({ from: wallet })
    }

    let balance = parseInt(await contract.token.methods.balanceOf(wallet).call({ from: wallet }))
    let decimals = parseInt(await contract.token.methods.decimals().call({ from: wallet }))

    balance = new BigNumber(balance).shiftedBy(-decimals)

    this.setState({
      wallet,
      balanceUSDT: balance,
      decimals,
      contract,
    })

    this.estado()

    
  }

  async estado() {

    let { wallet, decimals, contract, link } = this.state

    if (!contract.ready) return;

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


    let texto = "Buy Next Level"

    if (activeLevels === 0) {
      texto = "Register & Buy Level"
    }

    if (activeLevels === 15) {
      texto = "Max Level Reached"
    }

    if (aprovedUSDT.toNumber() === 0) {
      texto = "CONNECT WALLET"
    }

    let owner = await contract.principal.methods.owner().call({ from: wallet });

    this.setState({
      level: activeLevels,
      levelPrice,
      texto,
      balanceUSDT,
      aprovedUSDT,
      owner,
      isOwner: owner.toLowerCase() === wallet.toLowerCase()
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
      let matrix = []
      let estilo1, estilo2, estilo3 = '';

      let countPersonas, ciclos = 0;

      if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from: wallet })) {
        invertido += levelsPrice[i];

        //let usersX3Matrix = await contract.principal.methods.usersX3Matrix(wallet, i).call({ from: wallet });
        //console.log(usersX3Matrix)  

        matrix = await contract.principal.methods.usersX3Matrix(wallet, i).call({ from: wallet });
        ciclos = parseInt(matrix[3])

        countPersonas = matrix[1].length + (ciclos * 3)
        personas += countPersonas;

        ganado += (countPersonas) * levelsPrice[i];

        let rango = matrix[1].length + ((ciclos * 3) % 3);

        if(countPersonas > 0){
          switch (rango) {
            case 1:
              estilo1 = 'green';
              estilo2 = "";
              estilo3 = "";
  
              break;
            case 2:
              estilo1 = 'green';
              estilo2 = 'green';
              estilo3 = "";
  
              break;
  
            case 0:
              estilo1 = 'green';
              estilo2 = 'green';
              estilo3 = 'green';
  
              break;
  
            default:
              estilo1 = '';
              estilo2 = '';
              estilo3 = '';
              break;
          }
        }
        

        if (rango) {
        }

        //console.log(ganado);
        canastas[i - 1] = (
          <Col md={4} style={{ width: '200px', margin: '1.1rem', padding: '2% 1%', textAlign: 'center', borderStyle:'solid', borderWidth: '2px', borderColor:'gray', borderRadius: '10px'  }} key={"level" + i}>
            <h3 style={{ color: 'white' , marginTop: '10px'}}>Level {i} </h3>

            <span className={"badge-left badge badge-gray"} style={{color: estilo1}}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge badge-gray"} style={{color: estilo2}}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge badge-gray"} style={{color: estilo3}}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'white', width: '100%' }}> Buyed</button>
            <br></br>
            <i className="fa fa-users" style={{color: countPersonas>0?'green':''}}></i> {countPersonas} {'  |  '}
            <i className="fa fa-refresh" style={{color: ciclos>0?'green':''}}></i> {ciclos}

          </Col>
        );

      } else {
        canastas[i - 1] = (
          <Col md={4} style={{ width: '200px', margin: '1.1rem', padding: '2% 1%', textAlign: 'center', borderStyle:'solid', borderWidth: '2px', borderColor:'gray', borderRadius: '10px'  }} key={"level-" + i}>
            <h3 style={{ color: 'white', marginTop: '10px' }}>Level {i} </h3>

            <span className={"badge-left badge badge-gray"}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge badge-gray"}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge badge-gray"}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'white', width: '100%' }}> {levelsPrice[i]} USDT</button>
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
    if (!await contract.principal.methods.isUserExists(wallet).call({ from: wallet })) {

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

          let inversor = await contract.principal.methods.idToAddress(tmp).call({ from: wallet });

          if (await contract.principal.methods.isUserExists(inversor).call({ from: wallet })) {

            sponsor = inversor;
            cookies.set('sponsor', '' + sponsor, {maxAge: 86400 * 30})

          }
        } 

      }
      
    }else{
      let user = await contract.principal.methods.users(wallet).call({ from: wallet })
      sponsor = user.referrer
    }

    this.setState({sponsor})
    return sponsor

  }

  async deposit() {

    if(this.props.isView)return;

    let { level, levelPrice, balanceUSDT, aprovedUSDT, contract, wallet, decimals } = this.state;

    let LAST_LEVEL = parseInt(await contract.principal.methods.LAST_LEVEL().call({ from: wallet }))


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


    if (await contract.principal.methods.isUserExists(wallet).call({ from: wallet })) {
      try {

        await contract.principal.methods.buyNewLevel(level + 1, levelPrice * 10 ** 6).send({ from: wallet, gasPrice });


      } catch (error) {
        console.log(error)
        window.alert("Error buy level: " + error.toString());
        return;
      }


    } else {
      try {

        await contract.principal.methods.registrationExt(direccionSP, levelPrice * 10 ** 6).send({ from: wallet, gasPrice });



      } catch (error) {
        console.log(error)
        window.alert("Error register: " + error.toString());
        return;
      }

    }
  }


  async withdraw() {
    if(this.props.isView)return;

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
    if(this.props.isView)return;

    let { wallet, contract } = this.state

    contract.methods.ChangeTokenUSDT(token).sen({ from: wallet })
      .then(() => { alert("change is done") })
      .catch(console.error)

  }

  render() {


    let { wallet, id, balanceUSDT, level, levelPrice, texto, link,sponsor, ganado, personas, canastas, isOwner } = this.state

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


    return (<Container style={{ marginTop: "100px", fontSize: '16px', color: "gray" }}>
      <Row >
        <Col>
          <Container>
            <Row>
              <Col md>
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
                    <tr>
                      <td>
                        Sponsor
                      </td>
                      <td style={{ textAlign: 'right', wordBreak: "break-all" }}>
                        {sponsor}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row style={{ textAlign: 'center', marginBottom: '0px' }}>
              <Col md>
                <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => this.deposit()} style={{ color: 'white', width: '%' }} >{texto}</button>
                <br></br>
                Price {levelPrice.toString(10)} USDT
              </Col>
            </Row>
            <Row style={{ textAlign: 'center', marginBottom: '0px' }}>
              <Col md>
                {link}
                <br></br>

                <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => {
                  if (link !== "") {
                    navigator.clipboard.writeText(link);
                    window.alert("link copied!")
                  }
                }} style={{ color: 'white', width: '325px' }}>Copy referal link <span><i className="fa fa-clipboard text-white"></i></span></button>
              </Col>
            </Row>

            {ChangeToken}
          </Container>
        </Col>

      </Row>
      <Row >
        <Col >
          <Container>
            <Row md={6} >
              <Col md={6} style={{ textAlign: 'center' }}>
                <h2 style={{ color: "white", marginTop: '0px' }}>Earned:</h2>
                <p>
                  {ganado | 0} USDT
                </p>
              </Col>
             
              <Col md={6} style={{ textAlign: 'center' }}>
                <h2 style={{ color: "white", marginTop: '0px' }}>Team:</h2>
                <p>
                  {personas | 0}
                </p>
              </Col>

            </Row>

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
    </Container>);
  }
}


export default BackOffice
