import { useEffect, useState } from "react";
import  logo from "./assets/logo.png";
import { invoke } from "@tauri-apps/api/core";
import {RemindCard, RemindInfo} from "./components/myui/remindcard"
import { Button } from "./components/ui/button";
import { BadgePlus } from "lucide-react"
import DialogRemind from "./components/myui/dialogRemind";
import { useNextRemindTimer } from "./components/hooks/userNextRemindTimer";
import "./App.css";



function App() {

  
  const [remindList,setRemindList] = useState<RemindInfo[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  useNextRemindTimer(remindList)
  useEffect(()=>{
    invoke<RemindInfo[]>('get_reminds').then((res :RemindInfo[])=>
    {
      const sorted = [...res].sort((a, b) => {
      const parseDate = (str: string) => {
        const [datePart, timePart] = str.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute);
      };

      const dateA = parseDate(a.time.HumanReadable);
      const dateB = parseDate(b.time.HumanReadable);

      return dateA.getTime() - dateB.getTime();
    });
    setRemindList(sorted)
    })


  },[update])



  return (  
    <main className="h-full bg-white">
        <div className="w-full text-center bg-zinc-50 flex justify-center py-5 shadow-sm mb-2.5">
          <img  className="w-[150px]"src={logo} alt="Image Logo" />
        </div>     
        <div className="w-full flex flex-wrap justify-center">
        <div className="w-4/6 flex justify-start my-2">
            <DialogRemind onChange={(e)=>{if(e){
              setUpdate(!update);
            }}}><Button variant="sucess" className=" cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
              <BadgePlus/>Create new one</Button></DialogRemind>
        </div>
          <div className="w-4/6 my-2 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grid-cols-1 grid-flow-row gap-5 justify-items-center place-items-start">
                  {remindList.map((value:RemindInfo)=>
                  {
                      return <RemindCard onChange={()=>setUpdate(!update)} remindInfo={value} key={value.id} onDelete={(id:any)=>{
                        setRemindList(
                        remindList.filter((r)=>r.id !== id))}}></RemindCard>
                  })}
          </div> 
        </div>
    </main>
  );
}

export default App;
