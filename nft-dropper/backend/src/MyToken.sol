// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";


import "@chainlink/data-feeds/interfaces/AggregatorV3Interface.sol";




error InsufficientPayment();
error TransferFailed();
error NotOwner();
error RefundFailed();

contract MyToken is ERC721, Ownable, ERC721Burnable {

   mapping(uint256 => uint256) public tokenFees;
     
    uint256 private _nextTokenId;
    AggregatorV3Interface internal priceFeed;

    constructor() ERC721("MyToken", "MTK") Ownable(msg.sender) {
        // ETH/USD Chainlink price feed on Sepolia
        priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    uint256 public usdMintPrice = 25 * 1e16; //$0.25

    function mint() public payable {
        // Get latest ETH/USD price from Chainlink (8 decimals)
        (, int256 price,,,) = priceFeed.latestRoundData();
        require(price > 0, "Invalid ETH price");

        // Calculate required ETH for $1 in wei
        uint256 ethPrice = uint256(price); // 8 decimals
        uint256 requiredETH = (usdMintPrice * 1e8) / ethPrice;

        if (msg.value < requiredETH) {
            revert InsufficientPayment();
         }

        uint256 tokenId = _nextTokenId++;     
        _mint(msg.sender, tokenId);
       tokenFees[tokenId] = msg.value;

    
        (bool sent, ) = owner().call{value: msg.value}("");
        if (!sent) {
            revert TransferFailed();
        }
    }

    function BurnAndRefund(uint256 tokenId) external   {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotOwner();
        }
        uint256 refund = tokenFees[tokenId];
        _burn(tokenId);

        (bool sent, ) = msg.sender.call{value: refund}("");
        if (!sent) {
            revert RefundFailed();
        }

    }

    // For frontend use
    function getLatestPrice() public view returns (int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
