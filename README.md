# Voting DApp avec IPFS

Une application décentralisée (DApp) permettant de voter pour des candidats, dont les photos sont hébergées sur IPFS, via un contrat intelligent Solidity déployé localement avec Hardhat.

Elle permet au propriétaire d’ajouter des candidats et aux utilisateurs de voter de manière sécurisée via MetaMask.

---

## Fonctionnalités

- Connexion via MetaMask  
- Ajout de candidats avec images stockées sur IPFS  
- Vote unique par utilisateur  
- Affichage en temps réel des résultats et des photos  
- Blocage automatique du double vote  

---

## Technologies utilisées

- **Solidity** : contrat intelligent `Voting.sol`  
- **Hardhat** : environnement de développement Ethereum local  
- **React.js** : interface utilisateur  
- **Ethers.js** : interaction frontend ↔ blockchain  
- **IPFS** : stockage décentralisé des images  
- **Docker + docker-compose** : exécution locale d’un nœud IPFS  
- **MetaMask** : authentification et signature des transactions  

---

## Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/Asmaa-rahhali/Voting_DApp
   cd Voting_DApp
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   cd client
   npm install
   ```

3. **Lancer le nœud IPFS avec Docker**

   Assurez-vous que Docker est installé, puis exécutez :

   ```bash
   docker-compose up
   ```

   Cela lance un nœud IPFS local accessible sur `http://localhost:5001`.

4. **Lancer le réseau Hardhat**

   Dans le dossier principal :

   ```bash
   npx hardhat node
   ```

5. **Déployer le contrat**

   Dans un autre terminal :

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Copiez l’adresse du contrat affichée dans la console.

6. **Configurer l’adresse du contrat**

   Dans le fichier `App.js`, remplacez la valeur de `CONTRACT_ADDRESS` par l’adresse obtenue au déploiement :

   ```js
   const CONTRACT_ADDRESS = "0x...";
   ```

7. **Lancer l’interface React**

   Depuis le dossier `client` :

   ```bash
   npm start
   ```

---

## Utilisation

1. Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur
2. Se connecter à MetaMask (réseau local Hardhat)
3. Si vous êtes le propriétaire, ajoutez un candidat avec son image
4. Voter pour un candidat une seule fois
5. Visualiser les résultats et les images récupérées via IPFS

---

## Objectif pédagogique

Cette DApp a été réalisée pour expérimenter une application complète Web3 avec :

- Déploiement et interaction avec un smart contract (Solidity + Hardhat)
- Intégration du stockage décentralisé avec IPFS
- Interface en React.js communiquant avec la blockchain via Ethers.js
- Signature de transactions avec MetaMask