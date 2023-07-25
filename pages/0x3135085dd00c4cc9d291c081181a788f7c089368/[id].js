import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Network, Alchemy } from "alchemy-sdk";
import Image from "next/image";
import Nav from "../../components/Nav";
import { useContractRead, useAccount, useConnect, useDisconnect } from "wagmi";
import abi from "../../contracts/abi/testabi.json";
import marketabi from "../../contracts/abi/marketplace.json";
import Link from "next/link";
import { ApproveButton } from "../../components/ApproveButton";
import { ListButton } from "../../components/ListButton";
import { DelistButton } from "../../components/DelistButton";
import Head from "next/head";
import { BuySecondaryButton } from "../../components/BuySecondary";

export default function Ticket({ data, transfer }) {


 const path = window.location.pathname;
 const urlParts = path.split('/');

// Get the last part of the URL (which is the value you want)
const lastValue = urlParts[urlParts.length - 1];

console.log(lastValue);
 console.log(path,"path")
  console.log("data", data);
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { id } = router.query;
  const [hasMounted, setHasMounted] = useState(false);
  const contractAddress = "0x3135085DD00C4cC9d291c081181a788f7C089368";
  const marketplaceAdd = "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc";
  // console.log(data);
  const metadata = data;
  const gweiToEth = 1000000000000000000;
  const trans = transfer?.result;
  // console.log(transfer);
const [ownedData,setOwnedData]=useState();
  useEffect(()=>{
    const owned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('owned')):null;
    console.log("owned",owned)
   
    setOwnedData(owned)
  },[])

  var imageLink = "https://bafybeif36bbqtdcisp7u72b3mfbyhyfnz45hhkjc6xwlz3heauyilkbiky.ipfs.nftstorage.link/"; // placeholder // empty image

  const contractConfig = {
    address: contractAddress,
    abi: abi,
  };

  const marketConfig = {
    address: marketplaceAdd,
    abi: marketabi,
  };

  let { data: counter } = useContractRead({
    ...marketConfig,
    functionName: "saleCounter",
  });
  counter = parseInt(counter);

  var i = 0,
    listingId;

  // // console.log(listed);

  while (i < counter) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: listed } = useContractRead({
      ...marketConfig,
      functionName: "getListing",
      args: [i],
    });

    // console.log(listed);

    if (
      listed &&
      listed[0] == "0x3135085DD00C4cC9d291c081181a788f7C089368" &&
      parseInt(listed[1]) == id
    ) {
      listingId = i;
    }

    i++;
  }

  // console.log(listingId);

  let { data: owner } = useContractRead({
    ...contractConfig,
    functionName: "ownerOf",
    args: [id],
  });

  const { data: approved } = useContractRead({
    ...contractConfig,
    functionName: "getApproved",
    args: [id],
  });

  const { data: currentId } = useContractRead({
    ...contractConfig,
    functionName: "currentTokenId",
  });

  var curr = Number(currentId);
  // console.log(approved);

  const { data: ticketPrice } = useContractRead({
    ...contractConfig,
    functionName: "TICKET_PRICE",
  });
