import React, { useState, useEffect } from "react";

export default function Transaction({ transactions }) {
  const weiToEth = 1000000000000000000;
  const [total, setTotal] = useState(6);

  var record = transactions.result;

  console.log(record.length);
  const [items, setItems] = useState(record.slice(0, total));

  useEffect(() => {
    if (total) {
      setItems(record.slice(0, total));
    }
  }, [total, record]);

  function loadMore() {
    setTotal(total + 6);
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="text-lg font-bold pb-3">List of Transactions </div>
        <table className="mb-3 table truncate w-screen sm:w-auto overflow-x-auto">
          <thead>
            <tr>
              <th className="w-1/5">Hash</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="ticket" key={item.hash}>
                <td>{item.hash.slice(0, 8) + "..." + item.hash.slice(-6)}</td>
                <td>
                  {item.to_address ==
                    "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc" &&
                    item.value != 0 &&
                    "Buy Secondary"}
                  {item.to_address ==
                    "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc" &&
                    item.value == 0 &&
                    "List/Delist"}
                  {(item.to_address ==
                    "0x3135085DD00C4cC9d291c081181a788f7C089368" ||
                    item.to_address ==
                      "0x52cf0f17db253195d1deda70b31c1485b6ee28b1") &&
                    item.value != 0 &&
                    "Buy Primary"}
                  {(item.to_address ==
                    "0x3135085DD00C4cC9d291c081181a788f7C089368" ||
                    item.to_address ==
                      "0x52cf0f17db253195d1deda70b31c1485b6ee28b1") &&
                    item.value == 0 &&
                    "Approve Marketplace"}
                  {item.to_address !=
                    "0x6B74FF75C141B8f6fdf5A0BD5674812C2B607ACc" &&
                    item.to_address !=
                      "0x3135085DD00C4cC9d291c081181a788f7C089368" &&
                    item.to_address !=
                      "0x52cf0f17db253195d1deda70b31c1485b6ee28b1" &&
                    "External Transaction"}
                </td>
                <td>
                  {item.from_address.slice(0, 6) +
                    "..." +
                    item.from_address.slice(-4)}
                </td>
                <td>
                  {item.to_address &&
                    item.to_address?.slice(0, 6) +
                      "..." +
                      item.to_address?.slice(-4)}
                  {!item.to_address && " "}
                </td>
                <td>{item.value / weiToEth} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total < record.length ? (
        <div className=" flex justify-center mb-6">
          <div className="btn btn-primary w-fit" onClick={loadMore}>
            Load More
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
