import { BadgeX, Pencil } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardTitle, CardAction, CardDescription, CardContent, CardHeader, CardFooter } from "../ui/card"
import { invoke } from "@tauri-apps/api/core"
export interface RemindInfo{
    id: number,
    title: string,
    message: string,
    time: {HumanReadable: string}
    onDelete: (id: number) => void;

}

export function RemindCard({title, time, message, id, onDelete}: RemindInfo)
{
    return(
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{time.HumanReadable}</CardDescription>
            </CardHeader>
                <CardContent>
                    <p>{message}</p>
                </CardContent>
                <CardFooter className="inline-flex justify-evenly">
                <CardAction>    
                    <Pencil  className=" cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"></Pencil>
                </CardAction>
                <CardAction>
                    <BadgeX className="text-destructive cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" onClick={()=>{
                        console.log(id)
                        invoke('delete_remind', {id}).then((res)=>
                        {
                              console.log(res)
                            if(res == id) onDelete(id);
                        })
                    }}></BadgeX>
                </CardAction>
                </CardFooter>
                
            </Card>
    )
}