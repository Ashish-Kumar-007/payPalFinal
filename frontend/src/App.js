import { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import logo from "./logo.png";
import { Layout, Button } from "antd";
import CurrentBalance from "./componets/CurrentBalance";
import RequestAndPay from "./componets/RequestAndPay";
import AccountDetails from "./componets/AccountDetails";
import RecentActivity from "./componets/RecentActivity";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import axios from "axios";
import AboutUs from "./componets/AboutUs";
import Help from "./componets/Help";

const { Header, Content } = Layout;

function Home({
  name,
  address,
  balance,
  dollars,
  history,
  requests,
  disconnectAndSetNull,
  getNameAndBalance,
}) {
  return (
    <>
      <div className="firstColumn">
        <CurrentBalance dollars={dollars} />
        <RequestAndPay
          requests={requests}
          getNameAndBalance={getNameAndBalance}
        />
        <AccountDetails address={address} name={name} balance={balance} />
      </div>
      <div className="secondColumn">
        <RecentActivity history={history} />
      </div>
    </>
  );
}

function App() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({ 1: [0], 0: [] });

  function disconnectAndSetNull() {
    disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({ 1: [0], 0: [] });
  }

  async function getNameAndBalance() {
    // const res = await axios.get(`https://paypal-backend-tan.vercel.app/getNameAndBalance`, {
    const res = await axios.get(`http://localhost:3001/getNameAndBalance`, {
      params: { userAddress: address },
    });

    const response = res.data;
    console.log(response.requests);
    if (response.name[1]) {
      setName(response.name[0]);
    }
    setBalance(String(response.balance));
    setDollars(String(response.dollars));
    setHistory(response.history);
    setRequests(response.requests);
  }

  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
  }, [isConnected]);

  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Header className="header">
            <div className="headerLeft">
              <div style={{color: "#31579e", fontWeight: "bold", fontSize:"30px",}}>BLOCKPAY</div>
              {isConnected && (
                <>
                  <nav>
                    <Link to="/" className="p-3">
                      Summary
                    </Link>

                    <Link to="/about-us">About us</Link>

                    <Link to="/help">Help</Link>
                  </nav>
                </>
              )}
            </div>
            {isConnected ? (
              <Button type={"primary"} onClick={disconnectAndSetNull}>
                Disconnect Wallet
              </Button>
            ) : (
              <Button
                type={"primary"}
                onClick={() => {
                  console.log(requests);
                  connect();
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Header>
          <Content className="content">
            {isConnected ? (
              <Routes>
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/help" element={<Help />} />
                <Route path="/" element={<Home />} />
              </Routes>
            ) : (
              <div>Please Login</div>
            )}
          </Content>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
