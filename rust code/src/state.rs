use anchor_lang::prelude::*;

#[account]
pub struct Master {
    pub last_bet_id: u64,
}
#[account]
pub struct Bet {
    pub id: u64,                             //unique id
    pub amount: u64,                         //cost of bet in lamports
    pub prediction_a: BetPrediction,         //makers's prediction
    pub prediction_b: Option<BetPrediction>, //takers's prediction
    pub state: BetState,                     //curr state of bet
    pub pyth_price_key: Pubkey,              //pyth price oracle account
    pub expiry_ts: i64                      //expiry time stamp(UNIX TS) of bet
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BetPrediction {
    pub player: Pubkey, //the address of bet
    pub price: f64,     //predicted price in USD
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum BetState {
    Created,
    Started,
    PlayerAWon,
    PlayerBWon,
    Draw,
}
