import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { Button, CircularProgress } from "@mui/material";

import Heading from "../../components/Heading";
import Balance from "../../components/Balance";
import ContractOwnerButton from "../../components/ContractOwnerButton";
import Timer from "../../components/Timer";
import { customContract, signedContract } from "../../contract/contractUtils";
import { useCountdown } from "../../hooks/useCountDown";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Birthday() {
  const params = useParams();
  const { innerWidth: width, innerHeight: height } = window;
  const [walletAddress, setWalletAddress] = useState(null);
  const [depositButtonDisabled, setDepositButtonDisabled] = useState(true);
  const [depositLoading, setDepositLoading] = useState(false);
  const [closeContractLoading, setCloseContractLoading] = useState(false);
  const [changeOwnershipLoading, setChangeOwnershipLoading] = useState(false);
  const [contractOwner, setContractOwner] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    name: "",
    image: "",
    birthdayDate: "",
    participationAmount: "",
    targetGiftAmount: "",
    contractBalance: "",
    participantList: [],
  });

  const getBirthdayData = () => {
    try {
      customContract(params.address)
        .getBirthdayData()
        .then((response) => {
          setBirthdayData({
            name: response[0],
            image: response[1],
            birthdayDate: response[2].toNumber(),
            participationAmount: ethers.utils.formatEther(
              response[3].toHexString()
            ),
            targetGiftAmount: ethers.utils.formatEther(
              response[4].toHexString()
            ),
            contractBalance: ethers.utils.formatEther(
              response[5].toHexString()
            ),
            participantList: response[6],
          });
          const address = ethers.utils.getAddress(walletAddress);
          if (walletAddress && response[6]?.includes(address)) {
            setDepositButtonDisabled(true);
          } else {
            setDepositButtonDisabled(false);
          }
        });
    } catch (e) {
      toast.error("Get birthday data is failed!");
    }
  };

  useEffect(() => {
    getBirthdayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, params]);

  const connectMetamask = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        setWalletAddress(res[0]);
        const address = ethers.utils.getAddress(res[0]);
        if (birthdayData?.participantList.includes(address)) {
          setDepositButtonDisabled(true);
        } else {
          setDepositButtonDisabled(false);
        }
        customContract(params.address)
          .owner()
          .then((response) => {
            if (response === address) {
              setContractOwner(true);
            } else {
              setContractOwner(false);
            }
          });
      });
    } else {
      toast.error("install metamask extension!!");
    }
  };

  const sendGift = async () => {
    setDepositLoading(true);
    const options = {
      value: parseEther(birthdayData.participationAmount),
      gasLimit: 7500000,
    };

    try {
      const transaction = await signedContract(
        params.address
      ).participateBirthday(options);
      transaction
        .wait()
        .then((receipt) => {
          if (receipt.status === 1) {
            getBirthdayData();
            toast.success("Gift money is successfully send :)");
          }
          setDepositLoading(false);
        })
        .catch((e) => {
          setDepositLoading(false);
          toast.error("Transaction is failed!");
        });
    } catch (e) {
      toast.error(e.message);
      setDepositLoading(false);
    }
  };

  const closeContract = async (transferAddress) => {
    setCloseContractLoading(true);
    const options = {
      gasLimit: 7500000,
    };

    try {
      const transaction = await signedContract(params.address).close(
        transferAddress,
        options
      );
      transaction
        .wait()
        .then((receipt) => {
          console.log("receipt: ", receipt);
          if (receipt.status === 1) {
            toast.success("Transfer is successfully completed!");
          }
          setCloseContractLoading(false);
        })
        .catch((e) => {
          console.log("err: ", e);
          toast.error("Transaction failed!");
          setCloseContractLoading(false);
        });
    } catch (e) {
      console.log("e: ", e.message);
      setCloseContractLoading(false);
      toast.error(e.message);
    }
  };

  const changeOwnership = async (transferAddress) => {
    setChangeOwnershipLoading(true);
    const options = {
      gasLimit: 7500000,
    };

    try {
      const transaction = await signedContract(
        params.address
      ).transferOwnership(transferAddress, options);
      transaction
        .wait()
        .then((receipt) => {
          console.log("receipt: ", receipt);
          if (receipt.status === 1) {
            toast.success("Transfer is successfully completed!");
          }
          setChangeOwnershipLoading(false);
        })
        .catch(() => {
          toast.error("Transaction failed!");
          setChangeOwnershipLoading(false);
        });
    } catch (e) {
      console.log("e: ", e.message);
      setChangeOwnershipLoading(false);
      toast.error(e.message);
    }
  };

  const [days, hours, minutes, seconds] = useCountdown(
    birthdayData.birthdayDate
  );

  return (
    <div className='main-container'>
      <Toaster position='top-right' />
      <Confetti width={width} height={height} />
      <div className='inner-container'>
        <p className='heading-text'>Birthday Money Collector</p>
        <Heading image={birthdayData.image} />
        <p className='text'>{birthdayData.name}</p>
        <Balance
          contractBalance={birthdayData.contractBalance}
          participationAmount={birthdayData.participationAmount}
          numberOfParticipant={birthdayData.participantList.length}
          targetGiftAmount={birthdayData.targetGiftAmount}
        />
        <Button
          fullWidth
          className='Button'
          variant='contained'
          onClick={sendGift}
          sx={{ marginBottom: "8px" }}
          disabled={
            depositButtonDisabled ||
            days + hours + minutes + seconds <= 0 ||
            depositLoading
          }
        >
          {depositLoading ? <CircularProgress /> : `Send Money`}
        </Button>

        <Button
          fullWidth
          className='Button'
          variant='contained'
          onClick={connectMetamask}
          disabled={walletAddress}
          sx={{ marginBottom: "8px" }}
        >
          {walletAddress
            ? `Connected with ${walletAddress}`
            : `Connect to MetaMask!`}
        </Button>
        <Timer birthdate={birthdayData.birthdayDate} />
        {contractOwner && (
          <ContractOwnerButton
            buttonTitle='Close Contract'
            onClick={closeContract}
            isLoading={closeContractLoading}
          />
        )}
        {contractOwner && (
          <ContractOwnerButton
            buttonTitle='Change Ownership'
            onClick={changeOwnership}
            isLoading={changeOwnershipLoading}
          />
        )}
      </div>
    </div>
  );
}

export default Birthday;
