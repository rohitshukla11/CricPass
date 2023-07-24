// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10;
import {ERC721} from "./ERC721.sol";
import "./Math.sol";

error MintPriceNotPaid();
error MaxSupply();
error NonExistentTokenURI();
error WithdrawTransfer();
error LimitPerPersonReached(uint256 limit, uint256 bought);
abstract contract ReentrancyGuard {
    
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

   
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
            require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
              _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
         _status = _NOT_ENTERED;
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(_msgSender());
    }

  
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    
    function owner() public view virtual returns (address) {
        return _owner;
    }

   
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

   
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

library Strings {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = Math.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, Math.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }
}
contract CricTicket is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;
    string public baseURI;
    string public baseExtension = ".json";
    uint256 public currentTokenId;
    uint256 public constant TOTAL_SUPPLY = 50000;
    uint256 public constant TICKET_PRICE = 0.01 ether;
    uint256 public constant LIMIT_PER_PERSON = 2;

   constructor() ERC721("CricTicket", "CricTicket") {
        baseURI = "ipfs://bafybeidhngmbk5oam3uqs33g5k2cbddiqums4sifoycbfqa6l562gkahri/";
    }

    function buyPrimary(
        address recipient,
        uint256 quantity
    ) public payable returns (uint256) {
        if (msg.value != TICKET_PRICE * quantity) {
            revert MintPriceNotPaid();
        }

        if (_balanceOf[msg.sender] + quantity > LIMIT_PER_PERSON) {
            revert LimitPerPersonReached({
                limit: LIMIT_PER_PERSON,
                bought: _balanceOf[msg.sender] + quantity
            });
        }

        uint256 newTokenId = currentTokenId + quantity;

        if (newTokenId > TOTAL_SUPPLY) {
            revert MaxSupply();
        }

        for (uint256 i = 1; i <= quantity; i++) {
            _safeMint(recipient, ++currentTokenId);
        }
        return newTokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert NonExistentTokenURI();
        }
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension))
                : "";
    }

    function withdrawAll(
        address payable payee
    ) external nonReentrant onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = payee.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer();
        }
    }
}
