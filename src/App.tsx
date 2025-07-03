import { useEffect, useState } from "react";
import  logo from "./assets/logo.png";
import { invoke } from "@tauri-apps/api/core";
import {RemindCard, RemindInfo} from "./components/myui/remindcard"
import { Button } from "./components/ui/button";
import { BadgePlus } from "lucide-react"
import "./App.css";



function App() {

  
  const [remindList,setRemindList] = useState<RemindInfo[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  
  useEffect(()=>{
    invoke<RemindInfo[]>('get_reminds').then((res :RemindInfo[])=>
    {
        setRemindList(res);
        console.log(res);
    }).catch((err)=>
    {
      console.log(err);
    })
    
  },[update])

  return (  
    <main className="h-full bg-white">
        <div className="w-full text-center bg-zinc-50 flex justify-center py-5 shadow-sm mb-2.5">
          <img  className="w-[150px]"src={logo} alt="Image Logo" />
        </div>     
        
        <div className="w-full flex flex-wrap justify-center">
        <div className="w-4/6 flex justify-start my-2">
            <Button onClick={()=>{
              invoke('insert_reminds', {message: `This is an
                
                
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae faucibus quam, a imperdiet purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras lacinia sed purus a placerat. Maecenas nec varius dolor, laoreet iaculis risus. Morbi viverra ligula in dui faucibus tristique. Integer facilisis est ac ligula pretium, in maximus ipsum imperdiet. Etiam pharetra cursus augue, ultricies maximus urna venenatis vel. Cras sapien ligula, condimentum vel elementum at, interdum et eros. Cras sed enim placerat, cursus nisi fringilla, convallis risus. Proin eros ex, fringilla eu nisl egestas, posuere porta leo. Sed arcu risus, congue ut consectetur nec, cursus non dolor. Cras auctor odio at nisi convallis, suscipit luctus ante volutpat. In ut egestas mauris, ac efficitur ante. Morbi auctor semper ipsum at scelerisque. Fusce placerat nisl et tellus maximus, eleifend venenatis augue malesuada.

Sed rutrum, justo et viverra eleifend, libero sem imperdiet erat, elementum euismod justo tortor vel nunc. Donec imperdiet convallis tincidunt. Mauris rhoncus tincidunt odio, vitae efficitur ligula cursus a. Phasellus sit amet feugiat nisi. Aenean vehicula scelerisque arcu, at feugiat neque tempor sed. In ligula diam, suscipit vel fringilla vitae, vehicula eu nisl. Aliquam vitae tincidunt ex, in rhoncus est. Curabitur et lacinia mauris.

Phasellus molestie eu nulla sit amet commodo. Vestibulum cursus sed quam ac mollis. Quisque in nunc id erat pellentesque porttitor eget in ante. Nunc sed sapien eget odio tincidunt lacinia. Mauris aliquet ante nibh, sed dapibus ipsum varius vitae. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam porta imperdiet odio, at consectetur nulla vestibulum ut.

Mauris sem nibh, egestas eget pharetra et, cursus a risus. Quisque a lacus sit amet ante luctus scelerisque vel a enim. Etiam vulputate quam massa, eget iaculis ante hendrerit eu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce feugiat lectus id tincidunt pulvinar. Morbi posuere purus eu nunc ornare eleifend. Morbi maximus bibendum tellus vel suscipit. Cras pellentesque sem libero, vitae pulvinar felis elementum in. Fusce et condimentum massa. Mauris laoreet nisl elit, id blandit est consectetur consectetur. Etiam pretium luctus odio eget tempus. Nulla eu felis vitae purus lacinia dignissim nec vitae lectus.

Donec vulputate scelerisque lectus auctor euismod. Morbi eget dolor blandit, vehicula nisi ac, tempor sem. Etiam ultrices fermentum turpis ac bibendum. Aenean sit amet pulvinar nibh. Fusce quis elit ac ante rhoncus porttitor. Nam leo mauris, aliquam vitae condimentum eget, tempus id lectus. Proin bibendum massa eu pretium varius. Curabitur hendrerit velit eu nisi consectetur faucibus. Phasellus convallis hendrerit nisl elementum fermentum. Sed efficitur eu nisi sit amet fermentum. Cras luctus pharetra mi, sed fringilla sapien fringilla in. Etiam venenatis neque mi, imperdiet vestibulum tortor rhoncus sed. Cras ultricies venenatis lectus, a commodo lorem interdum et. Mauris consequat sed nisl congue interdum. Nullam nec dapibus nibh, ut fringilla sapien. Duis mollis nibh ut lectus sollicitudin, venenatis luctus dolor interdum.

Pelntum lectus, nec malesuada nibh. Morbi libero odio, gravida eget lacinia vitae, pharetra eu turpis. Nullam sit amet venenatis magna. Integer tincidunt est sed sem pulvinar condimentum. Integer luctus risus sodales lobortis rhoncus. In commodo enim quis sapien vestibulum iaculis. Nulla luctus faucibus erat. Donec a feugiat magna. Proin et vulputate enim.
                
                
                
                
                example message`, title:"Hello world", date:"20/04/2006 20:40" }).then((res)=>
              {
                setUpdate(!update)
              })
            }} variant="sucess" className=" cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"><BadgePlus/>Create new one</Button>
        </div>
          <div className="w-4/6 my-2 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grid-cols-1 grid-flow-row gap-5 justify-items-center place-items-start">
                  {remindList.map((value:RemindInfo)=>
                  {
                      return <RemindCard title={value.title} message={value.message} time={value.time} id={value.id} key={value.id} onDelete={(id)=>{
                        setRemindList(
                        remindList.filter((r)=>r.id !== id))}}></RemindCard>
                  })}

          </div> 
        </div>
    </main>
  );
}

export default App;
