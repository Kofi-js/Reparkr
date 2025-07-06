use core::num::traits::Zero;
use reparkr::Reparkr::Reparkr;
use reparkr::interfaces::IReparkr::{IReparkrDispatcherTrait};
use reparkr::tests::utils::{DELEGATE, OWNER, UNAUTHORIZED, setup};
use snforge_std::{
    EventSpyAssertionsTrait, spy_events, start_cheat_caller_address, stop_cheat_caller_address,
};
use starknet::{get_block_timestamp};

#[test]
fn test_register_car_success() {
    let (dispatcher, contract_address) = setup();
    let mut spy = spy_events();

    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;
    let timestamp = get_block_timestamp();

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    spy
        .assert_emitted(
            @array![
                (
                    contract_address,
                    Reparkr::Event::CarRegistered(
                        Reparkr::CarRegistered { plate, owner: OWNER(), registered_at: timestamp },
                    ),
                ),
            ],
        );

    let stored_car = dispatcher.get_car(plate);
    assert(stored_car.plate == plate, 'Reg: Plate mismatch');
    assert(stored_car.owner == OWNER(), 'Reg: Owner mismatch');
    assert(stored_car.delegate_driver == 0.try_into().unwrap(), 'Reg: Delegate mismatch');
    assert(stored_car.current_driver == OWNER(), 'Reg: Current driver mismatch');
    assert(stored_car.telegram_id == telegram_id, 'Reg: Telegram ID mismatch');
    assert(stored_car.registered_at == timestamp, 'Reg: Timestamp mismatch');
    assert(stored_car.active == true, 'Reg: Not active');
    assert(stored_car.car_model == car_model, 'Reg: Model mismatch');
}

#[test]
#[should_panic(expected: 'Car already registered')]
fn test_register_car_already_registered() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    
    // Register first car
    dispatcher.register_car(plate, car_model, telegram_id);

    // Try to register same plate again - should panic
    dispatcher.register_car(plate, 'ANOTHER MODEL', telegram_id);
    
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_get_car_success() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    let retrieved_car = dispatcher.get_car(plate);

    assert(retrieved_car.plate == plate, 'Get: Plate mismatch');
    assert(retrieved_car.owner == OWNER(), 'Get: Owner mismatch');
}

#[test]
#[should_panic(expected: 'Car not found')]
fn test_get_car_not_found() {
    let (dispatcher, _) = setup();
    dispatcher.get_car('NONEXISTENT');
}

#[test]
#[should_panic(expected: 'Car not found')]
fn test_get_car_deleted() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Delete the car
    dispatcher.delete_car(plate);
    stop_cheat_caller_address(contract_address);

    // Try to get the deleted car - should panic
    dispatcher.get_car(plate);
}

#[test]
fn test_add_delegate_success() {
    let (dispatcher, contract_address) = setup();
    let mut spy = spy_events();

    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    dispatcher.add_delegate(plate, DELEGATE());
    stop_cheat_caller_address(contract_address);

    let updated_car = dispatcher.get_car(plate);
    assert(updated_car.delegate_driver == DELEGATE(), 'Delegate not set');
    assert(updated_car.current_driver == OWNER(), 'Current driver should be own');

    spy
        .assert_emitted(
            @array![
                (
                    contract_address,
                    Reparkr::Event::DelegateAdded(
                        Reparkr::DelegateAdded { plate, owner: OWNER(), delegate: DELEGATE() },
                    ),
                ),
            ],
        );
}

#[test]
#[should_panic(expected: 'Invalid zero address')]
fn test_add_delegate_zero_address() {
    let (dispatcher, contract_address) = setup();

    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Try to add zero address as delegate - should panic
    dispatcher.add_delegate(plate, 0.try_into().unwrap());
    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: 'Caller not authorized')]
fn test_add_delegate_by_non_owner() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    // Try to add delegate as non-owner - should panic
    start_cheat_caller_address(contract_address, UNAUTHORIZED());
    dispatcher.add_delegate(plate, DELEGATE());
    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: 'Car not found')]
fn test_add_delegate_to_car_not_found() {
    let (dispatcher, contract_address) = setup();
    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.add_delegate('NONEXISTENT', DELEGATE());
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_remove_delegate_success() {
    let (dispatcher, contract_address) = setup();
    let mut spy = spy_events();

    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Add delegate
    dispatcher.add_delegate(plate, DELEGATE());

    // Remove delegate
    dispatcher.remove_delegate(plate);
    stop_cheat_caller_address(contract_address);

    let updated_car = dispatcher.get_car(plate);
    assert(updated_car.delegate_driver.is_zero(), 'Delegate not removed');

    spy
        .assert_emitted(
            @array![
                (
                    contract_address,
                    Reparkr::Event::DelegateRemoved(
                        Reparkr::DelegateRemoved { plate, owner: OWNER() },
                    ),
                ),
            ],
        );
}

#[test]
#[should_panic(expected: 'Caller not authorized')]
fn test_remove_delegate_by_non_owner() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Add delegate
    dispatcher.add_delegate(plate, DELEGATE());
    stop_cheat_caller_address(contract_address);

    // Try to remove delegate by non-owner - should panic
    start_cheat_caller_address(contract_address, UNAUTHORIZED());
    dispatcher.remove_delegate(plate);
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_delete_car_success() {
    let (dispatcher, contract_address) = setup();
    let mut spy = spy_events();

    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Delete the car
    dispatcher.delete_car(plate);
    stop_cheat_caller_address(contract_address);

    spy
        .assert_emitted(
            @array![
                (
                    contract_address,
                    Reparkr::Event::CarDeleted(
                        Reparkr::CarDeleted { plate, owner: OWNER() },
                    ),
                ),
            ],
        );
}

#[test]
#[should_panic(expected: 'Caller not authorized')]
fn test_delete_car_by_non_owner() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    // Try to delete car as non-owner - should panic
    start_cheat_caller_address(contract_address, UNAUTHORIZED());
    dispatcher.delete_car(plate);
    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: 'Car not found')]
