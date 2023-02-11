import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ethers, ContractFactory } from "ethers";
import { Button, TextField, CircularProgress, Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { contractAbi } from "../../contract/contractAbi";
import { byteCode } from "../../contract/byteCode";
import { signer } from "../../contract/contractUtils";

function CreateContract() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [formValues, setFormValues] = React.useState({
    name: "",
    image: "",
    birthdate: new Date(),
    participationAmount: ethers.utils.parseEther("0.01"),
    targetGiftAmount: ethers.utils.parseEther("0.1"),
  });
  const [contractAddress, setContractAddress] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    const factory = new ContractFactory(contractAbi, byteCode, signer);
    try {
      const contract = await factory.deploy(
        formValues.name,
        formValues.image,
        formValues.birthdate.getTime(),
        formValues.participationAmount,
        formValues.targetGiftAmount
      );
      console.log("contract: ", contract.address);
      setContractAddress(contract.address);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenContractPage = React.useCallback(
    () => navigate(`/birthdays/${contractAddress}`, { replace: true }),
    [contractAddress, navigate]
  );

  const connectMetamask = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        setWalletAddress(res[0]);
      });
    }
  };

  return (
    <div className='main-container'>
      <div className='inner-container'>
        <p className='heading-text'>Create New Birthday Money Collector</p>
        <Box padding={2} sx={{ width: "100%", backgroundColor: "darkgray" }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id='outlined-basic'
              label='Name'
              variant='outlined'
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              id='outlined-basic'
              label='Image'
              variant='outlined'
              onChange={(e) =>
                setFormValues({ ...formValues, image: e.target.value })
              }
            />
            <TextField
              fullWidth
              id='outlined-basic'
              label='Participation Amount'
              variant='outlined'
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  participationAmount: ethers.utils.parseEther(e.target.value),
                })
              }
            />
            <TextField
              fullWidth
              id='outlined-basic'
              label='Target Gift Amount'
              variant='outlined'
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  targetGiftAmount: ethers.utils.parseEther(e.target.value),
                })
              }
            />
            <DatePicker
              fullWidth
              label='Birthday Date'
              minDate={new Date()}
              value={formValues.birthdate}
              onChange={(newValue) => {
                setFormValues({ ...formValues, birthdate: newValue._d });
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />

            <Button
              fullWidth
              variant='contained'
              onClick={connectMetamask}
              disabled={walletAddress}
            >
              {walletAddress
                ? `Connected with ${walletAddress}`
                : `Connect to MetaMask!`}
            </Button>
            {!contractAddress && (
              <Button fullWidth variant='contained' onClick={handleDeploy}>
                {!loading && "Deploy the contract"}
                {loading && <CircularProgress />}
              </Button>
            )}
            {contractAddress && (
              <Button
                fullWidth
                variant='contained'
                onClick={handleOpenContractPage}
              >
                Go to contract page
              </Button>
            )}
          </Stack>
        </Box>
      </div>
    </div>
  );
}

export default CreateContract;
