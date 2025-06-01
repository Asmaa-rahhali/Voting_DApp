import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingAbi from "./Voting.json";
import { create } from 'ipfs-http-client';
import "./App.css";

const ipfs = create({ url: 'http://localhost:5001' });
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voteId, setVoteId] = useState(0);
  const [newCandidate, setNewCandidate] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, VotingAbi.abi, signer);
  };

  async function connectWallet() {
    if (!window.ethereum) return alert("Veuillez installer MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const contract = await getContract();
    const owner = await contract.owner();
    setIsOwner(address.toLowerCase() === owner.toLowerCase());
  }

  async function loadCandidates() {
    const contract = await getContract();
    const count = await contract.candidateCount();
    const list = [];

    for (let i = 0; i < count; i++) {
      const c = await contract.candidates(i);
      list.push({ id: i, name: c.name, voteCount: c.voteCount.toString(), imageCID: c.imageCID });
    }

    setCandidates(list);
  }

  async function vote() {
    const contract = await getContract();
    const tx = await contract.vote(voteId);
    await tx.wait();
    loadCandidates();
  }

  const addCandidate = async () => {
    if (!newCandidate.trim() || !imageFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const buffer = new Uint8Array(reader.result);
      const result = await ipfs.add(buffer);
      const imageCID = result.path;

      const contract = await getContract();
      const tx = await contract.addCandidate(newCandidate.trim(), imageCID);
      await tx.wait();

      setNewCandidate("");
      setImageFile(null);
      loadCandidates();
    };
    reader.readAsArrayBuffer(imageFile);
  };

  useEffect(() => {
    connectWallet();
    loadCandidates();
  }, []);

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>DApp de Vote</h1>
      <p>Connecté en tant que : <strong>{account}</strong></p>

      {isOwner && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Ajouter un candidat</h3>
          <input
            type="text"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            placeholder="Nom du candidat"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ marginLeft: "10px" }}
          />
          <button onClick={addCandidate} style={{ marginLeft: "10px" }}>Ajouter</button>
        </div>
      )}

      <h3>Liste des candidats</h3>
      <select onChange={(e) => setVoteId(Number(e.target.value))}>
        <option value="">Choisissez un candidat --</option>
        {candidates.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.voteCount} vote{c.voteCount !== 1 ? "s" : ""})
          </option>
        ))}
      </select>

      <button onClick={vote} style={{ marginLeft: "10px" }}>Voter</button>

      <h3>Résultats actuels</h3>
      <ul>
        {candidates.map((c) => (
          <li key={c.id}>
            {c.name} : {c.voteCount} vote(s)
            {c.imageCID && (
              <div>
                <img
                  src={`http://localhost:8080/ipfs/${c.imageCID}`}
                  alt={`Photo de ${c.name}`}
                  style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "5px" }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
