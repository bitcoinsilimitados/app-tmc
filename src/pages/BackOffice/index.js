import React, { Component } from "react";

import Web3 from "web3";

import abiToken from "../../assets/abi/TokenPRC20.js";
import abiTMC from "../../assets/abi/TMC-v2.js";

import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

var BigNumber = require('bignumber.js');

// https://polygon-mainnet.infura.io/v3/5a0e1e011860401880d5984367e68fbf
//https://polygon-rpc.com

const RPC = "https://rpc.cardona.zkevm-rpc.com"

const contractAddress = "0x0b440D597eCe30F3416669C5FFE982443e683843"

const wallet0x = "0x0000000000000000000000000000000000000000";

const LAST_LEVEL = 15;


class BackOffice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      decimals: 6,
      owner: wallet0x,
      addressToken: wallet0x,
      walletView: wallet0x,
      sponsor: wallet0x,
      aprovedUSDT: new BigNumber(0),
      balanceUSDT: new BigNumber(0),
      balanceLost: new BigNumber(0),
      levelPrice: new BigNumber(0),
      ganado: new BigNumber(0),
      idSponsor: new BigNumber(0),
      admin: false,
      tokenName: "",
      id: new BigNumber(0),
      wallet: wallet0x,
      level: 0,
      team: "0",
      texto: "Loading...",
      link: "Loading...",
      canastas: [],
      levelsPrice: [],
      image: <></>,

      metamask: {
        installed: false,
        logged: false,
        viewer: false,
      },

      contract: {
        ready: false,
        web3: null,
        token: null,
        principal: null
      },

      intervalo: null,
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

    let inicio = setInterval(() => {
      this.estado();
    }, 5 * 1000);

    this.setState({ intervalo: inicio });
  }

  async componentWillUnmount() {
    clearInterval(this.state.intervalo);
  }

  async conectar() {

    let { contract, wallet, walletView, metamask } = this.state

    let web3 = new Web3(RPC);

    if (typeof window.ethereum !== 'undefined') {
      metamask.installed = true;
      wallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async (a) => {
          metamask.logged = true;
          return a[0]
        })
        .catch((e) => {
          metamask.logged = false;
          console.log(e);
          return wallet0x;
        });

      web3 = new Web3(window.ethereum);

      let idRed = 2442

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + idRed.toString(16) }],
      }).catch(async (e) => {
        console.log(e)
        await window.ethereum.request({
          jsonrpc: '2.0',
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x' + idRed.toString(16),
              chainName: 'Polygon TestNet-zkevm',
              rpcUrls: [RPC],
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              },
              blockExplorerUrls: ['https://cardona-zkevm.polygonscan.com/']
            }
          ],
          id: 0
        })
      })
    } else {
      metamask.viewer = true;
      metamask.installed = false;
      metamask.logged = false;
    }

    let from = wallet
    contract.web3 = web3;

    contract.principal = new web3.eth.Contract(
      abiTMC,
      contractAddress
    );

    let owner = await contract.principal.methods.owner().call({ from });

    let addressToken = await contract.principal.methods.tokenUSDT().call({ from })

    contract.token = new web3.eth.Contract(
      abiToken,
      addressToken
    );

    let decimals = parseInt(await contract.token.methods.decimals().call({ from }))
    let tokenName = await contract.token.methods.symbol().call({ from })

    contract.ready = true;

    if (this.props.isView) {
      let loc = document.location.href;

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
          walletView = await contract.principal.methods.idToAddress(parseInt(loc)).call({ from })

        } finally {
          if (!await contract.principal.methods.isUserExists(walletView).call({ from })) {
            alert("user is not exists. Register first.")
            walletView = wallet0x;
          }

        }
      }


      from = walletView

      if (walletView === wallet0x) {
        walletView = await contract.principal.methods.owner().call({ from })
      }


    }

    this.setState({
      metamask,
      contract,
      addressToken,
      decimals,
      tokenName,
      owner,
      wallet,
      walletView,
    })

    return contract.ready;
  }

  async estado() {

    let { wallet, walletView, owner, decimals, contract, link, tokenName, metamask } = this.state

    await this.conectar();

    if (!contract.ready && ((!metamask.installed && !metamask.logged) || metamask.viewer)) return;

    this.getSponsor()

    this.setState({
      isOwner: owner.toLowerCase() === wallet.toLowerCase() && wallet.toLowerCase() !== wallet0x
    })

    let from = wallet
    if (this.props.isView) wallet = walletView
    let activeLevels = 0;
    let team = []

    for (var i = LAST_LEVEL; i >= 0; i--) {

      if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from })) {
        activeLevels++;
      }

    }

    let levelPrice = await contract.principal.methods.levelPrice(activeLevels + 1).call({ from })
    levelPrice = new BigNumber(parseInt(levelPrice)).shiftedBy(-decimals)

    let balanceLost = await contract.principal.methods.missPayments(wallet).call({ from })
    balanceLost = new BigNumber(parseInt(balanceLost)).shiftedBy(-decimals)

    let balanceUSDT = await contract.token.methods.balanceOf(wallet).call({ from });
    balanceUSDT = new BigNumber(parseInt(balanceUSDT)).shiftedBy(-decimals)

    //console.log(balanceUSDT.toString(10))

    let aprovedUSDT = await contract.token.methods.allowance(wallet, contractAddress).call({ from });
    aprovedUSDT = new BigNumber(parseInt(aprovedUSDT)).shiftedBy(-decimals)


    let texto = "Buy | " + levelPrice.toString(10) + tokenName;

    if (activeLevels === 0) {
      texto = "Register | " + levelPrice.toString(10) + tokenName;
    }

    if (activeLevels === LAST_LEVEL) {
      texto = "Max Level Reached"
    }

    if (aprovedUSDT.toNumber() === 0) {
      texto = "CONNECT WALLET"
    }


    this.setState({
      level: activeLevels,
      levelPrice,
      texto,
      balanceUSDT,
      aprovedUSDT,
      balanceLost,
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

    let { canastas, level } = this.state;

    let invertido = 0;
    let personas = 0;
    let ganado = new BigNumber(0);

    let levelsPrice = [];
    levelsPrice[1] = 20;

    for (i = 2; i <= LAST_LEVEL; i++) {
      levelsPrice[i] = levelsPrice[i - 1] * 2;
    }

    this.setState({ levelsPrice })

    for (i = 1; i <= LAST_LEVEL; i++) {
      let estilo1, estilo2, estilo3 = '';

      let countPersonas, ciclos = 0;

      if (i <= level) {
        invertido += levelsPrice[i];

        let matrix = await contract.principal.methods.usersX3Matrix(wallet, i).call({ from });
        ciclos = parseInt(matrix[3])

        if (matrix[1].length > 0) {
          team = [...team, ...matrix[1]]
          team = [...new Set(team)]
        }

        countPersonas = matrix[1].length + (ciclos * 3)

        if (i === 1) {
          this.setState({ team: countPersonas })
        }
        personas += countPersonas;

        let factor = countPersonas / 3
        let cantidad = parseInt(factor) * 2
        factor = ('' + factor).split('.')

        if (factor.length > 1) {
          factor = factor[1]
          if (factor.indexOf('3') >= 0) {
            factor = 1
          } else {
            factor = 2
          }
        } else {
          factor = 0
        }

        cantidad = parseInt(cantidad) + parseInt(factor)

        ganado = new BigNumber(cantidad).times(levelsPrice[i]).plus(ganado);

        let rango = matrix[1].length + ((ciclos * 3) % 3);

        if (countPersonas > 0) {
          switch (rango) {
            case 1:
              estilo1 = '#009030';
              estilo2 = 'white';
              estilo3 = 'white';

              break;
            case 2:
              estilo1 = '#009030';
              estilo2 = '#009030';
              estilo3 = 'white';

              break;

            case 0:
              estilo1 = '#009030';
              estilo2 = '#009030';
              estilo3 = '#009030';

              break;

            default:
              estilo1 = 'white';
              estilo2 = 'white';
              estilo3 = 'white';
              break;
          }
        }


        canastas[i - 1] = (
          <div className="item" key={"level" + i}>
            <h3 style={{ color: 'white', margin: '2px', padding: '2px' }}>{i}</h3>
            <span style={{ color: "white" }}>{levelsPrice[i].toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {tokenName}</span><br></br>
            <span className={"badge-left badge"} style={{ color: estilo1 }}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge"} style={{ color: estilo2 }}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge"} style={{ color: estilo3 }}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'black', width: '80%', backgroundColor: 'gray', cursor: 'not-allowed', fontWeight: 'bold', borderRadius: '5px', borderStyle: 'none' }}> Buyed</button>
            <br></br>
            <i className="fa fa-users" style={{ color: countPersonas > 0 ? '#009030' : '' }}></i> {countPersonas} {'  |  '}
            <i className="fa fa-refresh" style={{ color: ciclos > 0 ? '#009030' : '' }}></i> {ciclos}
          </div>
        );

      } else {

        canastas[i - 1] = (
          <div className="item" key={"level-" + i}>
            <h3 style={{ color: 'white', margin: '2px', padding: '2px' }}>{i} </h3>
            <span style={{ color: "white" }}>{levelsPrice[i].toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {tokenName}</span><br></br>
            <span className={"badge-left badge"}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge"}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge"}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="btn" onClick={() => { this.deposit() }} style={{ color: 'white', width: '80%', backgroundColor: '#009030', borderRadius: '5px', fontWeight: 'bold', borderStyle: 'none' }}> <b>Buy Level</b></button>
            <br></br>
            <i className="fa fa-users"></i> 0 {'  |  '}
            <i className="fa fa-refresh"></i> 0
          </div>
        );
      }

      this.setState({
        canastas,
      });
    }

    this.setState({
      invertido,
      ganado,
      personas,
    });

    let image = <></>
    let url = ''

    if (ganado.toNumber() >= 2000 && level >= 4) {
      url = '1'
    }

    if (ganado.toNumber() >= 10000 && level >= 6) {
      url = '2'
    }

    if (ganado.toNumber() >= 100000 && level >= 9) {
      url = '3'
    }

    if (ganado.toNumber() >= 1000000 && level >= 13) {
      url = '4'
    }

    if (ganado.toNumber() >= 10000000 && level >= 14) {
      url = '5'
    }

    if (ganado.toNumber() >= 50000000 && level >= 15) {
      url = '6'
    }

    if (ganado.toNumber() >= 100000000 && level >= 15) {
      url = '7'
    }

    if (url !== '') {
      image = <img style={{ width: '150px' }} src={'images/avatars/sello-' + url + '.png'} alt="sello level"></img>

    }

    this.setState({ image })



  }

  async getTeam(list) {

    let count = list.length;

    for (let index = 0; index < list.length; index++) {
      count++
    }

    this.setState({ team: count })

    return count
  }

  async getSponsor() {

    let { owner, wallet, contract } = this.state

    let from = wallet;
    //if (this.props.isView) wallet = walletView

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
    let { level, balanceUSDT, aprovedUSDT, contract, wallet, decimals, levelsPrice } = this.state;

    level++

    let from = wallet;

    let LAST_LEVEL = parseInt(await contract.principal.methods.LAST_LEVEL().call({ from }))


    if (level > LAST_LEVEL) {
      window.alert("You reached the last level");
      return;
    }

    if (levelsPrice[level] > balanceUSDT.toNumber()) {
      window.alert("You do not have enough funds in your account");
      return;
    }

    if (aprovedUSDT.toNumber() <= levelsPrice[level]) {
      try {
        await contract.token.methods.approve(contractAddress, new BigNumber("100000000").shiftedBy(decimals).toString(10))
          .send({
            from,
            gasPrice: '10000000',
            gas: 1000000
          })

      } catch (error) {
        console.log(error)
        window.alert("Error approve: " + error.toString());
      }
      return;

    }

    if (await contract.principal.methods.isUserExists(wallet).call({ from })) {
      try {
        await contract.principal.methods.buyNewLevel(level, new BigNumber(levelsPrice[level]).shiftedBy(decimals).toNumber()).send({
          from,
          gasPrice: '10000000',
          gas: 1000000
        });

      } catch (error) {
        console.log(error)
        window.alert("Error buy level: " + error.toString());
        return;
      }

    } else {
      try {
        let sponsor = await this.getSponsor();
        this.setState({ sponsor });
        await contract.principal.methods.registrationExt(sponsor, new BigNumber(levelsPrice[1]).shiftedBy(decimals).toNumber())
          .send({
            from,
            gasPrice: '10000000',
            gas: 1000000
          });

      } catch (error) {
        console.log(error)
        window.alert("Error register: " + error.toString());
        return;
      }

    }

    this.estado();

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

    let { wallet, walletView, id, balanceUSDT, balanceLost, level, texto, link, idSponsor, sponsor, ganado, personas, canastas, isOwner, team, addressToken, tokenName, image } = this.state

    if (this.props.isView) {
      wallet = walletView
    }

    let ChangeToken = <></>

    if (isOwner && !this.props.isView) {
      ChangeToken = (<>

        Change principal token: <br></br>
        <button onClick={() => this.changeToken("0xc2132D05D31c914a87C6611C10748AEb04B58e8F")}>USDT</button>
        <button onClick={() => this.changeToken("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063")}>DAI</button>
        <button onClick={() => this.changeToken("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359")}>USDC</button>
      </>)
    }


    return (
      <div style={{
        width: '100%', display: 'block', marginTop: "100px",
        padding: '0 1.1rem 0 1.1rem', fontSize: '16px', color: "white",
        gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', gridAutoRows: 'minmax(100px, auto)'
      }}>
        <div >
          {image}
        </div>

        <div >
          <table className="table" >
            <tbody>
              <tr>
                <td>
                  PROFIT
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold' }}>{ganado.dp(2).toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {tokenName}</span>
                </td>
              </tr>
              <tr>
                <td>
                  Balance
                </td>
                <td style={{ textAlign: 'right' }}>
                  {balanceUSDT.dp(2).toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} <strong>{tokenName}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  Level
                </td>
                <td style={{ textAlign: 'right' }}>
                  {level}/15
                </td>
              </tr>
              <tr>
                <td>
                  Partners
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold' }}>{team.toString(10)}</span>
                </td>
              </tr>
              <tr>
                <td>
                  Depth
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold' }}>{personas}</span>
                </td>
              </tr>
              <tr>
                <td>
                  LostPay
                </td>
                <td style={{ textAlign: 'right' }}>
                  {balanceLost.dp(2).toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} <strong>{tokenName}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  My ID
                </td>
                <td style={{ textAlign: 'right', wordBreak: "break-all" }}>
                  <span style={{ fontWeight: 'bold' }}>{id.toString(10)}:{wallet}</span>
                </td>
              </tr>
              <tr>
                <td>
                  Sponsor
                </td>
                <td style={{ textAlign: 'right', wordBreak: "break-all" }}>
                  {idSponsor.toString(10)}:{sponsor}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div >
          <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => this.deposit()} style={{ width: '100%', color: 'white', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }} >{texto}</button>

        </div>

        <div >
          <p style={{ border: 'solid white', borderRadius: '5px', padding: '2px', marginBottom: '5px' }}>{link}</p>

          <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => {
            if (link !== "") {
              navigator.clipboard.writeText(link);
              window.alert("link copied!")
            }
          }} style={{ color: 'white', width: '100%', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }}>Copy referal link <span><i className="fa fa-clipboard text-white"></i></span></button>

        </div>

        <div >
          {ChangeToken}
        </div>

        <div className="contenedor-flex">
          {canastas}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ wordBreak: 'break-all' }}>

            <span color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-users"></i> Number Partners on Level</span>
            <br></br>
            <span color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-refresh"></i> Level Cycle</span>


          </p>
          <hr color="white"></hr>

          <p>
            Address Token: <br></br>
            {addressToken}
          </p>
        </div>

      </div >
    );
  }
}


export default BackOffice
