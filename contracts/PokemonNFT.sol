// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pokemon is ERC721, ERC721URIStorage, Ownable {
    string[] uriList = [
        "https://gateway.pinata.cloud/ipfs/QmWYEkCSJ3kUVkNHLmVR77our7F88A9EfurHQPktmAqxDk/Pichu",
        "https://gateway.pinata.cloud/ipfs/QmWYEkCSJ3kUVkNHLmVR77our7F88A9EfurHQPktmAqxDk/Pikachu",
        "https://gateway.pinata.cloud/ipfs/QmWYEkCSJ3kUVkNHLmVR77our7F88A9EfurHQPktmAqxDk/Raichu"
    ];

    uint256 public immutable interval;
    uint256 public lastTimeStamp;

    constructor(uint256 updateInterval) ERC721("Pokemon", "PKM") {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;

        safeMint(msg.sender);
    }

    function safeMint(address to) public onlyOwner {
        _safeMint(to, 0);
        _setTokenURI(0, uriList[0]);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            growPokemon(0);
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function growPokemon(uint256 tokenId) internal {
        if (pokemonStage(tokenId) >= 2) return;

        uint256 val = pokemonStage(tokenId) + 1;
        string memory newUri = uriList[val];

        _setTokenURI(tokenId, newUri);
    }

    function pokemonStage(uint256 tokenId) public view returns (uint256) {
        string memory _uri = tokenURI(tokenId);

        for (uint8 i; i < 3; i++) {
            string memory oldUri = uriList[i];

            if (
                keccak256(abi.encodePacked(_uri)) ==
                keccak256(abi.encodePacked(oldUri))
            ) {
                return i;
            }
        }

        return 0;
    }
}
