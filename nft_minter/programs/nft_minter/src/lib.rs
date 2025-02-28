use anchor_lang::prelude::*;

declare_id!("9m1YJ2BBePioK11U6JD5YST3Xamj3dGaGFCpZ33eyiVQ");

#[program]
pub mod nft_minter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
