import React, { useState } from "react";
import { ethers, BigNumber } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import { seaport, createOrder721ToEther, createOrder721To20, fulfillOrder, cancelOrder } from "./api";

function App() {
  const [data, setdata] = useState({
    address: "",
    Balance: null
  });
  const [currentOrder, setorder] = useState(null);

  const btnhandler = async () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => getbalance(res[0]));
    } else {
      alert("install metamask extension!!");
    }
  };

  const getbalance = (address) => {
    window.ethereum
      .request({ 
        method: "eth_getBalance", 
        params: [address, "latest"] 
      })
      .then((balance) => {
        setdata({
          address: address,
          Balance: ethers.utils.formatEther(balance)
        });
      });
  };

  const orderhandler = async () => {
    console.log(seaport)
    if (seaport !== null || data.address !== "") {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 2678400;
      const offerItemAddr = "0x501811b85f45c010217b068e70d3b9626c687688";
      const offerItemId = "0";
      const considerationAmount = ethers.utils.parseEther("0.01").toString();
      // const recipient = "0xD50DB40179a469a2A507a54EC0d8402c46Bf2659";
      const recipient = data.address;
      const order = await createOrder721ToEther(
        endTime, 
        undefined,
        offerItemAddr, 
        offerItemId, 
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        considerationAmount,
        recipient
      );
      console.log(order)
      setorder(order);
    } 
    else {
      alert("install metamask extension!!");
    }
  };

  const fulfillhandler = async () => {
    if (seaport != null & currentOrder != null) {
      console.log('order', currentOrder);
      console.log('account address', data.address);
      const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
        order: currentOrder,
        accountAddress: data.address,
        // conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000"
      });

      const transaction = await executeAllFulfillActions();
      console.log(transaction);
      setorder(null);
    } else {
      alert("install metamask extension!!");
    }
  };

  const checkhandler = async () => {
    console.log(currentOrder)
  };

  const cancelhandler = async () => {
    if (seaport != null & currentOrder != null) {
      const orderCancel = await cancelOrder(currentOrder);
      console.log(orderCancel);
      setorder(null);
    } else {
      alert("install metamask extension!!");
    }
  };
  const bulkhandler = async () => {
    if (seaport != null) {
      const bulkCancel = await seaport.bulkCancelOrders(data.address).transact();
      console.log(bulkCancel);
      setorder(null);
    } else {
      alert("install metamask extension!!");
    }
  };
  
  return (
    <div className="App">
      {/* Calling all values which we 
       have stored in usestate */}
  
      <Card className="text-center">
        <Card.Header>
          <strong>Address: </strong>
          {data.address}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Balance: </strong>
            {data.Balance}
          </Card.Text>
          <Button onClick={btnhandler} variant="primary">
            Connect to wallet
          </Button>
          <Button onClick={orderhandler} variant="primary">
            Make order
          </Button>
          <Button onClick={fulfillhandler} variant="primary">
            fulfill order
          </Button>
          <Button onClick={checkhandler} variant="primary">
            check current order
          </Button>
          <Button onClick={cancelhandler} variant="primary">
            cancel current order
          </Button>
          <Button onClick={bulkhandler} variant="primary">
            bulk current order
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
  
export default App;
