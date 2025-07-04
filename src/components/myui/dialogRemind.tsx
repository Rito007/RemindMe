import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle } from "./../ui/dialog";
import { Button } from "../ui/button";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import DatePicker from "./datepicker";
import { invoke } from "@tauri-apps/api/core";
import { RemindInfo } from "./remindcard";

interface DialogProps {
  children: React.ReactNode;
  editMode?: boolean;
  remindInfo?: RemindInfo;
  onChange: (value: boolean) => void;
}

export default function DialogRemind(props: DialogProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isValid, setIsValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [validDate, setValidDate] = useState(false);
  

  useEffect(() => {
    setIsValid(title.trim() !== "" && message.trim() !== "" && date !== undefined && validDate);
  }, [title, message, date]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setMessage("");
      setDate(undefined);
    }
    if(props.remindInfo && props.editMode)
    {
        setTitle(props.remindInfo.title)
        setDate(parseDate(props.remindInfo.time.HumanReadable))
        setMessage(props.remindInfo.message)
    }
  }, [open]);


function parseDate(dateStr: string): Date {
  const day = Number(dateStr.slice(0, 2));
  const month = Number(dateStr.slice(3, 5)) - 1; // mês começa do zero
  const year = Number(dateStr.slice(6, 10));
  const hours = Number(dateStr.slice(11, 13));
  const minutes = Number(dateStr.slice(14, 16));

  return new Date(year, month, day, hours, minutes);
}

  function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const addRemind = (e: FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const formattedDate = formatDate(date);
    if(!props.editMode)
    {
        invoke("insert_reminds", { title, message, date: formattedDate })
      .then((success) => {
        console.log(success);
        props.onChange(true);
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error inserting reminder:", error);
      });
    }
    else
    {
        invoke("update_reminds", { title, message, date: formattedDate, id: props.remindInfo?.id })
        .then(() => {
            console.log(props.remindInfo?.id);
            props.onChange(true);
            setOpen(false);
        })
        .catch((error) => {
            console.error("Error inserting reminder:" + error);
        });
        }
  };

  return (
    <Dialog onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{props.editMode ? "Change remind" : "Create Remind"}</DialogTitle>
        <form name="addRemind" onSubmit={addRemind}>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Place the title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DatePicker date={date}
              id="date"
              onDateChange={(selectedDate, valid) => {
                setDate(selectedDate);
                setValidDate(valid)
              }}
            />
            <Label htmlFor="message">Message</Label>
            <Textarea
              className="max-h-20 resize-none"
              placeholder="Text for your remind"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex mt-3 gap-2 justify-end">
            <DialogClose asChild>
              <Button disabled={!isValid} type="submit">
                Guardar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Descartar
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