fn test_delete_car_not_found() {
    let (dispatcher, contract_address) = setup();
    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.delete_car('NONEXISTENT');
    stop_cheat_caller_address(contract_address);
}

#[test]
#[should_panic(expected: 'Car not found')]
fn test_delete_car_already_deleted() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;
    
    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Delete the car
    dispatcher.delete_car(plate);

    // Try to delete again - should panic
    dispatcher.delete_car(plate);
    stop_cheat_caller_address(contract_address);
}

// Additional tests for comprehensive coverage

#[test]
fn test_edit_car_success() {
    let (dispatcher, contract_address) = setup();
    let mut spy = spy_events();

    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;
    let new_telegram_id = 67890_u64;
    let new_car_model = 'ModelY';

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    dispatcher.edit_car(plate, new_telegram_id, new_car_model);
    stop_cheat_caller_address(contract_address);

    let updated_car = dispatcher.get_car(plate);
    assert(updated_car.telegram_id == new_telegram_id, 'Telegram ID not updated');
    assert(updated_car.car_model == new_car_model, 'Car model not updated');

    spy
        .assert_emitted(
            @array![
                (
                    contract_address,
                    Reparkr::Event::CarEdited(
                        Reparkr::CarEdited { 
                            plate, 
                            editor: OWNER(), 
                            new_telegram_id, 
                            new_car_model 
                        },
                    ),
                ),
            ],
        );
}

#[test]
#[should_panic(expected: 'Caller not authorized')]
fn test_edit_car_by_non_owner() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    // Try to edit car as non-owner - should panic
    start_cheat_caller_address(contract_address, UNAUTHORIZED());
    dispatcher.edit_car(plate, 99999_u64, 'NewModel');
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_switch_to_delegate_success() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    dispatcher.add_delegate(plate, DELEGATE());

    // Switch to delegate
    dispatcher.switch_to_delegate(plate);
    stop_cheat_caller_address(contract_address);

    let updated_car = dispatcher.get_car(plate);
    assert(updated_car.current_driver == DELEGATE(), 'Current driver not switched');
}

#[test]
#[should_panic(expected: 'Delegate not found')]
fn test_switch_to_delegate_without_delegate() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);

    // Try to switch to delegate without setting one - should panic
    dispatcher.switch_to_delegate(plate);
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_switch_to_owner_success() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    dispatcher.add_delegate(plate, DELEGATE());
    dispatcher.switch_to_delegate(plate);

    // Switch back to owner
    dispatcher.switch_to_owner(plate);
    stop_cheat_caller_address(contract_address);

    let updated_car = dispatcher.get_car(plate);
    assert(updated_car.current_driver == OWNER(), 'Current driver not switched');
}

#[test]
fn test_car_exists() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    // Test non-existent car
    assert(!dispatcher.car_exists(plate), 'Car should not exist');

    // Register car
    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    // Test existing car
    assert(dispatcher.car_exists(plate), 'Car should exist');

    // Delete car
    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.delete_car(plate);
    stop_cheat_caller_address(contract_address);

    // Test deleted car
    assert(!dispatcher.car_exists(plate), 'Car should not exist after del');
}

#[test]
fn test_get_current_driver() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    
    // Should initially be owner
    assert(dispatcher.get_current_driver(plate) == OWNER(), 'Init driver should be owner');

    // Add delegate and switch
    dispatcher.add_delegate(plate, DELEGATE());
    dispatcher.switch_to_delegate(plate);

    // Should now be delegate
    assert(dispatcher.get_current_driver(plate) == DELEGATE(), 'Current driver should be del');
    
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_get_car_owner() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    stop_cheat_caller_address(contract_address);

    assert(dispatcher.get_car_owner(plate) == OWNER(), 'Car owner should be OWNER');
}

#[test]
fn test_get_delegate_driver() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    
    // Should initially be zero
    assert(dispatcher.get_delegate_driver(plate).is_zero(), 'Init delegate should be zero');

    // Add delegate
    dispatcher.add_delegate(plate, DELEGATE());
    assert(dispatcher.get_delegate_driver(plate) == DELEGATE(), 'Delegate should be set');
    
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_remove_delegate_switches_current_driver() {
    let (dispatcher, contract_address) = setup();
    let plate = 'MYCARPLATE';
    let car_model = 'ModelX';
    let telegram_id = 12345_u64;

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.register_car(plate, car_model, telegram_id);
    dispatcher.add_delegate(plate, DELEGATE());
    
    // Switch to delegate
    dispatcher.switch_to_delegate(plate);
    assert(dispatcher.get_current_driver(plate) == DELEGATE(), 'Current driver should be del');

    // Remove delegate - should switch current driver back to owner
    dispatcher.remove_delegate(plate);
    assert(dispatcher.get_current_driver(plate) == OWNER(), 'Current driver should switch');
    
    stop_cheat_caller_address(contract_address);
}