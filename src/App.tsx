import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import {RemindCard, RemindInfo} from "./components/myui/remindcard";
import "./App.css";

function App() {

  
  const [remindList,setRemindList] = useState<RemindInfo[]>([]);
  
  useEffect(()=>{
    invoke('get_reminds').then((res)=>
    {
      console.log(res);
    })
  })

  return (  
    <main className="w-full flex justify-center">
      
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <RemindCard title="Reminds" message="Ola mundo" time="20/04/2026 20:53" id={1}></RemindCard>

        </div>
    </main>
  );
}

export default App;
