// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//Functions to help with strings
import {StringUtils} from "./libraries/StringUtils.sol";
import {Base64} from "./libraries/Base64.sol";

contract NFT is ERC721URIStorage {
    constructor() ERC721("Message", "MSG") {
        //Used to start with id of 1 when minting.
        _tokenIds.increment();
    }

    //Counter for nft tokend ids
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //svg model so we can insert our message and create a beatiful image with ou message inside.
    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs>thales.tales<text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = "</text></svg>";
    // get all nftHolder and their token id nft
    mapping(address => uint256) public nftHolders;
    //token id to the json so you can check it out your nft

    struct NFTItem {
        string tokenUri;
        address owner;
    }
    mapping(uint256 => NFTItem) private idToNFTItem;
    event NFTMinted(address sender, uint256 tokenId);

    function mintNFT(
        string memory message,
        bytes32 hashMessage,
        bytes memory signature
    ) public {
        //call the function to verify from who the message is signed
        address isSigned = this.isMessageSigned(hashMessage, signature);
        //verify if it's signed by msg.sender
        require(
            isSigned == msg.sender,
            "msg.sender is not the signer of the message"
        );

        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, message, svgPartTwo)
        );
        uint256 newItemId = _tokenIds.current();
        uint256 length = StringUtils.strlen(message);
        string memory strLen = Strings.toString(length);
        //finishing our svg with our message inside
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                message,
                '", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","length":"',
                strLen,
                '"}'
            )
        );
        //finishing our tokenURI
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        //minting NFT
        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);
        //Adding information to the mapping id => tokenUri
        idToNFTItem[newItemId] = NFTItem(finalTokenUri, msg.sender);
        //Adding information to the mapping address => id
        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();

        emit NFTMinted(msg.sender, newItemId);
    }

    function isMessageSigned(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            bytes memory prefix = "\x19Ethereum Signed Message:\n32";
            bytes32 prefixedHashMessage = keccak256(
                abi.encodePacked(prefix, hash)
            );
            //returns signer of the message
            address signer = ecrecover(prefixedHashMessage, v, r, s);

            return signer;
        }
    }

    // get all NFTs minted
    function fetchNFTs() public view returns (NFTItem[] memory) {
        uint totalItemCount = _tokenIds.current();

        uint currentIndex = 0;
        NFTItem[] memory items = new NFTItem[](totalItemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            uint currentId = i + 1;
            NFTItem memory currentItem = idToNFTItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }
}