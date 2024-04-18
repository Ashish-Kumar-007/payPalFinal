import { Layout, Button, Typography } from "antd";
import { useState } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

function Help() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div style={{ minHeight: "100vh",  display: "flex", justifyContent: "center"}}>
      <Content className="max-w-xl mx-auto p-8">
        <Title level={2} className="mb-4">Help Section</Title>
        {step === 1 && (
          <div className="mb-8">
            <Title level={3} className="font-semibold">1. Create Wallet using MetaMask</Title>
            <Text>
              Follow the instructions in the{" "}
              <a
                href="https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask"
                className="text-blue-500"
                target="_blank"
                rel="noreferrer"
              >
                MetaMask guide
              </a>{" "}
              to create a wallet.
            </Text>
            <br />
            <Button type="primary" onClick={nextStep} className="mt-4">
              Next
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="mb-8">
            <Title level={3} className="font-semibold">2. Connect Wallet</Title>
            <Text>After creating the wallet, click on the "Connect Wallet" button on the website.</Text>
            {/* <img src="/images/connect-wallet.png" alt="Connect Wallet" className="mt-4 rounded-lg" /> */}
            <br /><Button type="primary" onClick={nextStep} className="mt-4">
              Next
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="mb-8">
            <Title level={3} className="font-semibold">3. Pay for Payments</Title>
            <Text>After the wallet is connected, click on the "Pay" button for payments.</Text>
            {/* <img src="/images/pay.png" alt="Pay for Payments" className="mt-4 rounded-lg" /> */}
            <br /><Button type="primary" onClick={nextStep} className="mt-4">
              Next
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="mb-8">
            <Title level={3} className="font-semibold">4. Request Payments</Title>
            <Text>After the wallet is connected, click on the "Request" button to request payments.</Text>
            {/* <img src="/images/request.png" alt="Request Payments" className="mt-4 rounded-lg" /> */}
            <br /><Button type="primary" onClick={nextStep} className="mt-4">
              Next
            </Button>
          </div>
        )}
        {step === 5 && (
          <div className="mb-8">
            <Title level={3} className="font-semibold">5. Recent Activity</Title>
            <Text>In the activity section, you can see the recent transactions you have made.</Text>
            <br /><Button type="primary" onClick={() => setStep(1)} className="mt-4">
              Restart Tutorial
            </Button>
          </div>
        )}
      </Content>
    </div>
  );
}

export default Help;
