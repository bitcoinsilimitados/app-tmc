import React, { Component } from "react";
import { LangContext } from "../../i18n";

export default class Home extends Component {
    static contextType = LangContext;

    render() {
        const { t } = this.context;
        const { users, last24 } = this.props;
        const usersValue = Number.isFinite(Number(users)) ? Number(users) : 0;
        const last24Value = Number.isFinite(Number(last24)) ? Number(last24) : 0;

        return (
            <>
                <section id="home" className="s-home target-section" data-parallax="scroll" data-image-src="/images/hero-bg.jpg" data-natural-width="3000" data-natural-height="2000" data-position-y="center">

                    <div className="overlay"></div>
                    <div className="shadow-overlay"></div>

                    <div className="home-content">

                        <div className="row home-content__main">

                            <h1>
                                {t("El Ecosistema Blockchain Descentralizado de USDT #1")}
                            </h1>

                            <div className="home-content__buttons">
                                <a href="#view" className="smoothscroll btn btn--stroke">
                                    {t("Visualizar Cuenta")}
                                </a>
                                <a href="/?backoffice" className="smoothscroll btn btn--stroke">
                                    {t("Back Office")}
                                </a>
                            </div>

                        </div>

                        <div className="home-content__line"></div>

                    </div>

                </section>

                <section id='about' className="s-about">

                    <div className="row about-stats stats block-1-4 block-m-1-2 block-mob-full" >

                        <div className="col-six stats__col ">
                            <div className="stats__count">{usersValue}</div>
                            <h5>{t("Todos los participantes")}</h5>
                        </div>
                        <div className="col-six stats__col ">
                            <div className="stats__count">{last24Value}</div>
                            <h5>{t("Se unieron en 24H")}</h5>
                        </div>

                    </div>

                    <div className="about__line"></div>

                </section>

                <section id='services' className="s-services">

                    <div className="row section-header has-bottom-sep" >
                        <div className="col-full">
                            <h2 className="display-2" style={{ color: "white" }}>{t("El Ecosistema DeFi de Nueva Generación")}</h2>
                        </div>
                    </div>

                    <div className="row services-list block-1-2 block-tab-full">

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-paint-brush"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">{t("Inmutabilidad")}</h3>
                                <p>
                                    {t("La blockchain asegura el algoritmo, por lo tanto nadie, ni siquiera los creadores o desarrolladores, puede cambiar, cancelar, detener o alterar tus transacciones.")}
                                </p>
                            </div>
                        </div>

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-group"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">{t("Automático")}</h3>
                                <p>
                                    {t("Todas las transacciones entre los miembros de la comunidad se ejecutan directamente de una billetera personal a otra. El contrato inteligente de TMC no almacena tus fondos.")}
                                </p>
                            </div>
                        </div>

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-megaphone"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">{t("Autónomo")}</h3>
                                <p>
                                    {t("El ecosistema está construido sobre la tecnología de contratos inteligentes que es completamente autónoma, lo que excluye cualquier factor humano. No hay costos ocultos ni tarifas de servicio. El balance del contrato inteligente es siempre 0 (cero).")}
                                </p>
                            </div>
                        </div>

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-earth"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">{t("Transparente y descentralizado")}</h3>
                                <p>
                                    {t("El código del contrato inteligente es abierto, y cualquier persona puede observar en cualquier momento todo el historial de transacciones. No hay gerentes ni administradores al mando.")}
                                </p>
                            </div>
                        </div>

                    </div>

                </section>

                <section id="clients" className="s-clients" >

                    <div className="row section-header" >
                        <div className="col-full">
                            <h2 className="display-2">{t("PREGUNTAS FRECUENTES")}</h2>
                        </div>
                    </div>

                    <div className="row clients-testimonials" >
                        <div className="col-full">

                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>{t("¿Qué es THE MONOPOLY CLUB?")}</summary>

                                    <div className="faq__content">
                                        <p>{t("TMC es la primera matriz de marketing de USDT en la historia con distribución inmediata de transacciones de billetera a billetera, construida sobre un contrato inteligente en la blockchain de Polygon, lo que la hace totalmente descentralizada, transparente, segura e imparable.")}</p>
                                    </div>
                                </details>
                            </div>

                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>{t("¿Necesito retirar mis ganancias de THE MONOPOLY CLUB?")}</summary>

                                    <div className="faq__content">
                                        <p>{t("TMC no retiene ningún fondo. Tus ganancias llegan de forma instantánea y directa a tu billetera personal desde tus socios. Solo tú tienes acceso a tu billetera y nadie más puede administrar tus ganancias.")}</p>
                                    </div>
                                </details>
                            </div>
                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>{t("¿Quién administra la plataforma?")}</summary>

                                    <div className="faq__content">
                                        <p>{t("La plataforma TMC no tiene administrador. El contrato inteligente funciona en la blockchain de Polygon. Esto significa que la plataforma es totalmente descentralizada; no tiene líderes ni administradores.")}</p>

                                    </div>
                                </details>
                            </div>
                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>{t("¿Puedo unirme a THE MONOPOLY CLUB desde mi país?")}</summary>

                                    <div className="faq__content">
                                        <p>{t("Absolutamente, TMC es internacional y puedes unirte desde cualquier país del mundo. Solo necesitas un dispositivo móvil, tableta o computadora portátil y una conexión a internet.")}</p>

                                    </div>
                                </details>
                            </div>

                        </div>
                    </div>

                    <div id="view" className="row section-header" style={{ marginTop: '125px' }} >
                        <div className="col-full" style={{ textAlign: 'center' }}>
                            <h2 className="display-2">{t("Visualizar Cuenta")}</h2>
                            <p>{t("Consulta la cuenta de cualquier miembro de TMC en modo vista previa.")}</p>
                            <form onSubmit={(e) => { e.preventDefault(); const wallet = e.target.wallet.value; window.location.href = '/?viewoffice&wallet=' + encodeURIComponent(wallet); }}>
                                <input type="hidden" name="viewoffice" value="true" />

                                <input style={{ display: 'block', marginRight: 'auto', marginLeft: 'auto', width: '80%', textAlign: 'center', backgroundColor: 'lightgray', border: 'none', borderRadius: '7px' }} type="text" name="wallet" placeholder={t("ID o Billetera")}></input>

                                <button type="submit" style={{ width: '80%', color: 'white', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }} >{t("Visualizar la Cuenta")}</button>
                            </form>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
