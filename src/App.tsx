import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import {RemindCard, RemindInfo} from "./components/myui/remindcard";
import "./App.css";



function App() {

  
  const [remindList,setRemindList] = useState<RemindInfo[]>([]);
  
  useEffect(()=>{
    invoke<RemindInfo[]>('get_reminds').then((res :RemindInfo[])=>
    {
        setRemindList(res);
        console.log(res);
    }).catch((err)=>
    {
      console.log(err);
    })
    
  },[])

  return (  
    <main className="w-full flex justify-center">
      
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {remindList.map((value:RemindInfo)=>
              {
                  return <RemindCard title={value.title} message={value.message} time={value.time} id={value.id} key={value.id}></RemindCard>
              })}

        </div>
    </main>
  );
}

export default App;
