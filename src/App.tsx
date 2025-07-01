import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  
  useEffect(()=>{
    invoke('get_reminds').then((res)=>
    {
      console.log(res);
    })
  })

  return (
    <main className="container">
      
    </main>
  );
}

export default App;
