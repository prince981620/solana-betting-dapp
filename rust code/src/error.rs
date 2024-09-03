use anchor_lang::prelude::*;

#[error_code]
pub enum BetError {
    #[msg("Cannot Enter")]
    CannotEnter,
    #[msg("Cannot Claim")]
    CannotClaim,
    #[msg("Cannot Enter")]
    CannotClose,
    #[msg("Given key for Pyth does not match")]
    InvalidPythKey,
    #[msg("Invalid Puth Account")]
    InvalidPythAccount,
    #[msg("Price is too bug to parse tp u32")]
    PriceTooBig,
}