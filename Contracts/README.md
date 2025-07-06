# Reparkr

A Starknet-powered smart parking interaction app for resolving parking blockages and improving urban parking etiquette.

---

## 🚘 Problem

In crowded cities, cars are often blocked by others, causing frustration and delays. Finding the owner of the blocking car is usually difficult and inefficient.

---

## ✅ Solution

Reparkr enables car owners to register their vehicles on Starknet, associating their number plates with private contact channels. When a car is blocked, anyone can send a repark request to the owner without revealing personal contact details.

---

## 🧩 Key Features

- **Plate-to-Identity Resolution:**
  - Query a car's plate number to retrieve the owner's contact channel (e.g., Telegram ID).
- **Ping Driver:**
  - Send a repark request via app notification, SMS, Telegram, or email (using relayers).
- **Privacy & Anonymity:**
  - Contact details are abstracted; messages can be relayed anonymously.
- **Starknet Identity Layer:**
  - Car ownership is tied to Starknet accounts and proven by wallet signature.
- **QR Code System:**
  - QR stickers on cars link directly to the repark request UI.
- **Delegation:**
  - Owners can assign delegates to act on their behalf.

---

## 🛠️ Optional Add-ons

- **Reputation System:**
  - Track response times and issue badges for good behavior.
- **Rewards:**
  - Token incentives for prompt or courteous drivers.
- **Parking Space Sharing:**
  - List and rent parking spaces for micropayments.
- **Integration with City Infrastructure:**
  - Automate warnings or fines for repeat offenders.

---

## 🔐 Why Starknet?

- **Privacy:** On-chain registration with potential for zero-knowledge proofs.
- **Decentralized Identity:** True ownership of car and contact info.
- **Programmability:** Smart contracts for alerts, rewards, and reputation.

---

## 📦 Project Structure

```
reparkr/
  ├── src/
  │   ├── base/
  │   ├── interfaces/
  │   ├── tests/
  │   ├── Reparkr.cairo
  │   ├── lib.cairo
  │   └── ...
  ├── Scarb.toml
  ├── Scarb.lock
  ├── snfoundry.toml
  └── README.md
```

- **src/Reparkr.cairo:** Main contract logic
- **src/interfaces/IReparkr.cairo:** Contract interface
- **src/base/types.cairo:** Data models
- **src/base/errors.cairo:** Error definitions
- **src/tests/**: Test suite

---

## 🚀 Getting Started

### Prerequisites
- [Scarb](https://docs.swmansion.com/scarb/) (Cairo package manager)
- [Starknet Foundry](https://github.com/foundry-rs/starknet-foundry) (for testing)

### Installation
```bash
# Clone the repo
$ git clone <repo-url>
$ cd reparkr

# Install dependencies
$ scarb build
```

### Running Tests
```bash
$ snforge test
```

---

## 🏗️ Architecture Overview

- **Car Registration:** Owners register cars with plate number and contact info.
- **Delegation:** Owners can add/remove delegates.
- **Repark Requests:** Anyone can send a repark request to a car owner.
- **Privacy:** Contact info is abstracted; relayers can be used for notifications.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License

No License

---

## 🙋‍♂️ Contact

For questions or collaboration, open an issue or reach out to me.