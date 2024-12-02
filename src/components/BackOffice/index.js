import React, { Component } from "react";

import Utils from "../../utils";
import cons from "../../cons.js";

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

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
    this.estado();
    setInterval(() => this.estado(), 1 * 1000);
  };

  async estado() {

    var accountAddress = window.tronWeb.defaultAddress.base58

    //console.log(accountAddress);

    var activeLevels = 0;

    for (var i = 15; i >= 0; i--) {

      if (await Utils.contract.usersActiveX3Levels(accountAddress, i).call()) {
        activeLevels++;
      }

    }

    var levelPrice = await Utils.contract.levelPrice(activeLevels + 1).call();

    var tokenAddress = await Utils.contract.tokenUSDT().call();

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

    var owner = await Utils.contract.owner().call();

    var direccionSP = window.tronWeb.address.fromHex(owner);

    var aproved = aprovedUSDT;

    if (aproved <= 0) {
      await contractUSDT.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send();
      return;
    }

    var LAST_LEVEL = await Utils.contract.LAST_LEVEL().call();

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

          var inversor = await Utils.contract.idToAddress(tmp[0]).call();

          if (await Utils.contract.isUserExists(inversor).call()) {

            direccionSP = window.tronWeb.address.fromHex(inversor);

          }
        }
      }

      this.setState({
        sponsor: direccionSP
      });


      if (await Utils.contract.isUserExists(accountAddress).call()) {


        await Utils.contract.buyNewLevel(level + 1, amount * 10 ** 6).send();


      } else {

        await Utils.contract.registrationExt(direccionSP, amount * 10 ** 6).send();

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
        <div className="row">
          <img src="/images/TMC-blanco-verde.svg" width="100%" alt="TMC"></img>
          <table className="table">
            <tbody>
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
                  <p style={{ fontSize: '16px' }}><button onClick={() => this.deposit()} type="submit" className="auth-btn btn btn-success btn-sm" style={{ color: 'white', width: '100%' }}>{this.state.texto}</button></p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style={{ fontSize: '16px' }}>Price {this.state.levelPrice} USDT</p>
                  <p style={{ fontSize: '16px' }}>You must have ~ 50 TRX to make the transaction</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

class GeneralInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: "N/A",
      link: "Haz una inversión para obtener el LINK de referido"
    }

    this.Link = this.Link.bind(this);
  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
    setInterval(() => this.Link(), 1 * 1000);
  }

  async Link() {
    let mydireccion = await window.tronWeb.trx.getAccount();

    mydireccion = window.tronWeb.address.fromHex(mydireccion.address);

    var user = await Utils.contract.users(mydireccion).call();

    if (await Utils.contract.isUserExists(mydireccion).call()) {
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

    return (
      <nav className="Sidebar_root__3k9LL">
        <main className="Sidebar_content__1DsCZ">
          <CrowdFunding />
          <div className="row">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <p style={{ fontSize: '16px' }}>My id</p>
                    <p style={{ fontSize: '16px' }}>Wallet</p>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{this.state.id}</p>
                    <p style={{ textAlign: 'right', fontSize: '16px', wordBreak: 'break-all' }}>{window.tronWeb.defaultAddress.base58} <i className="fa fa-clipboard text-white"></i></p>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row"></div>
          <div className="row"></div>
          <div className="row">
            <section className="widget Widget_widget__32uL4">
              <header className="Widget_title__1U9X_"><div className="mt-0" style={{ padding: '10px' }}>My affiliate link</div></header>
              <div aria-hidden="false" className="rah-static rah-static--height-auto" style={{ height: 'auto', overflow: 'visible' }}>
                <div>
                  <div className="Widget_widgetBody__34soD widget-body">
                    <form>
                      <div className="mt form-group">
                        <div className="input-group input-group">
                          <input id="link" required="" name="link" placeholder="Link" value={this.state.link} type="text" className="input-transparent pl-3 form-control" disabled />
                          <div className="bg-transparent input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-clipboard text-white"></i></span>
                          </div>
                        </div>
                      </div>
                      <div className="mt form-group"><button type="button" className="auth-btn btn btn-success btn-sm" onClick={() => { navigator.clipboard.writeText(this.state.link); window.alert("link copied!") }} style={{ color: 'white', width: '90%' }}>Copy referal link</button></div>

                    </form>
                  </div>
                </div>
              </div>
            </section>
            <div className="Widget_widgetBackground__1F6dp" style={{ display: 'none' }}></div>
          </div>
        </main>
      </nav>
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

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, contractAddress);
    setInterval(() => this.Link(), 3 * 1000);
    setInterval(() => this.Investors(), 7 * 1000);
  }

  async Link() {
    let mydireccion = await window.tronWeb.trx.getAccount();
    console.log(mydireccion);
    mydireccion = window.tronWeb.address.fromHex(mydireccion.address);

    var user = await Utils.contract.users(mydireccion).call();

    if (await Utils.contract.isUserExists(mydireccion).call()) {
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
      if (await Utils.contract.usersActiveX3Levels(direccion, i).call()) {
        invertido += levelPrice[i];

        var matrix = await Utils.contract.usersX3Matrix(direccion, i).call();
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
    var cosa = await Utils.contract.withdraw().send();
    console.log(cosa);
  }

  render() {
    return (<main className="Layout_content__3Ygen">
      <section className="widget Widget_widget__32uL4">
        <header className="Widget_title__1U9X_" style={{ marginLeft: '30px', padding: '10px' }}>
          <header className="dashboard-header">

            <div className="row">
              <div className="col-lg-4" >
                <div className="choose__item">
                  <h2>Earned:</h2>
                  <p>
                    {this.state.ganado} USDT
                  </p>
                </div>
              </div>
              <div className="col-lg-4" >
                <div className="choose__item">
                  <h2>My invested:</h2>
                  <p>
                    {this.state.invertido} USDT
                  </p>
                </div>
              </div>
              <div className="col-lg-4" >
                <div className="choose__item">
                  <h2>People:</h2>
                  <p>
                    {this.state.personas | 0}
                  </p>
                </div>
              </div>
            </div>
          </header>
        </header>
        <div aria-hidden="false" className="rah-static rah-static--height-auto" style={{ height: 'auto', overflow: 'visible' }}>
          <div className="Widget_widgetBody__34soD widget-body">
            <div className="row">
              {this.state.canastas}
            </div>
            <footer className="text-sm card-footer" style={{ height: '50px', maxHeight: '50px' }}>
              <div className="mt row">
                <div className="col-12 col-md-3">
                  <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-refresh"></i> Recycle count</div>
                </div>
                <div className="col-12 col-md-3">
                  <div color="transparent" className="btn-xs float-left py-0" id="load-notifications-btn" style={{ height: '45px', maxHeight: '45px' }}><i className="fa fa-users"></i> Number partners in the slot</div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>
      <div className="Widget_widgetBackground__1F6dp" style={{ display: 'none' }}></div>
    </main>
    );
  }
}

export default class BackOffice extends Component {
  render() {

    return (
      <div className="row">
        <div className="col-3">
          <GeneralInfo />
        </div>
        <div className="col-9">
          <Oficina />
        </div>




      </div>


    );
  }
}
