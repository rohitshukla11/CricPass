// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.10;

import {ERC721} from "./ERC721.sol";
import {SafeTransferLib} from "./SafeTransferLib.sol";


contract NFTMarketplace  {
    error Unauthorized();
    error NotOwned();
    error WrongValueSent();
    error ListingNotFound();
    error OwnedListing();
    error NoAskingPrice();

    event NewListing(ERC721 tokenContract, uint256 tokenId, address indexed creator, uint256 askPrice);
    event ListingRemoved(uint256 listingId);
    event ListingBought(address indexed buyer, uint256 listingId);

    uint256 public saleCounter = 1;

    struct Listing {
        ERC721 tokenContract;
        uint256 tokenId;
        address creator;
        uint256 askPrice;
    }

    mapping(uint256 => Listing) public listings;

    function createListing(ERC721 tokenContract, uint256 tokenId, uint256 askPrice) public returns (uint256) {
        if (msg.sender != tokenContract.ownerOf(tokenId)) revert NotOwned();
        if (askPrice == 0) revert NoAskingPrice();

        Listing memory listing = Listing({
            tokenContract: tokenContract,
            tokenId: tokenId,
            askPrice: askPrice,
            creator: msg.sender
        });

        listings[saleCounter] = listing;
        emit NewListing(tokenContract, tokenId, msg.sender, askPrice);

        return saleCounter++;
    }


    function buyListing(uint256 listingId) public payable {
        Listing memory listing = listings[listingId];
        if (msg.sender == listing.creator) revert OwnedListing();
        if (listing.creator == address(0)) revert ListingNotFound();
        if (listing.askPrice != msg.value) revert WrongValueSent();

        delete listings[listingId];
        emit ListingBought(msg.sender, listingId);

        SafeTransferLib.safeTransferETH(listing.creator, listing.askPrice);
        listing.tokenContract.transferFrom(listing.creator, msg.sender, listing.tokenId);
    }

    
    function removeListing(uint256 listingId) public {
        Listing memory listing = listings[listingId];
        if (listing.creator != msg.sender) revert Unauthorized();

        delete listings[listingId];
        emit ListingRemoved(listingId);
    }
}