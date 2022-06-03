import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import FadeIn from "react-fade-in";

const disconnectCoinbase = () => {
  walletlinkProvider.close();
  setWalletlinkProvider(null);
};

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledButtonConnect = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  background-image: url(config/images/SiteBoxCnTPeas2.png);
  background-repeat: no-repeat;
  background-size: 100%;
  height: 100px;
  width: 200px;
  background-color: transparent;
`;

export const StyledButtonBusy = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  background-image: url(config/images/SiteBoxCnTConscrip.png);
  background-repeat: no-repeat;
  background-size: 100%;
  height: 100px;
  width: 200px;
  background-color: transparent;
`;

export const StyledButtonMint = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  background-image: url(config/images/SitemMintFree.png);
  background-repeat: no-repeat;
  background-size: 100%;
  height: 100px;
  width: 200px;
  background-color: transparent;
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapperTwo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 33%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const ResponsiveWrapper = styled.div`
  position: absolute;
  z-index: 200;
  left: 38%;
  top: 32%;
  width: 24%;
  }
`;

export const StyledLogo = styled.img`
  position: absolute;
  z-index: 100;
  width: 15%;
  left: 42.5%;
  top: 3%;
`;

export const StyledTwitter = styled.img`
  position: absolute;
  z-index: 200;
  left: 3%;
  top: 3%;
  background: transparent;
  width: 5%;
`;

export const StyledOpensea = styled.img`
  position: absolute;
  z-index: 200;
  left: 9%;
  top: 3%;
  background: transparent;
  width: 5%;
`;

export const StyledScroll = styled.img`
  position: absolute;
  z-index: 200;
  right: 3%;
  top: 10%;
  background: transparent;
  width: 35%;
`;

