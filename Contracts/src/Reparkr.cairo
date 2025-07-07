#[starknet::contract]
pub mod Reparkr {
    use core::array::ArrayTrait;
    use core::num::traits::Zero;
    use reparkr::base::errors::Errors::{
        CAR_ALREADY_REGISTERED, CAR_NOT_FOUND, DELEGATE_NOT_FOUND, UNAUTHORIZED_CALLER,
        ZERO_ADDRESS,
    };
    use reparkr::base::types::Car;
    use reparkr::interfaces::IReparkr::IReparkr;
    use starknet::storage::*;
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

    #[storage]
    pub struct Storage {
        cars: Map<felt252, Car>,
        owner_cars: Map<(ContractAddress, u32), felt252>,
        owner_car_count: Map<ContractAddress, u32>,
        all_cars: Map<u32, felt252>,
        total_cars_registered: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CarRegistered: CarRegistered,
        CarEdited: CarEdited,
        DelegateAdded: DelegateAdded,
        DelegateRemoved: DelegateRemoved,
        CarDeleted: CarDeleted,
    }

    #[derive(Drop, starknet::Event)]
    pub struct CarRegistered {
        pub plate: felt252,
        pub owner: ContractAddress,
        pub registered_at: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct CarEdited {
        pub plate: felt252,
        pub editor: ContractAddress,
        pub new_car_model: felt252,
        pub new_email: ByteArray,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DelegateAdded {
        pub plate: felt252,
        pub owner: ContractAddress,
        pub delegate: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DelegateRemoved {
        pub plate: felt252,
        pub owner: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct CarDeleted {
        pub plate: felt252,
        pub owner: ContractAddress,
    }

    #[abi(embed_v0)]
    pub impl ReparkrImpl of IReparkr<ContractState> {
        fn register_car(
            ref self: ContractState, 
            plate: felt252, 
            carModel: felt252,
            email: ByteArray,
        ) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Check if car is already registered and active
            let existing_car = self.cars.read(plate);
            assert(!existing_car.active, CAR_ALREADY_REGISTERED);

            let new_car = Car {
                plate,
                owner: caller,
                delegate_driver: Zero::zero(),
                current_driver: caller,
                registered_at: timestamp,
                active: true,
                car_model: carModel,
                email,
            };

            // Update primary car storage
            self.cars.write(plate, new_car);

            // Add to master list
            let current_total = self.total_cars_registered.read();
            self.all_cars.write(current_total, plate);

            // Add to owner's list
            let owner_count = self.owner_car_count.read(caller);
            self.owner_cars.write((caller, owner_count), plate);

            // Update counters
            self.total_cars_registered.write(current_total + 1);
            self.owner_car_count.write(caller, owner_count + 1);

            self
                .emit(
                    Event::CarRegistered(
                        CarRegistered { plate, owner: caller, registered_at: timestamp },
                    ),
                );
        }

        fn edit_car(
            ref self: ContractState, 
            plate: felt252, 
            new_car_model: felt252,
            new_email: ByteArray,
        ) {
            let caller = get_caller_address();
            let mut car = self.cars.read(plate);

            assert(car.active, CAR_NOT_FOUND);
            assert(caller == car.owner, UNAUTHORIZED_CALLER);

            car.car_model = new_car_model;
            car.email = new_email.clone();

            self.cars.write(plate, car);

            self
                .emit(
                    Event::CarEdited(
                        CarEdited { 
                            plate, 
                            editor: caller,
                            new_car_model,
                            new_email,
                        },
                    ),
                );
        }

        fn delete_car(ref self: ContractState, plate: felt252) {
            let caller = get_caller_address();
            let mut car = self.cars.read(plate);

            assert(car.active, CAR_NOT_FOUND);
            assert(caller == car.owner, UNAUTHORIZED_CALLER);

            // Soft delete the car entry
            car.active = false;
            self.cars.write(plate, car);
            self.emit(Event::CarDeleted(CarDeleted { plate, owner: caller }));
        }

        // DELEGATE MANAGEMENT
        fn add_delegate(ref self: ContractState, plate: felt252, delegate: ContractAddress) {
            let caller = get_caller_address();
            assert(!delegate.is_zero(), ZERO_ADDRESS);

            let mut car = self.cars.read(plate);
            assert(car.active, CAR_NOT_FOUND);
            assert(caller == car.owner, UNAUTHORIZED_CALLER);

            car.delegate_driver = delegate;
            self.cars.write(plate, car);
            self.emit(Event::DelegateAdded(DelegateAdded { plate, owner: caller, delegate }));
        }

        fn remove_delegate(ref self: ContractState, plate: felt252) {
            let caller = get_caller_address();
            let mut car = self.cars.read(plate);

            assert(car.active, CAR_NOT_FOUND);
            assert(caller == car.owner, UNAUTHORIZED_CALLER);

            // Set current driver back to owner if it was the delegate
            if car.current_driver == car.delegate_driver {
                car.current_driver = car.owner;
            }

            // Remove delegate by setting to zero address
            car.delegate_driver = Zero::zero();

            self.cars.write(plate, car);
            self.emit(Event::DelegateRemoved(DelegateRemoved { plate, owner: caller }));
        }

        // ACCESS CONTROL
        fn switch_to_owner(ref self: ContractState, plate: felt252) {
            let caller = get_caller_address();
            let mut car = self.cars.read(plate);

            assert(car.active, CAR_NOT_FOUND);
            assert(caller == car.owner, UNAUTHORIZED_CALLER);

            car.current_driver = car.owner;
            self.cars.write(plate, car);
        }

        fn switch_to_delegate(ref self: ContractState, plate: felt252) {
            let caller = get_caller_address();
            let mut car = self.cars.read(plate);

            assert(car.active, CAR_NOT_FOUND);
            assert(caller == car.owner, UNAUTHORIZED_CALLER);
            assert(!car.delegate_driver.is_zero(), DELEGATE_NOT_FOUND);

            car.current_driver = car.delegate_driver;
            self.cars.write(plate, car);
        }

        // VIEW FUNCTIONS
        fn get_car(self: @ContractState, plate: felt252) -> Car {
            let car = self.cars.read(plate);
            assert(car.active, CAR_NOT_FOUND);
            car
        }

        fn car_exists(self: @ContractState, plate: felt252) -> bool {
            self.cars.read(plate).active
        }

        fn get_current_driver(self: @ContractState, plate: felt252) -> ContractAddress {
            assert(self.cars.read(plate).active, CAR_NOT_FOUND);
            self.cars.read(plate).current_driver
        }

        fn get_car_owner(self: @ContractState, plate: felt252) -> ContractAddress {
            assert(self.cars.read(plate).active, CAR_NOT_FOUND);
            self.cars.read(plate).owner
        }

        fn get_delegate_driver(self: @ContractState, plate: felt252) -> ContractAddress {
            assert(self.cars.read(plate).active, CAR_NOT_FOUND);
            self.cars.read(plate).delegate_driver
        }

        fn get_owner_cars(self: @ContractState, owner: ContractAddress) -> Array<Car> {
            let count = self.owner_car_count.read(owner);
            let mut cars = ArrayTrait::new();
            let mut i = 0;
            while i != count {
                let plate = self.owner_cars.read((owner, i));
                let car = self.cars.read(plate);
                cars.append(car);
                i += 1;
            }
            cars
        }

        fn get_owner_active_cars(self: @ContractState, owner: ContractAddress) -> Array<Car> {
            let count = self.owner_car_count.read(owner);
            let mut active_cars = ArrayTrait::new();
            let mut i = 0;
            while i != count {
                let plate = self.owner_cars.read((owner, i));
                let car = self.cars.read(plate);
                if car.active {
                    active_cars.append(car);
                }
                i += 1;
            }
            active_cars
        }

        fn get_owner_car_count(self: @ContractState, owner: ContractAddress) -> u32 {
            self.owner_car_count.read(owner)
        }

        fn get_all_cars(self: @ContractState) -> Array<Car> {
            let total = self.total_cars_registered.read();
            let mut cars = ArrayTrait::new();
            let mut i = 0;
            while i != total {
                let plate = self.all_cars.read(i);
                let car = self.cars.read(plate);
                cars.append(car);
                i += 1;
            }
            cars
        }

        fn get_all_active_cars(self: @ContractState) -> Array<Car> {
            let total = self.total_cars_registered.read();
            let mut active_cars = ArrayTrait::new();
            let mut i = 0;
            while i != total {
                let plate = self.all_cars.read(i);
                let car = self.cars.read(plate);
                if car.active {
                    active_cars.append(car);
                }
                i += 1;
            }
            active_cars
        }

        fn get_total_cars_registered(self: @ContractState) -> u32 {
            self.total_cars_registered.read()
        }
    }
}