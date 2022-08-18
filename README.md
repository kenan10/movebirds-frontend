# Before deploy

1. Put REAL links into header button, text on the first screen, and text in the FAQ
2. Change GOERLI_RPC url to MAINNET_RPC in the useContract hook
3. Check is MAINNET address in contract addresses
4. Check is public/stage.json right
   list names should be correspond to the list name from db
5. Turn on chaching provider in useWeb3 hook

# About info.json
- Take date from `new Date("[your date]")).toJSON()`
- Take code from contract
- List name should be the same as in DB