# Reparkr 🚗

A decentralized repark-request system built on Starknet that lets car owners register their plate numbers as on-chain identities, enabling other drivers to send privacy-preserving repark requests when they are blocked.

## 🚘 Problem

In crowded cities, cars are often blocked by others, causing frustration and delays. Finding the owner of the blocking car is usually difficult and inefficient. Traditional solutions like leaving notes or calling authorities are slow and often ineffective.

## ✅ Solution

Reparkr enables car owners to register their vehicles on Starknet, associating their number plates with private contact channels. When a car is blocked, anyone can send a repark request to the owner without revealing personal contact details.

## 🧩 Key Features

- **Plate-to-Identity Resolution:** Query a car's plate number to retrieve the owner's contact channel (e.g., Telegram ID)
- **Ping Driver:** Send a repark request via app notification, SMS, Telegram, or email (using relayers)
- **Privacy & Anonymity:** Contact details are abstracted; messages can be relayed anonymously
- **Starknet Identity Layer:** Car ownership is tied to Starknet accounts and proven by wallet signature
- **QR Code System:** QR stickers on cars link directly to the repark request UI
- **Delegation:** Owners can assign delegates to act on their behalf

## 🛠️ Technical Architecture

### Smart Contracts (Cairo)
- **Car Registration:** Owners register cars with plate number and contact info
- **Delegation System:** Owners can add/remove delegates for their vehicles
- **Access Control:** Secure permission management for car operations
- **Event System:** Comprehensive event logging for transparency

### Frontend (Next.js)
- **Modern UI:** Built with Next.js, TypeScript, and Tailwind CSS
- **Wallet Integration:** Seamless Starknet wallet connection
- **QR Code Generation:** Dynamic QR codes for each registered vehicle
- **Responsive Design:** Works on mobile and desktop

## 🚀 Getting Started

### Prerequisites
- [Scarb](https://docs.swmansion.com/scarb/) (Cairo package manager)
- [Starknet Foundry](https://github.com/foundry-rs/starknet-foundry) (for testing)
- Node.js 18+ (for frontend)

### Smart Contracts
```bash
cd Contracts
scarb build
snforge test
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 📦 Project Structure

```
reparkr/
├── Contracts/              # Cairo smart contracts
│   ├── src/
│   │   ├── base/           # Base types and errors
│   │   ├── interfaces/     # Contract interfaces
│   │   ├── tests/          # Comprehensive test suite
│   │   └── Reparkr.cairo   # Main contract
│   ├── Scarb.toml
│   └── README.md
├── Frontend/               # Next.js frontend application
│   ├── app/                # App router components
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   └── package.json
└── README.md               # This file
```

## 🔐 Why Starknet?

- **Privacy:** On-chain registration with potential for zero-knowledge proofs
- **Decentralized Identity:** True ownership of car and contact info
- **Programmability:** Smart contracts for alerts, rewards, and reputation
- **Scalability:** Layer 2 solution for high throughput and low fees

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
cd Contracts
snforge test
```

Tests cover:
- Car registration and management
- Delegate operations
- Access control and permissions
- Error handling and edge cases

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙋‍♂️ Contact

For questions or collaboration, open an issue or reach out to the maintainers.

---

**Built with ❤️ for the Starknet ecosystem** 