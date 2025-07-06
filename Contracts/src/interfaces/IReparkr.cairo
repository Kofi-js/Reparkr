use reparkr::base::types::Car;
use starknet::ContractAddress;

#[starknet::interface]
pub trait IReparkr<TContractState> {
    // CORE CAR MANAGEMENT FUNCTIONS
    
    // Registers a car with the caller as the owner
    fn register_car(ref self: TContractState, plate: felt252, carModel: felt252, telegram_id: u64);

    // Gets the car struct by plate
    fn get_car(self: @TContractState, plate: felt252) -> Car;

    // Edits car details (telegram_id and car_model)
    fn edit_car(ref self: TContractState, plate: felt252, new_telegram_id: u64, new_car_model: felt252);

    // Deletes the car entry (soft delete)
    fn delete_car(ref self: TContractState, plate: felt252);

    // DELEGATE MANAGEMENT FUNCTIONS
    
    // Adds or updates the delegate driver
    fn add_delegate(ref self: TContractState, plate: felt252, delegate: ContractAddress);

    // Removes the delegate driver
    fn remove_delegate(ref self: TContractState, plate: felt252);

    // ACCESS CONTROL FUNCTIONS
    
    // Switch current driver to owner
    fn switch_to_owner(ref self: TContractState, plate: felt252);

    // Switch current driver to delegate
    fn switch_to_delegate(ref self: TContractState, plate: felt252);

    // VIEW FUNCTIONS
    
    // Check if a car exists and is active
    fn car_exists(self: @TContractState, plate: felt252) -> bool;

    // Get current driver of a car
    fn get_current_driver(self: @TContractState, plate: felt252) -> ContractAddress;

    // Get owner of a car
    fn get_car_owner(self: @TContractState, plate: felt252) -> ContractAddress;

    // Get delegate driver of a car
    fn get_delegate_driver(self: @TContractState, plate: felt252) -> ContractAddress;
    
    // Get all cars owned by a user (including deleted ones) - Returns full Car objects
    fn get_owner_cars(self: @TContractState, owner: ContractAddress) -> Array<Car>;

    // Get only active cars owned by a user - Returns full Car objects
    fn get_owner_active_cars(self: @TContractState, owner: ContractAddress) -> Array<Car>;

    // Get total number of cars registered by a user
    fn get_owner_car_count(self: @TContractState, owner: ContractAddress) -> u32;

    // VIEW FUNCTIONS - GLOBAL QUERIES (FULL CAR OBJECTS)
    
    // Get all cars in the system (including deleted ones) - Returns full Car objects
    fn get_all_cars(self: @TContractState) -> Array<Car>;

    // Get only active cars in the system - Returns full Car objects
    fn get_all_active_cars(self: @TContractState) -> Array<Car>;

    // Get total number of cars ever registered
    fn get_total_cars_registered(self: @TContractState) -> u32;
}