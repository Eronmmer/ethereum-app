import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const greeterAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

function App() {
	// store greeting in local state
	const [greeting, setGreetingValue] = useState("");
	const [userAccount, setUserAccount] = useState("");
	const [amount, setAmount] = useState(0);

	// request access to the user's MetaMask account
	async function requestAccount() {
		await window.ethereum.request({ method: "eth_requestAccounts" });
	}

	// call the smart contract, read the current greeting value
	async function fetchGreeting() {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				greeterAddress,
				Greeter.abi,
				provider
			);
			try {
				const data = await contract.greet();
				console.log("data: ", data);
			} catch (err) {
				console.log("Error: ", err);
			}
		}
	}

	async function getBalance() {
		if (typeof window.ethereum !== "undefined") {
			const [account] = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
			const balance = await contract.balanceOf(account);
			console.log("Balance: ", balance.toString());
		}
	}

	// call the smart contract, send an update
	async function setGreeting() {
		if (!greeting) return;
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
			const transaction = await contract.setGreeting(greeting);
			await transaction.wait();
			fetchGreeting();
		}
	}

	async function sendCoins() {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
			const transaction = await contract.transfer(userAccount, amount);
			await transaction.wait();
			console.log(`${amount} Coins successfully sent to ${userAccount}`);
		}
	}
	return (
		<div className="App">
			<header className="App-header">
				<button onClick={fetchGreeting}>Fetch Greeting</button>
				<button onClick={setGreeting}>Set Greeting</button>
				<input
					onChange={(e) => setGreetingValue(e.target.value)}
					placeholder="Set greeting"
				/>

				<br />
				<button onClick={getBalance}>Get Balance</button>
				<button onClick={sendCoins}>Send Coins</button>
				<input
					onChange={(e) => setUserAccount(e.target.value)}
					placeholder="Account ID"
				/>
				<input
					onChange={(e) => setAmount(e.target.value)}
					placeholder="Amount"
				/>
			</header>
		</div>
	);
}

export default App;