console.log("metadata", metadata);
  // if (metadata) {
  //   imgSrc = metadata.image.slice(7);
  //   imgLink = imgSrc.split("/");
  //   imageLink = `https://` + imgLink[0] + `.ipfs.nftstorage.link/` + imgLink[1];
  // }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  if (id > curr) {
    return (
      <>
        <Head>
          <title>Ticket Not Found</title>
        </Head>
        <div className="font-sans bg-slate-50 min-h-screen min-w-screen text-black ">
          <Nav />
          <div className="h-[90vh] w-full grid place-content-center ">
            <div className="w-full text-2xl">Ticket Not Found</div>
          </div>
        </div>
      </>
    );
  }

  if (id < curr && !metadata) {
    router.reload();

    return (
      <div className="font-sans bg-slate-50 min-h-screen min-w-screen text-black ">
        <Nav />
        <div className="h-[90vh] w-full grid place-content-center ">
          <div className="w-full text-2xl">Loading</div>
        </div>
      </div>
    );
  }


  const filteredData = ownedData?.filter((own) => own.tokenId == lastValue)
  console.log(filteredData,"filtered Data")

  return (
    <>
      <Head>
        <title>{filteredData[0]?.title}</title>
      </Head>
      <div className="font-sans bg-slate-50 min-h-screen min-w-screen text-black pb-10">
        <Nav />
        <div className=" flex flex-col md:w-2/3 mx-auto gap-6 mt-8 ">
          <div className="flex md:flex-row flex-col px-4 md:px-0 items-start rounded-md gap-8">
            <div className="lg:w-1/2 w-full gap-6 flex flex-col">
              <Image
                src={imageLink}
                alt={"Presentation"}
                className="rounded-lg w-auto h-auto shadow-md order-1"
                width={1000}
                height={1600}
                priority
              />
            </div>
            <div className="lg:w-1/2 w-full gap-6 flex flex-col">
              <div className="flex flex-col gap-3 ">
                <div className="text-base">
                  {/* Justin Bieber Justice World Tour in KL */}
                  {filteredData[0]?.description}
                </div>
                <div className="text-4xl font-bold lin">
                {filteredData[0]?.title}
                </div>
                <div className="flex flex-row gap-3">
                  <div>Owner: </div>
                  <Link href={`/account/${owner}`} className="hover:underline">
                    {owner
                      ? owner.slice(0, 6) + "..." + owner.slice(-6)
                      : "0x000"}
                  </Link>
                </div>
              </div>
              <div className="w-full rounded-md border-slate-200 border-2 shadow-md flex flex-col justify-between p-4 gap-3 ">
                <div className="text-base">Last Purchase: </div>
                <div className="text-4xl font-bold">
                  {ticketPrice ? ticketPrice / gweiToEth : "0.00"} ETH
                </div>
                {/* List Button */}
                {owner === address &&
                  approved != "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc" && (
                    <ApproveButton contract={contractAddress} tokenid={id} />
                  )}
                {/* <ApproveButton contract={contractAddress} tokenid={id} /> */}
                {owner === address &&
                  approved == "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc" &&
                  !listingId && (
                    <ListButton contract={contractAddress} tokenid={id} />
                  )}
                {listingId && owner === address && (
                  <DelistButton listingid={listingId} />
                )}
                {listingId && address !== owner && isConnected && (
                  <BuySecondaryButton
                    listingId={listingId}
                    price={ticketPrice}
                  />
                )}
              </div>
              <div className="rounded-md border-slate-200 border-2 shadow-md p-4 flex flex-col gap-3">
                <div className="text-lg font-bold">Ticket Detail</div>
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>Contract Address: </div>
                  <div>
                    <a
                      target={"_blank"}
                      rel="noreferrer"
                      href={`https://goerli.etherscan.io/address/${contractAddress}`}
                      className="truncate"
                    >
                      {contractAddress.slice(0, 8) +
                        "..." +
                        contractAddress.slice(-8)}
                    </a>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>Token ID: </div>
                  <div>{id}</div>
                </div>
              </div>
            </div>
          </div>
          {trans && (
            <div className="rounded-md border-slate-200 border-2 shadow-md p-4 gap-3 flex flex-col overflow-x-auto mx-4 md:m-0 order-5">
              <div className="text-lg font-bold">Ticket Activity</div>
              <table className="w-full">
                <thead>
                  <tr className="text-left ">
                    <th className="w-fit">Event</th>
                    <th className="">Transaction</th>
                    <th className="">From</th>
                    <th className="">To</th>
                    <th className="">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {trans.map((log) => (
                    <tr
                      key={log.transaction_hash}
                      className="hover:bg-slate-50 truncate"
                    >
                      <td className="">
                        {log.from_address ==
                          "0x0000000000000000000000000000000000000000" &&
                          "Buy Primary"}
                        {log.to_address ==
                          "0x0000000000000000000000000000000000000000" &&
                          "Burn"}
                        {log.from_address !=
                          "0x0000000000000000000000000000000000000000" &&
                          log.value / gweiToEth > 0 &&
                          "Buy Secondary"}
                        {log.to_address !=
                          "0x0000000000000000000000000000000000000000" &&
                          log.value / gweiToEth == 0 &&
                          "Transfer"}
                      </td>
                      <td className="">
                        <Link
                          className="underline hover:text-blue-900"
                          href={`https://goerli.etherscan.io/tx/${log.transaction_hash}`}
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {log.transaction_hash.slice(0, 6) +
                            "..." +
                            log.transaction_hash.slice(-4)}
                        </Link>
                      </td>
                      <td className="">
                        <Link
                          href={`account/${log.from_address}`}
                          className="hover:underline"
                        >
                          {log.from_address.slice(0, 4) +
                            "..." +
                            log.from_address.slice(-4)}{" "}
                        </Link>
                      </td>
                      <td className="">
                        <Link
                          href={`account/${log.to_address}`}
                          className="hover:underline"
                        >
                          {log.to_address.slice(0, 4) +
                            "..." +
                            log.to_address.slice(-4)}
                        </Link>
                      </td>
                      <td className="">{log.value / gweiToEth} ETH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: Network.ETH_GOERLI,
    };

    const alchemy = new Alchemy(settings);

    const contract = "0x3135085dd00c4cc9d291c081181a788f7c089368";

    // Print NFT metadata returned in the response:
    let response = await alchemy.nft.getNftMetadata(contract, params.id);
    // console.log(response);

    const res = await fetch(
      `http://localhost:3000/api/transfer/jbga/${params.id}`
    );
    const trans = await res.json();

    if (!trans) {
      return {
        notFound: true,
      };
    }

    if (!response.tokenUri) {
      return {
        props: {
          notFound: true,
        },
      };
    } else {
      response = response.rawMetadata;

      return {
        props: {
          data: response,
          transfer: trans,
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      notFound: true,
    },
  };
}
