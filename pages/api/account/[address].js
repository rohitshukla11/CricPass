import { Network, Alchemy } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { address } = req.query;

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  // Print all NFTs returned in the response:
  const response = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [
      "0x3135085DD00C4cC9d291c081181a788f7C089368",
      "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1",
    ],
  });

  //   console.log(response);

  res.status(200).json(response);
};
