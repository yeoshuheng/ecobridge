import { ethers } from "ethers";
import { auth } from "../db/firebase";
import { db } from "../db/firebase";
import { getDoc, doc } from "firebase/firestore";
import { BigNumber } from "ethers";

const tokens = new Map();
tokens.set("KILMA", "0x078a711a6d52CDe57Cbd9dd0ed70f3F960781e12");
tokens.set("MCO2", "0x0C7AdaF776B78739F50B284Da52b8875E3056406")

const abi = ["function mint(address to, uint amount) external",
        "function updateAdmin(address newAdmin) external",
        "function burn(address owner, uint amount) external"]

const abi2 = [
        "function transfer_remove (address token, uint amount) external owner_only",
        "function deposit(address token, uint amount) external payable",
        "function withdraw(address token, uint amount) external owner_only",
        "function getBalances(address token_) public view returns (uint)",
        ]

const BuyTokensNative = async (d) => {
    const to_username = auth.currentUser.email;
    const data = d.data;
    const amount = BigNumber.from(data.amount);
    const to_wallet = await getDoc(doc(db, "users", to_username));
    const token = tokens.get(d.token);
    const to = to_wallet.data()["walletAddress"];
    const private_key = require("../pages/web3/keys.json")["meta-mask"];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = new ethers.Wallet(private_key, provider);
    const contract = new ethers.Contract(token, abi, signer);
    console.log("contract established: ", contract);
    const tx = await contract.mint(to, amount);
    console.log("tx success: ", tx);
    const rc = await tx.wait();
    console.log(rc.events[0]);
    const updatestate_ = new ethers.Contract(to, abi2, signer);
    await updatestate_.deposit(token, amount);
}

export default BuyTokensNative