import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

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

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 43%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
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

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px var(--secondary);
  background-color: var(--accent);
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
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
  const [feedback, setFeedback] = useState(`Huzzah! A new knight joined your party.`);
  const [mintAmount, setMintAmount] = useState(1);
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
    GAS_LIMIT: 0,
    GAS_PRICE: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: true,
  });

  const claimFreeNFTs = async () => {
    let cost = 0;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(0);
    let totalGasLimit = String(gasLimit);
    console.log("FM Cost: ", totalCostWei);
    console.log("FM Gas limit: ", totalGasLimit);
    setFeedback(`Minting your free ${CONFIG.NFT_NAME}...`);
    setClaimingFreeNft(true);

    let gasLimitEstimate = await blockchain.smartContract.methods.knighted(mintAmount).estimateGas({from: blockchain.account});
    console.log({
      gasLimitEstimate: gasLimitEstimate,
    });

    let gasPriceEstimate = await blockchain.web3.eth.getGasPrice();

    console.log({
      resultOfGasPriceEstimate: gasPriceEstimate,
    })

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
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
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

      <StyledScroll alt={"logo"} src={"./config/images/SiteScroll1.png"} />

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "./config/images/bg1.png" : null}
      >
        <StyledLogo alt={"logo"} src={"./config/images/LogoTransparent.png"} />
        <s.SpacerSmall />

        <ResponsiveWrapper src={"./config/images/SiteBoxTransparent.png"} flex={1} style={{ padding: 0 }} test>
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 0,
              borderRadius: 24,
              border: "4px var(--secondary)",
            }}
            image={"./config/images/SiteBox.png"}
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
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>

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
                </>
                )}
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
          <s.SpacerLarge />
          <s.SpacerMedium />
        </ResponsiveWrapper>
      </s.Container>
    </s.Screen>
  );
}

export default App;
