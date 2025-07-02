import { Button } from "../ui/button"
import { Card, CardTitle, CardAction, CardDescription, CardContent, CardHeader, CardFooter } from "../ui/card"
import { invoke } from "@tauri-apps/api/core"
export interface RemindInfo{
    id: number,
    title: string,
    message: string,
    time: {HumanReadable: string}
}

type responseStatus = {
    Ok :boolean;
    ErrorMessage: string;
}

export function RemindCard({title, time, message, id}: RemindInfo)
{
    return(
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{time.HumanReadable}</CardDescription>
            </CardHeader>
                <CardContent>
                    <p>{message}</p>
                </CardContent>
                <CardFooter className="inline-flex justify-evenly">
                <CardAction>    
                    <Button variant="default" className="mx-0.5">Edit</Button> 
                </CardAction>
                <CardAction>
                    <Button onClick={()=>{
                        invoke('delete_remind', {id}).then((res)=>
                        {

                        })
                    }} variant="destructive" className="mx-0.5">Delete</Button>
                </CardAction>
                </CardFooter>
                
            </Card>
    )
}