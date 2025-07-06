use reparkr::interfaces::IReparkr::IReparkrDispatcher;
use snforge_std::{ContractClassTrait, DeclareResultTrait, declare};
use starknet::ContractAddress;

pub fn OWNER() -> ContractAddress {
    'owner'.try_into().unwrap()
}

pub fn DELEGATE() -> ContractAddress {
    'delegate'.try_into().unwrap()
}

pub fn UNAUTHORIZED() -> ContractAddress {
    'unauthorized'.try_into().unwrap()
}

pub fn setup() -> (IReparkrDispatcher, ContractAddress) {
    let contract = declare("Reparkr").unwrap().contract_class();
    let mut calldata = array![];
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    let dispatcher = IReparkrDispatcher { contract_address };

    (dispatcher, contract_address)
}
