/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, Suspense } from "react";
import Head from "next/head";
import Nav from "../components/Nav";
import { useContractRead } from "wagmi";
import marketabi from "../contracts/abi/marketplace.json";
import Link from "next/link";
import Image from "next/image";
import { list } from "postcss";

function marketplace({ price }) {
  // const [items, setItems] = useState();
  const [hasMounted, setHasMounted] = useState(false);
  const marketplaceAdd = "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc";
  const gweiToEth = 1000000000000000000;

  const marketConfig = {
    address: marketplaceAdd,
    abi: marketabi,
  };

  let { data: counter } = useContractRead({
    ...marketConfig,
    functionName: "saleCounter",
  });
  counter = parseInt(counter);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  var i = 0,
    j = 0,
    listing = [];

  while (i <= counter) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: listed } = useContractRead({
      ...marketConfig,
      functionName: "getListing",
      args: [i],
    });

    // console.log(listed);

    if (
      (listed && listed[0] == "0x3135085DD00C4cC9d291c081181a788f7C089368") ||
      (listed && listed[0] == "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1")
    ) {
      //console.log(listed);
      listing[j] = listed;
      j++;
    }

    i++;
  }

  // console.log(listing[0]);

  // console.log("listing", listed);

  if (!hasMounted) return null;

  return (
    <>
      <Head>
        <title>Marketplace | CricPass</title>
      </Head>
      <div className="main-container">
        <Nav />

        <Suspense fallback={<>Loading...</>}>
          <div className=" md:w-2/3 md:mx-auto text-black mt-4 flex flex-col gap-6  mx-4 mb-8">
            {/* <div className="text-2xl font-bold">Marketplace</div> */}

            <div className="w-full flex md:flex-row flex-col flex-wrap">
              {listing.map((item) => (
                <div
                  className="md:w-1/2 lg:w-1/3 w-full p-2"
                  key={item.tokenContract && item.tokenId}
                >
                  <div className=" rounded-xl text-black bg-neutral-50 border-slate-200 border-2 shadow-md flex-col">
                    <Image
                      src={
                        (item.tokenContract ==
                          "0x3135085DD00C4cC9d291c081181a788f7C089368" &&
                          "https://bafybeif36bbqtdcisp7u72b3mfbyhyfnz45hhkjc6xwlz3heauyilkbiky.ipfs.nftstorage.link/")
                      }
                      width={2000}
                      height={2000}
                      className="rounded-t-xl"
                      alt="Ticket Image"
                      priority
                    />
                    <div className="p-4 flex flex-col gap-2 text-sm">
                      <div className="font-bold text-lg">
                        {(item.tokenContract ==
                          "0x3135085DD00C4cC9d291c081181a788f7C089368" &&
                          `INDIA Vs PAKISTAN`) ||
                          (item.tokenContract ==
                            "0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1" &&
                            `JBVIP #${item.tokenId}`)}
                      </div>
                      <div className="flex flex-row gap-4 truncate items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex-none"></div>
                        <Link
                          href={`account/${item.creator}`}
                          className="hover:underline truncate"
                        >
                          {item.creator.slice(0, 6) +
                            "..." +
                            item.creator.slice(-6)}
                        </Link>
                      </div>
                      <div className="flex flex-row gap-2">
                        <div>Token ID: </div>
                        <div>{parseInt(item.tokenId)}</div>
                      </div>

                      <div className="font-semibold">
                        {parseInt(item.askPrice) / gweiToEth} ETH ~ RM
                        {(
                          (parseInt(item.askPrice) / gweiToEth) *
                          price
                        ).toFixed(2)}
                      </div>

                      <Link
                        href={`${item.tokenContract.toLowerCase()}/${
                          item.tokenId
                        }`}
                      >
                        <div className="btn btn-primary w-full">Buy Ticket</div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Suspense>
      </div>
    </>
  );
}

export default marketplace;

export async function getServerSideProps() {
  var data = await fetch("http://localhost:3000/api/price");
  data = await data.json();

  // console.log(data);

  return {
    props: {
      price: data,
    },
  };
}
