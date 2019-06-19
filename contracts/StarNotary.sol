pragma solidity >=0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
    struct Star {
        string name;
    }

    mapping(uint256 => Star) public starTokenMap;

    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory star = Star(_name);
        starTokenMap[_tokenId] = star;
        _mint(msg.sender, _tokenId);
    }

    function putUpForSale(uint256 _tokenId, uint256 price) public {
        require(ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = price;
    }

    function make_payable(address addr) internal pure returns (address payable) {
        return address(uint160(addr));
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "token is not up for sale");
        address owner = ownerOf(_tokenId);
        uint256 starCost = starsForSale[_tokenId];
        address buyer = msg.sender;
        address payable buyerPayable = make_payable(buyer);
        require(msg.value >= starCost, "don't have enough ether");
        _transferFrom(owner, buyer, _tokenId);
        address payable ownerPayable = make_payable(owner);
        ownerPayable.transfer(starCost);
        buyerPayable.transfer(msg.value - starCost);

    }

}
