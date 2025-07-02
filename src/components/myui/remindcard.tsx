import { Button } from "../ui/button"
import { Card, CardTitle, CardAction, CardDescription, CardContent, CardHeader, CardFooter } from "../ui/card"

export interface RemindInfo{
    id: number,
    title: string,
    message: string,
    time: string
}

export function RemindCard({title, time, message, id}: RemindInfo)
{
    return(
        <Card className="w-[300px]" id={id.toString()}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{time}</CardDescription>
                <CardAction>    
                    <Button variant="ghost" className="mx-0.5">Edit</Button> 
                    <Button variant="destructive" className="mx-0.5">Delete</Button>
                </CardAction>
            </CardHeader>
                <CardContent>
                    <p>{message}</p>
                </CardContent>
            </Card>
    )
}