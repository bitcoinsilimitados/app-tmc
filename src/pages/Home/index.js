import React, { Component } from "react";


export default class Home extends Component {

    
    render() {

        return (
            <div>
                <section id="home" className="s-home target-section" data-parallax="scroll" data-image-src="../../images/hero-bg.jpg" data-natural-width="3000" data-natural-height="2000" data-position-y="center">

                    <div className="overlay"></div>
                    <div className="shadow-overlay"></div>

                    <div className="home-content">

                        <div className="row home-content__main">

                            <h1>
                                #1 Decentralized USDT Blockchain Ecosystem
                            </h1>

                            <div className="home-content__buttons">
                                <a href="#view" className="smoothscroll btn btn--stroke">
                                    Account Preview
                                </a>
                                <a href="/?backoffice" className="smoothscroll btn btn--stroke">
                                    Back Office
                                </a>
                            </div>

                        </div>

                        <div className="home-content__line"></div>

                    </div>

                </section>

                <section id='about' className="s-about">


                    <div className="row about-stats stats block-1-4 block-m-1-2 block-mob-full" >

                        <div className="col-six stats__col ">
                            <div className="stats__count">{this.props.users}</div>
                            <h5>All participants</h5>
                        </div>
                        <div className="col-six stats__col ">
                            <div className="stats__count">{this.props.last24}</div>
                            <h5>Joined in 24H</h5>
                        </div>


                    </div>

                    <div className="about__line"></div>

                </section>

                <section id='services' className="s-services">

                    <div className="row section-header has-bottom-sep" >
                        <div className="col-full">
                            <h2 className="display-2" style={{ color: "white" }}>The Next Generation DeFi Ecosystem</h2>
                        </div>
                    </div>

                    <div className="row services-list block-1-2 block-tab-full">

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-paint-brush"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">Immutability</h3>
                                <p>
                                    Blockchain secures the algorithm, therefore nobody, even the creators or developers, can change, cancel, stop, or alter your transactions.
                                </p>
                            </div>
                        </div>

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-group"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">Automatic</h3>
                                <p>
                                    All transactions between the community members are executed directly from one personal wallet to another. TMC smart contract does not store your funds.

                                </p>
                            </div>
                        </div>

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-megaphone"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">Autonomus</h3>
                                <p>
                                    The ecosystem is built on the smart contract technology that is completely autonomous, which excludes any human factor. There are not hidden costs or service fees. The smart contract balance is always 0(zero).
                                </p>
                            </div>
                        </div>

                        <div className="col-block service-item" >
                            <div className="service-icon">
                                <i className="icon-earth"></i>
                            </div>
                            <div className="service-text">
                                <h3 className="h2">Transparent an decentralized</h3>
                                <p>
                                    The smart contract code is open, and anyone anytime can observe the entire transaction history. There are no managers or admins at the head.
                                </p>
                            </div>
                        </div>

                    </div>

                </section>

                <section id="clients" className="s-clients" >

                    <div className="row section-header" >
                        <div className="col-full">
                            <h2 className="display-2">FREQUENTLY ASKED QUESTIONS</h2>
                        </div>
                    </div>

                    <div className="row clients-testimonials" >
                        <div className="col-full">

                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>What is THE MONOPOLY CLUB?</summary>

                                    <div className="faq__content">
                                        <p>TMC is the first USDT marketing matrix in history with immediate transactions distribution from wallet to wallet, built on smart contract from Polygon’s blockchain, which makes it fully decentralized, transparent, secure and unstoppable.</p>
                                    </div>
                                </details>
                            </div>

                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>Do I Need to Withdraw my earnings from THE MONOPOLY CLUB?</summary>

                                    <div className="faq__content">
                                        <p>TMC does not retain any funds, Your earnings arrives instantly and directly into your personal wallet directly from your partners. Only you have access to your wallet and no one else can manage your earnings.</p>
                                    </div>
                                </details>
                            </div>
                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>Who Manages The Platform?</summary>

                                    <div className="faq__content">
                                        <p>TMC platform doesn’t have a manager. The smart contract works on the Polygon’s Blockchain. This means that the platform is fully decentralized(it has no leaders or admins).</p>

                                    </div>
                                </details>
                            </div>
                            <div className="testimonials__slide">
                                <details close="true" style={{ cursor: 'pointer' }}>
                                    <summary>Can I Join THE MONOPOLY CLUB in My Country?</summary>

                                    <div className="faq__content">
                                        <p>Absolutely, TMC is international and you can join from all the countries in the world, you just need a mobile device, tablet or laptop and internet connection.</p>

                                    </div>
                                </details>
                            </div>

                        </div>
                    </div>

                    <div id="view" className="row section-header" style={{ marginTop: '125px' }} >
                        <div className="col-full" style={{ textAlign: 'center' }}>
                            <h2 className="display-2">Account Preview</h2>
                            <p>Look up any TMC member account in preview mode.</p>
                            <form action="/?" method="GET">
                                <input type="hidden" name="viewoffice" value={true} />

                                <input style={{ display: 'block', marginRight: 'auto', marginLeft: 'auto', width: '80%', textAlign: 'center', backgroundColor: 'lightgray', border: 'none', borderRadius: '7px' }} type="text" name="wallet" placeholder={"ID or Wallet"}></input>

                                <button type="submit" style={{ width: '80%', color: 'white', backgroundColor: '#009030', borderRadius: '5px', borderStyle: 'none' }} >Preview</button>
                            </form>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}
