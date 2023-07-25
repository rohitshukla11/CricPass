import clientPromise from "../lib/mongodb";
import Head from "next/head";
import Nav from "../components/Nav";
import EventList from "../components/EventList";
import { useState, useEffect } from "react";
import Eng from '../public/england.png'
import NZ from '../public/new-zealand.png'
import AUS from '../public/australia.png'
import IND from '../public/india.png'
import PAK from '../public/pakistan.png'
import Image from "next/image";
import { useNavigate } from "react-router-dom";


export default function Events({ events }) {

  // let navigate = useNavigate(); 
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

  for (let i = 0; i < events.length; i++) {
    // console.log(data[i].date);

    const rawdate = new Date(events[i].date);
    // console.log(rawdate);
    const d = rawdate.getDate();
    const m = month[rawdate.getMonth()];
    const y = rawdate.getFullYear();

    events[i].date = d + " " + m + " " + y;

    // console.log(featured, expo, concert, run);
  }

  const max = events.length;

  const [total, setTotal] = useState(6);

  const [evts, setEvts] = useState(events.slice(0, 6));

  useEffect(() => {
    if (total) {
      setEvts(events.slice(0, total));
    }
  }, [total, events]);

  function loadMore() {
    setTotal(total + 10);
  }

  const openTicket=(slug)=>{
    localStorage.setItem('slug',JSON.stringify(slug))
    window.location.href="/event/jb/mint"
  }
  return (
    <>
      <Head>
        <title>Fixtures | CricPass</title>
      </Head>
      <div className="main-container">
        <Nav />
        <div className="flex flex-col md:w-2/3 md:mx-auto gap-6 mt-4 ">
          {/* <div className="w-full text-lg font-semibold px-4 md:px-0 ">
            <div className="text-2xl font-bold">Fixtures</div>
          </div> */}
          {/* <EventList events={evts} />
          {total < max && (
            <div className="-my-2 flex w-full justify-center ">
              <div className="btn btn-primary w-fit" onClick={loadMore}>
                Load More
              </div>
            </div>
          )} */}
          <div style={{width:"100%",height:"145px",display:"flex",border:"1px solid #d9d9d9",justifyContent:"space-between",backgroundColor:"#fff"}} onClick={(e)=>openTicket(e)}>
              <div style={{display:"flex",flexDirection:"column",padding: "30px"}}>
              <p style={{color:"#590a78",fontSize:"18px"}}>Thursday 05 October</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>(YOUR TIME)</span></p>
              <p style={{color:"#000",fontSize:"12px"}}>Narendra Modi Stadium, Ahmedabad</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>THU 05 OCTOBER (LOCAL)</span></p>
              <p></p>
              </div>
              <div style={{display:"flex",flexDirection:"column",padding: "30px",gap:"20px"}}>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={Eng} alt="eng" style={{width:"30px"}}/>ENGLAND</h2>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={NZ} alt="NZ" style={{width:"30px"}}/>NEWZELAND</h2>
              </div>
              <div className="buyTick" style={{textAlign:"center",alignItems:"center",border:"1px solid #d9d9d9",padding:"10px 20px",display:"flex",transition: "0.3s"}}>
               <button onClick={()=>openTicket("engvsnz")}>Book Tickets</button>
              </div>
          </div>
          <div style={{width:"100%",height:"145px",display:"flex",border:"1px solid #d9d9d9",justifyContent:"space-between",backgroundColor:"#fff"}}>
              <div style={{display:"flex",flexDirection:"column",padding: "30px"}}>
              <p style={{color:"#590a78",fontSize:"18px"}}>Sunday 08 October</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>(YOUR TIME)</span></p>
              <p style={{color:"#000",fontSize:"12px"}}>MA Chidambaram, Chennai</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>SUN 08 OCTOBER (LOCAL)</span></p>
              <p></p>
              </div>
              <div style={{display:"flex",flexDirection:"column",padding: "30px",gap:"20px"}}>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={IND} alt="eng" style={{width:"30px"}}/>INDIA</h2>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={AUS} alt="NZ" style={{width:"30px"}}/>AUSTRALIA</h2>
              </div>
              <div className="buyTick" style={{textAlign:"center",alignItems:"center",border:"1px solid #d9d9d9",padding:"10px 20px",display:"flex",transition: "0.3s"}}>
               <button onClick={()=>openTicket("indvsaus")}>Book Tickets</button>
              </div>
          </div>
          <div style={{width:"100%",height:"145px",display:"flex",border:"1px solid #d9d9d9",justifyContent:"space-between",backgroundColor:"#fff"}}>
              <div style={{display:"flex",flexDirection:"column",padding: "30px"}}>
              <p style={{color:"#590a78",fontSize:"18px"}}>Thursday 15 October</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>(YOUR TIME)</span></p>
              <p style={{color:"#000",fontSize:"12px"}}>Narendra Modi Stadium, Ahmedabad</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>THU 15 OCTOBER (LOCAL)</span></p>
              <p></p>
              </div>
              <div style={{display:"flex",flexDirection:"column",padding: "30px",gap:"20px"}}>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={IND} alt="eng" style={{width:"30px"}}/>INDIA</h2>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={PAK} alt="NZ" style={{width:"30px"}}/>PAKISTAN</h2>
              </div>
              <div className="buyTick" style={{textAlign:"center",alignItems:"center",border:"1px solid #d9d9d9",padding:"10px 20px",display:"flex",transition: "0.3s"}}>
               <button onClick={()=>openTicket("indvspak")}>Book Tickets</button>
              </div>
          </div>
          <div style={{width:"100%",height:"150px",display:"flex",border:"1px solid #d9d9d9",justifyContent:"space-between",backgroundColor:"#fff"}}>
              <div style={{display:"flex",flexDirection:"column",padding: "30px"}}>
              <p style={{color:"#590a78",fontSize:"18px"}}>Sunday 22 October</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>(YOUR TIME)</span></p>
              <p style={{color:"#000",fontSize:"12px"}}>HPCA Stadium, Dharamshala, Himachal Pradesh</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>SUN 22 OCTOBER (LOCAL)</span></p>
              <p></p>
              </div>
              <div style={{display:"flex",flexDirection:"column",padding: "30px",gap:"20px"}}>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={IND} alt="eng" style={{width:"30px"}}/>INDIA</h2>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={NZ} alt="NZ" style={{width:"30px"}}/>NEWZELAND</h2>
              </div>
              <div className="buyTick" style={{textAlign:"center",alignItems:"center",border:"1px solid #d9d9d9",padding:"10px 20px",display:"flex",transition: "0.3s"}}>
               <button onClick={()=>openTicket("indvsnz")}>Book Tickets</button>
              </div>
          </div>
          <div style={{width:"100%",height:"150px",display:"flex",border:"1px solid #d9d9d9",justifyContent:"space-between",backgroundColor:"#fff"}}>
              <div style={{display:"flex",flexDirection:"column",padding: "30px"}}>
              <p style={{color:"#590a78",fontSize:"18px"}}>Sunday 29 October</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>(YOUR TIME)</span></p>
              <p style={{color:"#000",fontSize:"12px"}}>Ekana Cricket Stadium, Lucknow</p>
              <p  style={{fontWeight:"700",color:"#590a78",}}>14:00 <span style={{color:"gray"}}>SUN 29 OCTOBER (LOCAL)</span></p>
              <p></p>
              </div>
              <div style={{display:"flex",flexDirection:"column",padding: "30px",gap:"20px"}}>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={IND} alt="eng" style={{width:"30px"}}/>INDIA</h2>
                <h2 style={{display:"flex",gap:"10px"}}><Image src={Eng} alt="NZ" style={{width:"30px"}}/>ENGLAND</h2>
              </div>
              <div className="buyTick" style={{textAlign:"center",alignItems:"center",border:"1px solid #d9d9d9",padding:"10px 20px",display:"flex",transition: "0.3s"}}>
               <button onClick={()=>openTicket("indvseng")}>Book Tickets</button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("testing");

    const events = await db.collection("events").find({}).limit(50).toArray();

    return {
      props: { events: JSON.parse(JSON.stringify(events)) },
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
