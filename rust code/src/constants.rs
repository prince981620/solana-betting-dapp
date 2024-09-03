use anchor_lang::solana_program::clock::UnixTimestamp;

pub const MASTER_SEED: &[u8] = b"master";
pub const BET_SEED: &[u8] = b"bet";

// closer the time of expiry more the player has chanse to win

pub const MINIUM_REMAINING_TIME_UNTIL_EXPIRY: UnixTimestamp = 120;

pub const MAXIMUM_CLAIMABLE_PERIOD: UnixTimestamp = 300;
