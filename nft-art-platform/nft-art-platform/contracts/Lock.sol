// contracts/ArtNFT.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ArtNFT is ERC721URIStorage {
    uint256 public tokenIdCounter;

    constructor() ERC721("ArtNFT", "ART") {}

    function createNFT(string memory _tokenURI) public returns (uint256) {
        uint256 newTokenId = tokenIdCounter++;
        _mint(msg.sender, newTokenId);  // Mint the NFT to the caller (artist)
        _setTokenURI(newTokenId, _tokenURI);  // Set the token's metadata URI (Arweave URL)
        return newTokenId;
    }
}
