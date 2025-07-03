import { HtmlHTMLAttributes, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "./../ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "./../ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Calendar } from "../ui/calendar"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: Date | undefined, isValid: boolean) => void
  date?: Date
}

export default function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [dateTime, setDateTime] = useState<Date | undefined>(undefined)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (props.date) {
      setDateTime(props.date)
    }
  }, [])

  const notifyChange = (newDate: Date | undefined, isValid:boolean) => {
    if (props.onDateChange) props.onDateChange(newDate, isValid)
  }

  const isValidDateTime = (d: Date) => {
    const now = new Date()
    return d.getTime() >= now.getTime() + 1000
  }

  const updateDate = (newDate: Date | undefined) => {
    if (!newDate) {
      setDateTime(undefined)
      setError(false)
      notifyChange(undefined, true)
      return
    }

    const base = dateTime ?? new Date()
    const updated = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      base.getHours(),
      base.getMinutes()
    )

    setDateTime(updated)
    setError(!isValidDateTime(updated))
    notifyChange(updated, !isValidDateTime(updated))
  }

  const updateTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (!/^\d{2}:\d{2}$/.test(value)) {
      return
    }

    const [hours, minutes] = value.split(":").map(Number)

    const base = dateTime ?? new Date()
    const updated = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      hours,
      minutes
    )

    setDateTime(updated)
    setError(!isValidDateTime(updated))
    notifyChange(updated, isValidDateTime(updated))
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {dateTime ? dateTime.toLocaleDateString("en-GB") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            sideOffset={5}
            className="w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={dateTime}
              captionLayout="dropdown"
              onSelect={(newDate) => {
                updateDate(newDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="60"
          value={
            dateTime
              ? dateTime.toLocaleTimeString("en-GB", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : ""
          }
          onChange={updateTime}
          className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${
            error ? "border-destructive" : ""
          }`}
        />
      </div>
    </div>
  )
}
