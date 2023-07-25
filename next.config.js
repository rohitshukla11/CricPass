/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          //"bafybeibnrasojyzexvr232dnuwyykw4v6mrjrcdn3sggjybfwcyenx7u34.ipfs.nftstorage.link",
          "bafybeif36bbqtdcisp7u72b3mfbyhyfnz45hhkjc6xwlz3heauyilkbiky.ipfs.nftstorage.link",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "nft-cdn.alchemy.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};
