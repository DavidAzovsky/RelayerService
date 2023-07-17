# RelayerServiceServer
Relayer service server can make the transaction.Who make the request based on EIP712 request in client side. Their transaction will execute in the contract based on the standard EIP2771.

Please visit the Meta Transactions [https://eips.ethereum.org/EIPS/eip-2771](https://eips.ethereum.org/EIPS/eip-2771)


### Install

```sh
git clone https://github.com/aravindhkm/RelayerServiceAutomata.git
cd RelayerServiceServer
npm install --save
npm run start
```

### Using Local Environment

```bash
# Copy Example Env file
cp ./env.example .env

# Port number
PORT=""
# Receiver Forwarder Contract
RECEIVERFORWARDERCONTRACT=""
# Provide the encrypted format private.Please Use the encryptPrivateKey routes for encryption.
ENCRYPTEDPRIVATEKEY=""
# Please Provide the secretKey. Which one we used for the encryption.
SECRETKEY=""
# RPC URL
RPCURL=""

```


### API Endpoints

List of available routes:

**MetaTx routes**:\
`POST /api/v1/metatx` - metatx\
`GET /api/v1/encryptPrivateKey` - encryptPrivateKey\
`GET /api/v1/decryptPrivateKey` - decryptPrivateKey\