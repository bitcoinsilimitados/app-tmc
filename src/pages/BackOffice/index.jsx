import React, { Component } from "react";

import Web3 from "web3";

import abiToken from "../../assets/abi/TokenPRC20.js";
import abiTMC from "../../assets/abi/TMC-v2.js";

import Cookies from 'universal-cookie';

import Utils from "../../Utils/index.js";

import { LangContext } from "../../i18n";

const cookies = new Cookies(null, { path: '/' });

import { BigNumber } from "bignumber.js";

const RPC = Utils.rpc;

let web3 = new Web3(RPC);

let initContract = false;

const contractAddress = Utils.contract

const wallet0x = "0x0000000000000000000000000000000000000000";

var gas = "1000000";

class BackOffice extends Component {

  static contextType = LangContext;

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
      team: 0,
      personas: 0,
      link: "Loading...",
      levelData: [],
      levelsPrice: [],
      image: <></>,

      metamask: {
        conectando: false,
        installed: false,
        logged: false,
        viewer: false,
      },

      contract: {
        wallet: null,
        ready: false,
        web3: null,
        token: null,
        principal: null
      },

      intervalo: null,
      LAST_LEVEL: 15,
      gasPrice: 44522276539n

    };

    this.conectar = this.conectar.bind(this);
    this.setContract = this.setContract.bind(this);
    this.estado = this.estado.bind(this);

    this.withdraw = this.withdraw.bind(this);
    this.deposit = this.deposit.bind(this);

    this.getSponsor = this.getSponsor.bind(this);
    this.changeToken = this.changeToken.bind(this);

  }

  async componentDidMount() {

    document.getElementById("contractAddress1").href = "https://polygonscan.com/address/" + Utils.contract
    document.getElementById("contractAddress").href = "https://polygonscan.com/address/" + Utils.contract

    setTimeout(() => {
      this.estado();
    }, 3 * 1000)

    let inicio = setInterval(() => {
      this.estado();
    }, 30 * 1000);

    this.setState({ intervalo: inicio });
  }

  async componentWillUnmount() {
    clearInterval(this.state.intervalo);
  }

  async conectar() {

    let { wallet, metamask } = this.state

    if (typeof window.ethereum !== 'undefined') {
      metamask.installed = true;

      if (!this.state.metamask.conectando) {
        metamask.conectando = true;
        this.setState({ metamask })

        try {

          wallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async (a) => {
              metamask.logged = true;
              return a[0]
            })

        } catch (error) {

          metamask.logged = false;
          alert(error.message);
          wallet = wallet0x;

        }

        web3 = new Web3(window.ethereum);
        /**
          let idRed = Utils.chainID
    
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + idRed.toString(16) }],
          })
            .catch(async (e) => {
              console.log(e)
              await window.ethereum.request({
                jsonrpc: '2.0',
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x' + idRed.toString(16),
                    chainName: 'Polygon',
                    rpcUrls: [RPC],
                    nativeCurrency: {
                      name: 'Polygon',
                      symbol: 'POL',
                      decimals: 18
                    },
                    blockExplorerUrls: ['https://polygonscan.com/']
                  }
                ],
                id: 0
              })
            })
    
        */
        metamask.conectando = false;
        this.setState({ metamask })
      }


    } else {
      metamask.viewer = true;
      metamask.installed = false;
      metamask.logged = false;
    }

    this.setState({
      wallet,
      metamask
    })

    await this.setContract()

    return metamask.logged;
  }

  async setContract() {

    let { wallet, contract, walletView } = this.state;

    contract.wallet = wallet;
    contract.web3 = web3

    let from = wallet

    let gasPrice = await web3.eth.getGasPrice().catch((e) => { console.log(e); return 10000000n })

    try {

      contract.principal = new web3.eth.Contract(
        abiTMC,
        contractAddress,
        { from }
      )

    } catch (error) {
      console.log(error)
    }

    let owner = await contract.principal.methods.owner().call();

    let addressToken = await contract.principal.methods.tokenUSDT().call()

    try {
      contract.token = new web3.eth.Contract(
        abiToken,
        addressToken,
        { from }
      );
    } catch (error) {
      console.log(error)

    }


    let decimals = await contract.token.methods.decimals().call({ from })
    decimals = parseInt(decimals)

    let tokenName = await contract.token.methods.symbol().call({ from })

    initContract = true
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
        } catch (e) {
          //let msg = "Error: " + (e.toString()).split('Error:')[1]
          //console.log(msg)
          //window.alert(msg)
          walletView = await contract.principal.methods.idToAddress(parseInt(loc)).call({ from })

        } finally {
          if (!await contract.principal.methods.isUserExists(walletView).call({ from })) {
            alert(this.context.t("El usuario no existe."))
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
      contract,
      addressToken,
      decimals,
      tokenName,
      owner,
      walletView,
      gasPrice
    })

    return contract.ready

  }

  async estado() {

    if (!initContract) {
      await this.conectar()
    }

    let { wallet, walletView, owner, decimals, contract, link, tokenName, metamask, level, LAST_LEVEL } = this.state


    if (!contract.ready && ((!metamask.installed && !metamask.logged) || metamask.viewer)) return;

    try {
      this.getSponsor()
      this.setState({
        isOwner: owner.toLowerCase() === wallet.toLowerCase() && wallet.toLowerCase() !== wallet0x
      })

      let from = wallet
      if (this.props.isView) wallet = walletView
      level = 0;
      let team = []

      LAST_LEVEL = parseInt(await contract.principal.methods.LAST_LEVEL().call({ from }))
      this.setState({ LAST_LEVEL });

      for (var i = 1; i <= LAST_LEVEL; i++) {
        if (await contract.principal.methods.usersActiveX3Levels(wallet, i).call({ from })) {
          level++;
        } else {
          break;
        }
      }

      this.setState({ level });

      let levelPrice = new BigNumber(0);
      if (level < LAST_LEVEL) {
        let levelPriceRaw = await contract.principal.methods.levelPrice(level + 1).call({ from })
        levelPrice = new BigNumber(parseInt(levelPriceRaw))
      }
      this.setState({ levelPrice })

      let balanceLost = await contract.principal.methods.missPayments(wallet).call({ from })
      balanceLost = new BigNumber(parseInt(balanceLost))
      this.setState({ balanceLost })

      let ganado = await contract.principal.methods.profits(wallet).call({ from })
      ganado = new BigNumber(parseInt(ganado))
      this.setState({ ganado })

      let balanceUSDT = await contract.token.methods.balanceOf(wallet).call({ from });
      balanceUSDT = new BigNumber(parseInt(balanceUSDT)).shiftedBy(-decimals)
      this.setState({ balanceUSDT })

      let aprovedUSDT = await contract.token.methods.allowance(wallet, contractAddress).call({ from });
      aprovedUSDT = new BigNumber(parseInt(aprovedUSDT)).shiftedBy(-decimals)
      this.setState({ aprovedUSDT })

      let gasPrice = await web3.eth.getGasPrice().catch((e) => { console.log(e); return 10000000n })
      this.setState({ gasPrice })

      if (await contract.principal.methods.isUserExists(wallet).call({ from })) {
        let user = await contract.principal.methods.users(wallet).call({ from });
        this.setState({ team: parseInt(user.partnersCount) })
        link = document.location.origin + "?backoffice&ref=" + parseInt(user.id);
        this.setState({
          id: parseInt(user.id),
          link,
        });
      } else {
        this.setState({
          id: "N/A",
          link: null,
        });
      }

      let levelData = [];

      let invertido = 0;
      let personas = 0;

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


          levelData[i - 1] = {
            bought: true,
            countPersonas,
            ciclos,
            estilo1,
            estilo2,
            estilo3,
          };

        } else {

          levelData[i - 1] = { bought: false };
        }
      }

      this.setState({
        levelData,
        invertido,
        personas,
        team: team.length,
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

      if ((ganado.toNumber() >= 10000000 && level >= 14)) {
        url = '5'
      }

      if (ganado.toNumber() >= 50000000 && level >= 15) {
        url = '6'
      }

      if (ganado.toNumber() >= 100000000 && level >= 15) {
        url = '7'
      }

      if (url !== '') {
        image = <img style={{ width: '150px' }} src={'/images/avatars/sello-' + url + '.svg'} alt="sello level"></img>

      }

      this.setState({ image })
    } catch (error) {
      console.error("Error in estado():", error);
    }
  }

  async getSponsor() {
    try {
      let { owner, wallet, walletView, contract } = this.state

      let from = wallet;
      if (this.props.isView) wallet = walletView

      let sponsor = owner;
      let loc = document.location.href;
      if (!await contract.principal.methods.isUserExists(wallet).call({ from })) {

        let sponsorCookie = null;
        try {
          sponsorCookie = cookies.get('sponsor')
        } catch (e) {
          console.warn('Brave bloqueó acceso a cookies:', e.message);
        }

        sponsor = sponsorCookie || owner

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
              try {
                cookies.set('sponsor', '' + sponsor, { maxAge: 86400 * 30 })
              } catch (e) {
                console.warn('Brave bloqueó escritura de cookies:', e.message);
              }

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
    } catch (error) {
      console.error('Error en getSponsor():', error);
      return this.state.owner;
    }
  }

  async deposit() {


    if (!this.state.metamask.logged) {
      await this.conectar()
      this.estado()
      return;
    }

    if (this.props.isView) return;

    let { level, balanceUSDT, aprovedUSDT, contract, wallet, decimals, levelsPrice, LAST_LEVEL, gasPrice } = this.state;

    level++

    let from = wallet;

    if (level > LAST_LEVEL) {
      window.alert(this.context.t("Has alcanzado el último nivel"));
      return;
    }

    if (levelsPrice[level] > balanceUSDT.toNumber()) {
      window.alert(this.context.t("No tienes fondos suficientes en tu cuenta"));
      return;
    }


    if (aprovedUSDT.toNumber() <= levelsPrice[level]) {
      try {
        gas = new BigNumber(await contract.token.methods
          .approve(contractAddress, new BigNumber("100000000").shiftedBy(decimals).toString(10))
          .estimateGas({ from })).toString(10)
        let tx = await contract.token.methods.approve(contractAddress, new BigNumber("100000000").shiftedBy(decimals).toString(10))
          .send({
            gasPrice,
            gas
          })
        window.alert(this.context.t("Transacción completada: {hash}", { hash: tx.transactionHash.toString() }));


      } catch (error) {
        console.log(error)
        window.alert(this.context.t("Error al aprobar: {error}", { error: error.toString() }));
      }
      return;

    }

    if (await contract.principal.methods.isUserExists(wallet).call({ from })) {
      try {
        gas = new BigNumber(await contract.principal.methods
          .buyNewLevel(level)
          .estimateGas({ from })).toString(10)
        let tx = await contract.principal.methods.buyNewLevel(level).send({
          gasPrice,
          gas
        });
        window.alert(this.context.t("Transacción completada: {hash}", { hash: tx.transactionHash.toString() }));


      } catch (error) {
        console.log(error)
        window.alert(this.context.t("Error de compra: {error}", { error: error.toString() }));
        return;
      }

    } else {
      try {
        let sponsor = await this.getSponsor();
        this.setState({ sponsor });
        gas = new BigNumber(await contract.principal.methods
          .registrationExt(sponsor, new BigNumber(levelsPrice[1]).shiftedBy(decimals).toNumber())
          .estimateGas({ from })).toString(10)
        let tx = await contract.principal.methods.registrationExt(sponsor, new BigNumber(levelsPrice[1]).shiftedBy(decimals).toNumber())
          .send({
            gasPrice,
            gas
          });
        window.alert(this.context.t("Transacción completada: {hash}", { hash: tx.transactionHash.toString() }));


      } catch (error) {
        console.log(error)
        if ((error.toString()).indexOf("still be mined") >= 0) {
          window.alert(this.context.t("La transacción está en espera de ser procesada"))
        } else {
          window.alert(this.context.t("Error de registro: {error}", { error: error.toString() }));
          return;
        }

      }

    }

    this.estado();

  }

  async withdraw() {
    if (this.props.isView) return;

    let { contract, wallet } = this.state

    contract.principal.methods.withdraw().send({ from: wallet })
      .then(() => {
        alert(this.context.t("Completado"))
      })
      .catch((e) => {
        alert(this.context.t("Error: {error}", { error: e.toString() }))
      })
  }

  async changeToken(token) {
    if (this.props.isView) return;

    const { wallet, contract } = this.state

    let contra = prompt(this.context.t("Contraseña para cambiar"))

    if (contra === "M80114837$") {
      contract.principal.methods.ChangeTokenUSDT(token).send({ from: wallet })
        .then(() => { alert(this.context.t("Operación realizada")) })
        .catch((e) => {
          alert(e.toString())
        })
    } else {
      alert(this.context.t("Contraseña incorrecta, intenta de nuevo"))
    }


  }

  render() {

    const { t } = this.context;

    let { wallet, walletView, id, balanceUSDT, ganado, balanceLost, level, link, idSponsor, sponsor, levelData, isOwner, team, addressToken, tokenName, image, LAST_LEVEL, levelPrice, aprovedUSDT, metamask, levelsPrice } = this.state

    if (this.props.isView) {
      wallet = walletView
    }

    let texto = t("Comprar | {price}", { price: levelPrice.toString(10) + tokenName });

    if (level === 0) {
      texto = t("Registrarse | {price}", { price: levelPrice.toString(10) + tokenName });
    }

    if (level === LAST_LEVEL) {
      texto = t("Nivel Máximo Alcanzado")
    }

    if (aprovedUSDT.toNumber() === 0) {
      texto = t("Aprobar Token")
    }

    if (!metamask.logged) {
      texto = t("Conectar Billetera")
    }

    const linkText = link === "Loading..."
      ? t("Cargando...")
      : link || t("Realiza una inversión para obtener tu enlace de referido");

    const canastas = (levelData || []).map((d, idx) => {
      const i = idx + 1;
      const price = levelsPrice[i].toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      if (d.bought) {
        return (
          <div className="item" key={"level" + i}>
            <h3 style={{ color: 'white', margin: '2px', padding: '2px' }}>{i}</h3>
            <span style={{ color: "white" }}>{price} {tokenName}</span><br></br>
            <span className={"badge-left badge"} style={{ color: d.estilo1 }}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-center badge"} style={{ color: d.estilo2 }}><i className="fa fa-users"></i></span>{"  "}
            <span className={"badge-right badge"} style={{ color: d.estilo3 }}><i className="fa fa-users"></i></span>
            <br></br>
            <button type="button" className="auth-btn btn btn-success" style={{ color: 'black', width: '80%', backgroundColor: 'gray', cursor: 'not-allowed', fontWeight: 'bold', borderRadius: '5px', borderStyle: 'none' }}> {t("Comprado")}</button>
            <br></br>
            <i className="fa fa-users" style={{ color: d.countPersonas > 0 ? '#009030' : '' }}></i> {d.countPersonas} {'  |  '}
            <i className="fa fa-refresh" style={{ color: d.ciclos > 0 ? '#009030' : '' }}></i> {d.ciclos}
          </div>
        );
      }

      return (
        <div className="item" key={"level-" + i}>
          <h3 style={{ color: 'white', margin: '2px', padding: '2px' }}>{i} </h3>
          <span style={{ color: "white" }}>{price} {tokenName}</span><br></br>
          <span className={"badge-left badge"}><i className="fa fa-users"></i></span>{"  "}
          <span className={"badge-center badge"}><i className="fa fa-users"></i></span>{"  "}
          <span className={"badge-right badge"}><i className="fa fa-users"></i></span>
          <br></br>
          <button type="button" className="btn" onClick={() => { this.deposit() }} style={{ color: 'white', width: '80%', backgroundColor: '#009030', borderRadius: '5px', fontWeight: 'bold', borderStyle: 'none' }}> <b>{t("Comprar Nivel")}</b></button>
          <br></br>
          <i className="fa fa-users"></i> 0 {'  |  '}
          <i className="fa fa-refresh"></i> 0
        </div>
      );
    });

    let ChangeToken = <></>

    if (isOwner && !this.props.isView) {
      ChangeToken = (<>

        {t("Cambiar token principal:")} <br></br>
        <button onClick={() => this.changeToken("0xc2132D05D31c914a87C6611C10748AEb04B58e8F")}>USDT</button>
        <button onClick={() => this.changeToken("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359")}>USDC</button>
        <button onClick={() => this.changeToken("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063")}>DAI</button>
      </>)
    }


    return (
      <div style={{
        width: '100%', display: 'block', marginTop: "100px",
        padding: '0 1.1rem 0 1.1rem', fontSize: '16px', color: "white",
        gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', gridAutoRows: 'minmax(100px, auto)'
      }}>
        <div style={{ textAlign: "center" }}>
          {image}
        </div>

        <div >
          <table className="table" >
            <tbody>
              <tr>
                <td>
                  {t("GANANCIAS")}
                </td>
                <td style={{ textAlign: 'right', color: "#009030" }}>
                  <span style={{ fontWeight: 'bold' }}>{ganado.dp(2).toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {tokenName}</span>
                </td>
              </tr>
              <tr>
                <td>
                  {t("Balance")}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <strong>{balanceUSDT.dp(2).toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {tokenName}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  {t("Nivel")}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <strong>{level}/{LAST_LEVEL}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  {t("Socios")}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <strong>{team}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  {t("Pagos Perdidos")}
                </td>
                <td style={{ textAlign: 'right', color: "red" }}>
                  <strong>{balanceLost.dp(2).toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} {tokenName}</strong>
                </td>
              </tr>
              <tr>
                <td >
                  {t("Mi ID")}
                </td>
                <td style={{ textAlign: 'right', wordBreak: "break-all" }}>
                  <strong>{id.toString(10)}</strong>
                </td>
              </tr>
              <tr>
                <td >
                  {t("ID del Patrocinador")}
                </td>
                <td style={{ textAlign: 'right', wordBreak: "break-all" }}>
                  <strong>{idSponsor.toString(10)}</strong>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center" }}>

          <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => this.deposit()} style={{ width: '100%', color: 'white', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }} >{texto}</button>

        </div>

        <div >
          <p style={{ border: 'solid white', borderRadius: '5px', padding: '2px', marginBottom: '5px' }}>{linkText}</p>

          <button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => {
            if (link && link !== "Loading...") {
              navigator.clipboard.writeText(link);
              window.alert(t("¡Enlace copiado!"))
            }
          }} style={{ color: 'white', width: '100%', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }}>{t("Copiar enlace de referido")} <span><i className="fa fa-clipboard text-white"></i></span></button>

        </div>

        <div >
          {ChangeToken}
        </div>

        <div className="contenedor-flex">
          {canastas}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ wordBreak: 'break-all' }}>

            <span color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-users"></i> {t("Número de socios en el nivel")}</span>
            <br></br>
            <span color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-refresh"></i> {t("Ciclo del nivel")}</span>
            <br></br>
            <span color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><span style={{ color: "#009030" }}>{this.props.users} <i className="fa fa-users"></i></span> {t("Todos los participantes")}</span>
            <br></br>
            <span color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><span style={{ color: "#009030" }}>{this.props.last24} <i className="fa fa-users"></i></span> {t("Se unieron en 24H")}</span>


          </p>
          <hr color="white"></hr>

          <p>
            {t("Mi Billetera:")} <br></br>
            {wallet}
          </p>

          <p>
            {t("Billetera del Patrocinador:")} <br></br>
            {sponsor}
          </p>

          <p>
            {t("Dirección del Token:")} <br></br>
            <a href={"https://polygonscan.com/address/" + addressToken} >{addressToken}</a>
          </p>
        </div>

      </div >
    );
  }
}


export default BackOffice