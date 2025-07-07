use starknet::ContractAddress;

#[derive(Drop, Serde, PartialEq, starknet::Store, Clone)]
pub struct Car {
    pub plate: felt252,
    pub owner: ContractAddress,
    pub delegate_driver: ContractAddress,
    pub current_driver: ContractAddress,
    pub registered_at: u64,
    pub active: bool,
    pub car_model: felt252,
    pub email: ByteArray,
}

// #[derive(Copy, Drop, Serde, PartialEq, starknet::Store, Clone)]
// pub struct Driver {
//     pub wallet: ContractAddress,
//     pub telegram_id: u64,
//     pub joined_at: u64,
// }

// #[derive(Copy, Drop, Serde, PartialEq, starknet::Store, Clone)]
// pub struct Ping {
//     pub sender: ContractAddress,
//     pub target_plate: felt252,
//     pub timestamp: u64,
//     pub message_id: u64,
// }
