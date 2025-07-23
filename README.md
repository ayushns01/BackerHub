# BackerHub

This project demonstrates a basic Hardhat use case for crowdfunding smart contracts. It includes sample contracts, tests, and deployment modules.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/ayushns01/BackerHub.git
   cd BackerHub
   ```

2. **Initialize npm (if not already initialized):**

   ```sh
   npm init -y
   ```

3. **Install Hardhat as a dev dependency:**

   ```sh
   npm install --save-dev hardhat
   ```

4. **Set up Hardhat project (choose 'Create a basic sample project' or as needed):**

   ```sh
   npx hardhat
   ```

5. **Install OpenZeppelin Contracts:**

   ```sh
   npm install @openzeppelin/contracts
   ```

6. **Install Hardhat Toolbox as a dev dependency:**

   ```sh
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   ```

7. **Install all dependencies (if you haven't already):**

   ```sh
   npm install
   ```

   This will install all required packages, including:

   - [Hardhat](https://hardhat.org/)
   - [@nomicfoundation/hardhat-toolbox](https://github.com/NomicFoundation/hardhat-toolbox)
   - [@openzeppelin/contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

8. **Compile the contracts:**

   ```sh
   npx hardhat compile
   ```

9. **Run tests:**
   ```sh
   npx hardhat test
   ```

## Project Structure

- `contracts/` - Solidity smart contracts
- `test/` - JavaScript tests
- `ignition/` - Hardhat Ignition deployment modules
- `hardhat.config.js` - Hardhat configuration

## Useful Commands

- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run tests
- `npx hardhat clean` - Clear cache and artifacts
- `npx hardhat run scripts/deploy.js` - Deploy contracts using a script

## Deploying Contracts

To deploy your contracts to a local Hardhat network or a configured testnet, use the following command:

```sh
npx hardhat run scripts/deploy.js
```

### Notes:

- Make sure you have a `scripts/deploy.js` file that contains your deployment logic.
- By default, this command deploys to the local Hardhat network. To deploy to a testnet (e.g., Goerli), add the `--network` flag:
  ```sh
  npx hardhat run scripts/deploy.js --network goerli
  ```
- Ensure your `hardhat.config.js` is properly configured with the desired network settings and private keys (never commit private keys to version control).

## License

MIT