export const StyledMintButton = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
  font-size: 32px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingFreeNft, setClaimingFreeNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [partySize, setPartySize] = useState(0);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "Polygon",
      SYMBOL: "MATIC",
      ID: 137,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 6942,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: true,
  });

  const getPartySize = async () => {

    let pS = await blockchain.smartContract.methods.party(blockchain.account).call();
    setPartySize(pS);
  }

  const claimFreeNFTs = async () => {
    let totalCostWei = String(0);
    console.log("FM Cost: ", totalCostWei);
    setFeedback(`Minting your free ${CONFIG.NFT_NAME}...`);
    setClaimingFreeNft(true);

    await getPartySize();
    
    let gasLimitEstimate = await blockchain.smartContract.methods.knighted(mintAmount).estimateGas({from: blockchain.account});
    console.log({
      gasLimitEstimate: gasLimitEstimate,
    });

    let gasPriceEstimate = await blockchain.web3.eth.getGasPrice();

    console.log({
      resultOfGasPriceEstimate: gasPriceEstimate,
    });

    blockchain.smartContract.methods
      .knighted(mintAmount)
      .send({
        gasLimit: String(Math.round(1.2 * gasLimitEstimate)),
        gasPrice: String(Math.round(1.1 * gasPriceEstimate)),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Elves are goblins scorched us :*(");
        setClaimingFreeNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Huzzah! A new knight joined your party.`
        );
        setClaimingFreeNft(false);
        dispatch(fetchData(blockchain.account));
        setPartySize(partySize + mintAmount);
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = async () => {
    if (partySize == 0 && mintAmount == 1) {
      await getPartySize();
    }
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    if (newMintAmount + partySize > 1) {
      newMintAmount = 1 - partySize;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("./config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>

      <a href="https://twitter.com/knightswtf">
        <StyledTwitter alt={"twitter link"} src={"./config/images/twitter_social_cons_circle_white.png"} />
      </a>

      <a href="https://opensea.io/collection/knightscastlewtf">
        <StyledOpensea alt={"opensea link"} src={"./config/images/Opensea-Logomark-Transparent-White.png"} />
      </a>

      <FadeIn delay={"1000"}>
        <StyledScroll alt={"logo"} src={"./config/images/SiteScroll1.png"} href={"https://twitter.com/knightswtf"} />
      </FadeIn>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "./config/images/bgRoyMC.png" : null}
      >
        <FadeIn delay={"1000"}>
          <StyledLogo alt={"logo"} src={"./config/images/LogoTransparent.png"} />
        </FadeIn>
        <s.SpacerSmall />
        
            {/* <ResponsiveWrapper flex={1} style={{ padding: 0, margin: 0,  }} test>
              
              <FadeIn delay={"1000"}>
                <s.Container
                  flex={2}
                  jc={"center"}
                  ai={"center"}
                  style={{
                    borderRadius: 24,
                    width: "95%",
                    paddingTop: 32,
                    paddingBottom: 32,
                    paddingLeft: "3%",
                    paddingRight: "3%",
                    marginRight: "3%",
                    marginLeft: "3%",
                  }}
                  image={"./config/images/SiteBoxTransparent.png"}
                >
                  <s.SpacerSmall />
                  <s.TextTitle
                    style={{
                      textAlign: "center",
                      fontSize: 42,
                      fontWeight: "bold",
                      color: "var(--primary-text)",
                    }}
                  >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                  </s.TextTitle>
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <s.TextTitle
                        style={{ textAlign: "center", color: "var(--primary-text)", fontSize: 20, paddingLeft: 50, paddingRight: 50, }}
                      >
                        Huzzah! That's enough conscripts to fight the foul beasts.
                      </s.TextTitle>
                      <s.TextDescription
                        style={{ textAlign: "center", color: "var(--primary-text)", fontSize: 20, paddingLeft: 50, paddingRight: 50, }}
                      >
                        To hire a knight, gaze into yonder
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                        {CONFIG.MARKETPLACE}
                      </StyledLink>
                    </>
                  ) : (

                    <>
                      <s.Container ai={"center"} jc={"center"} >

                        {blockchain.account === "" ||
                          blockchain.smartContract === null ? (
                            <s.Container ai={"center"} jc={"center"}>
                        
                              <StyledButtonConnect src={"./config/images/SiteCntMetaM.png"}
                                onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                                setFeedback(``);
                                }}
                              >
                              </StyledButtonConnect>

                              {blockchain.errorMsg !== "" ? (
                              <>
                                <s.SpacerSmall />
                                <s.TextDescription
                                  style={{
                                    textAlign: "center",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                {blockchain.errorMsg}
                                </s.TextDescription>
                              </>
                              ) : null}
                            </s.Container>
                          ) : (
                          <>

                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                              <StyledRoundButton
                                style={{ lineHeight: 0.4 }}
                                disabled={claimingFreeNft ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  decrementMintAmount();
                                }}
                              >
                              -
                              </StyledRoundButton>
                              <s.SpacerMedium />
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "var(--accent-text)",
                                }}
                              >
                              {mintAmount}
                              </s.TextDescription>
                              <s.SpacerMedium />
                              <StyledRoundButton
                                disabled={claimingFreeNft ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  incrementMintAmount();
                                }}
                              >
                              +
                              </StyledRoundButton>
                            </s.Container>

                            <s.SpacerSmall />
                                <s.TextDescription
                                  style={{
                                    textAlign: "center",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                </s.TextDescription>
                            {partySize < 1 ? (
                                <s.Container ai={"center"} jc={"center"} >
                                {claimingFreeNft === false ? (
                                    <>
                                      <StyledButtonMint
                                        disabled={claimingFreeNft ? 1 : 0}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          claimFreeNFTs();
                                          getData();
                                        }}
                                      >
                                      </StyledButtonMint>
                                    </>
                                  ) : (
                                    <>
                                      <StyledButtonBusy
                                        disabled={1}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          claimFreeNFTs();
                                          getData();
                                        }}
                                      >
                                  
                                      </StyledButtonBusy>
                                    </>
                                  )
                                }
                              </s.Container>
                            ) : (
                              <s.TextDescription
                                  style={{
                                    textAlign: "center",
                                    color: "var(--primary-text)",
                                  }}
                                >
                                  Fellowship achieved. To collect more, visit opensea.
                                </s.TextDescription>
                            )}
                          </>
                          )
                        }
                      </s.Container>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--primary-text)",
                          fontSize: 28,
                          paddingLeft: 50,
                          paddingRight: 50,
                        }}
                      >
                      {feedback}
                      </s.TextDescription>
                      <s.SpacerLarge />
                      
                      
                    </>
                  )}

                </s.Container>
              </FadeIn>
              
            </ResponsiveWrapper> */}
          
      </s.Container>
    </s.Screen>
  );
}

export default App;
