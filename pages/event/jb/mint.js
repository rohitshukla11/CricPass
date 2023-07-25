import Image from "next/image";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Nav from "../../../components/Nav";
import clientPromise from "../../../lib/mongodb";
import { BuyPrimary } from "../../../components/BuyPrimary";
import Stats from "../../../components/Stats";
import IND from '../../../public/india.png'
import PAK from '../../../public/pakistan.png'
import axios from 'axios'

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("testing");
    const event = await db
      .collection("events")
      .find({ slug: "indvspak" })
      .limit(1)
      .toArray();

    var price = await fetch("http://localhost:3000/api/price");
    price = await price.json();

    console.log("event", event);

    return {
      props: {
        data: JSON.parse(JSON.stringify(event)),
        price: price,
      },
    };
  } catch (e) {
    console.error(e);

    return {
      props: {
        client: false,
      },
    };
  }
}

export default function Mint() {

  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    setLoaded(true)
  },[])

  const slug = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('slug')):null;
  let stringWithoutQuotes = slug?.replace(/"/g, '');

  const[slugg,setSlugg]=useState(stringWithoutQuotes);
  const[data,setData]=useState([]);
  const matchTicketCall=async()=>{

    axios.get(`http://localhost:3000/api/event`).then((res)=>{
      console.log(res.data);
      console.log(slugg,"slug")
      let eventsArray = res.data;
      // const filteredData= res.data.filter((item,index)=>{
      //   return item.slug == slug
      // })
      // const filteredData = events.filter((event) => event.slug == slug);
      // var filteredData = events.filter(function(word) { return word.slug == slug} )
      const targetEvent = eventsArray.filter((event) =>{
        console.log(slugg,"slug2")
        console.log(event.slug,"tyoe")
        return event.slug == slugg })
      console.log(targetEvent,"filyer")
      setData(targetEvent)
    }).catch((err)=>{
      console.log(err)
    })
    
  }





  useEffect(()=>{
    matchTicketCall();
    // getServerSideProps()
  },[]);
  const [hasMounted, setHasMounted] = useState();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // if (!hasMounted) return null;

  // console.log(data);

  // const content = data[0];

  // console.log(content);

  // const rawdate = new Date(content.date);
  // const date = `${rawdate.getDate()} ${
  //   month[rawdate.getMonth()]
  // } ${rawdate.getFullYear()}`;



  
// / console.log(content);

  return (
    <>
      {/* <Head>
        <title>{content.name}</title>
      </Head> */}
      {loaded && <div className="main-container">
        <Nav />

        <div className="flex flex-col md:w-2/3 mx-auto gap-6 my-8 ">
          {/* <div className="flex lg:flex-row flex-col px-4 lg:px-0 items-start rounded-md gap-8">
            <div className="xl:w-1/2 w-full gap-6 flex flex-col">
              <Image
                src={`/${content.slug}.jpeg`}
                alt={"Presentation"}
                className="rounded-lg w-auto h-auto shadow-md "
                width={1000}
                height={1600}
                priority
              />
            </div>
            <div className="xl:w-1/2 w-full flex flex-col gap-6">
              <div className="text-2xl font-bold">{content.name}</div>
              <div className="w-full rounded-md text-black bg-slate-50 border-slate-200 border-2 shadow-md p-4">
                <table className="w-full border-none">
                  <thead>
                    <tr>
                      <th colSpan={2}>Event Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="w-fit ">Venue: </td>
                      <td>
                        <div className=" text-clip overflow-hidden">
                          {content.venue}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Date: </td>
                      <td>{date}</td>
                    </tr>
                    <tr>
                      <td>Time: </td>
                      <td>{rawdate.toLocaleTimeString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          <div className="ticketBox">
            <p style={{color:"white",fontSize:"14px"}}>{data[0]?.description}</p>
            <h2 style={{fontSize:"24px",color:"white",fontWeight:"700"}}>{data[0]?.name}</h2>
            <div style={{display:"flex",gap:'20px'}}>
            <Image src={IND} alt="eng" style={{width:"70px"}}/>
            <p style={{fontSize:"16px",fontWeight:"700",color:'#fff'}}>{data[0]?.time} <br/> (Your Time)</p>
            <Image src={PAK} alt="NZ" style={{width:"70px"}}/>
            </div>
            <button style={{backgroundColor:"#fff",color:"#590a78",padding:"20px"}}>Venue Details</button>
            <div>
              <p style={{color:"#fff"}}>{data[0]?.match}<br/>
              {data[0]?.event}<br/>
{data[0]?.venue}</p>
            </div>
          </div>
          <div className="w-full px-4 lg:px-0">
            <div className="gap-6 flex md:flex-row flex-col mx-auto" suppressHydrationWarning={true}>
              <Stats contract={"0x3135085DD00C4cC9d291c081181a788f7C089368"} />
              {/* <Stats contract={"0x52cf0f17db253195d1deda70b31c1485b6ee28b1"} /> */}
            </div>
          </div>
          <div className="w-full px-4 lg:px-0">
            <div className="gap-6 flex flex-col mx-auto">
              <div className="w-full rounded-lg border-slate-200 border-2 shadow-md p-4 bg-slate-50">
                <div className="text-lg mb-2">General Admission Ticket</div>
                <BuyPrimary
                  contract={"0x3135085DD00C4cC9d291c081181a788f7C089368"}
                  price="1500Rs"
                />
              </div>
              {/* <div className="w-full rounded-lg border-slate-200 border-2 shadow-md p-4 bg-slate-50">
                <div className="text-lg mb-2">VIP Experience Ticket</div>
                <BuyPrimary
                  contract={"0x52Cf0f17dB253195d1DEDA70b31c1485B6Ee28B1"}
                  price={price}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div> }
    </>
  );
}
