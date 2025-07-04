import { useEffect, useRef } from "react";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { RemindInfo } from "@/components/myui/remindcard";

function parseDate(str: string): Date {
  const [datePart, timePart] = str.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}


export function useNextRemindTimer(remindList: RemindInfo[]) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const agora = new Date();


    const proximo = remindList.find(r => {
      const data = parseDate(r.time.HumanReadable);
      return data.getTime() > agora.getTime();
    });

    if (!proximo) return;

    const remindDate = parseDate(proximo.time.HumanReadable);
    const tempoAteLa = remindDate.getTime() - agora.getTime();

    timeoutRef.current = setTimeout(() => {
      sendNotification({
        title: proximo.title,
        body: proximo.message,
      });

     

    }, tempoAteLa);

  }, [remindList]);
}