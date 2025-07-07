import { Abi } from "starknet";

export const REPARKR_ABI: Abi = [
  {
    "type": "impl",
    "name": "ReparkrImpl",
    "interface_name": "reparkr::interfaces::IReparkr::IReparkr"
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "reparkr::base::types::Car",
    "members": [
      {
        "name": "plate",
        "type": "core::felt252"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "delegate_driver",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "current_driver",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "registered_at",
        "type": "core::integer::u64"
      },
      {
        "name": "active",
        "type": "core::bool"
      },
      {
        "name": "car_model",
        "type": "core::felt252"
      },
      {
        "name": "email",
        "type": "core::byte_array::ByteArray"
      }
    ]
  },
  {
    "type": "interface",
    "name": "reparkr::interfaces::IReparkr::IReparkr",
    "items": [
      {
        "type": "function",
        "name": "register_car",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          },
          {
            "name": "carModel",
            "type": "core::felt252"
          },
          {
            "name": "email",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_car",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "reparkr::base::types::Car"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "edit_car",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          },
          {
            "name": "new_car_model",
            "type": "core::felt252"
          },
          {
            "name": "new_email",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "delete_car",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "add_delegate",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          },
          {
            "name": "delegate",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "remove_delegate",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "switch_to_owner",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "switch_to_delegate",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "car_exists",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_current_driver",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_car_owner",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_delegate_driver",
        "inputs": [
          {
            "name": "plate",
            "type": "core::felt252"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_owner_cars",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<reparkr::base::types::Car>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_owner_active_cars",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<reparkr::base::types::Car>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_owner_car_count",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_all_cars",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<reparkr::base::types::Car>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_all_active_cars",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<reparkr::base::types::Car>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_cars_registered",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u32"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "event",
    "name": "reparkr::Reparkr::Reparkr::CarRegistered",
    "kind": "struct",
    "members": [
      {
        "name": "plate",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "registered_at",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "reparkr::Reparkr::Reparkr::CarEdited",
    "kind": "struct",
    "members": [
      {
        "name": "plate",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "editor",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "new_car_model",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "new_email",
        "type": "core::byte_array::ByteArray",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "reparkr::Reparkr::Reparkr::DelegateAdded",
    "kind": "struct",
    "members": [
      {
        "name": "plate",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "delegate",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "reparkr::Reparkr::Reparkr::DelegateRemoved",
    "kind": "struct",
    "members": [
      {
        "name": "plate",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "reparkr::Reparkr::Reparkr::CarDeleted",
    "kind": "struct",
    "members": [
      {
        "name": "plate",
        "type": "core::felt252",
        "kind": "data"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "reparkr::Reparkr::Reparkr::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "CarRegistered",
        "type": "reparkr::Reparkr::Reparkr::CarRegistered",
        "kind": "nested"
      },
      {
        "name": "CarEdited",
        "type": "reparkr::Reparkr::Reparkr::CarEdited",
        "kind": "nested"
      },
      {
        "name": "DelegateAdded",
        "type": "reparkr::Reparkr::Reparkr::DelegateAdded",
        "kind": "nested"
      },
      {
        "name": "DelegateRemoved",
        "type": "reparkr::Reparkr::Reparkr::DelegateRemoved",
        "kind": "nested"
      },
      {
        "name": "CarDeleted",
        "type": "reparkr::Reparkr::Reparkr::CarDeleted",
        "kind": "nested"
      }
    ]
  }
]