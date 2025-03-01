use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::{self, AssociatedToken};

declare_id!("Fg6PaFpoGXkYcM4v6Zv9G5z7nA7eZXx9sFgT8QpVZ4pM");  // Temporary program ID

#[program]
pub mod nft_minter {
    use super::*;

    //minting nft
    pub fn mint_nft(
        ctx: Context<MintNFT>,
        uri: String, // Arweave or IPFS URL for metadata
    ) -> Result<()> {
        let mint = &ctx.accounts.mint;
        let authority = &ctx.accounts.authority;
        let token_account = &ctx.accounts.token_account;

        let cpi_accounts = MintTo {
            mint: mint.to_account_info(),
            to: token_account.to_account_info(),
            authority: authority.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::mint_to(cpi_ctx, 1)?;

        msg!("NFT Minted: {}", uri);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(init, payer = authority, mint::decimals = 0, mint::authority = authority)]
    pub mint: Account<'info, Mint>,
    #[account(init, payer = authority, associated_token::mint = mint, associated_token::authority = authority)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}
