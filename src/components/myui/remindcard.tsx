import { BadgeX, Pencil} from "lucide-react"
import { Card, CardTitle, CardAction, CardDescription, CardContent, CardHeader, CardFooter } from "../ui/card"
import { invoke } from "@tauri-apps/api/core"
import DialogRemind from "./dialogRemind"
export interface RemindInfo{
    id: number,
    title: string,
    message: string,
    time: {HumanReadable: string}
   

}

interface remindCardProps{
    remindInfo: RemindInfo,
    onChange: ()=>void
     onDelete: (id: number) => void;
}

    export function RemindCard({remindInfo ,onDelete, onChange}: remindCardProps)
    {
        return(
            <Card className="w-full h-full">
                <CardHeader>
                <CardTitle>{remindInfo.title}</CardTitle>
                <CardDescription>{remindInfo.time.HumanReadable}</CardDescription>
            </CardHeader>
                <CardContent className="text-wrap">
                    <p className="text-wrap w-full h-full break-words">{remindInfo.message}</p>
                </CardContent>
                <CardFooter className="inline-flex justify-evenly">
                <CardAction>    
                    <DialogRemind remindInfo={remindInfo} editMode onChange={()=>{onChange()}}><Pencil  className=" cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"></Pencil></DialogRemind>
                </CardAction>
                <CardAction>
                    <BadgeX className="text-destructive cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" onClick={()=>{
                        invoke('delete_remind', {id:  remindInfo.id}).then((res)=>
                        {
                              console.log(res)
                            if(res == remindInfo.id) onDelete(remindInfo.id);
                        })
                    }}></BadgeX>
                </CardAction>
                </CardFooter>
                
            </Card>
    )
}