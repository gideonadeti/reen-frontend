import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { addDays, addMonths, addYears, format } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

import formatDate from "../utils/format-date";
import { PeriodType } from "../types/period-type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MIN_YEAR = 2024; // Project wasn't available in 2024
const MAX_YEAR = new Date().getFullYear();
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface PeriodSelectorProps {
  periodType: PeriodType;
  periodDate: Date;
  setPeriodType: Dispatch<SetStateAction<PeriodType>>;
  setPeriodDate: Dispatch<SetStateAction<Date>>;
}

const PeriodSelector = ({
  periodType,
  periodDate,
  setPeriodType,
  setPeriodDate,
}: PeriodSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  useEffect(() => {
    setCalendarMonth(new Date(periodDate));
  }, [periodDate]);

  const handlePrevious = () => {
    switch (periodType) {
      case "day":
        setPeriodDate((prev) => addDays(prev, -1));
        break;
      case "month":
        setPeriodDate((prev) => addMonths(prev, -1));
        break;
      case "year":
        setPeriodDate((prev) => addYears(prev, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (periodType) {
      case "day":
        setPeriodDate((prev) => addDays(prev, 1));
        break;
      case "month":
        setPeriodDate((prev) => addMonths(prev, 1));
        break;
      case "year":
        setPeriodDate((prev) => addYears(prev, 1));
        break;
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = Number.parseInt(e.target.value);

    if (!isNaN(year) && year > MIN_YEAR) {
      const newDate = new Date(periodDate);

      newDate.setFullYear(year);
      setPeriodDate(newDate);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(periodDate);

    newDate.setMonth(monthIndex);
    setPeriodDate(newDate);
    setIsOpen(false);
  };

  const handleDayPickerMonthChange = (monthIndex: number) => {
    const newDate = new Date(calendarMonth);
    const newPeriodDate = new Date(periodDate);

    newDate.setMonth(monthIndex);
    newPeriodDate.setMonth(monthIndex);
    newPeriodDate.setFullYear(newDate.getFullYear());
    setPeriodDate(newPeriodDate);
    setCalendarMonth(newDate);
  };

  const handleDayPickerYearChange = (year: number) => {
    const newDate = new Date(calendarMonth);
    const newPeriodDate = new Date(periodDate);

    newDate.setFullYear(year);
    newPeriodDate.setFullYear(year);
    setCalendarMonth(newDate);
    setPeriodDate(newPeriodDate);
  };

  const renderDatePicker = () => {
    switch (periodType) {
      case "day":
        return (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[150px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(periodType, periodDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="center">
              <div className="p-2">
                {/* Month and Year Navigation */}
                <div className="flex justify-between items-center mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(calendarMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCalendarMonth(newDate);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-1">
                    <Select
                      value={calendarMonth.getMonth().toString()}
                      onValueChange={(value) => {
                        handleDayPickerMonthChange(Number.parseInt(value));
                      }}
                    >
                      <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue>
                          {format(calendarMonth, "MMMM")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month, index) => (
                          <SelectItem key={month} value={index.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={calendarMonth.getFullYear().toString()}
                      onValueChange={(value) => {
                        handleDayPickerYearChange(Number.parseInt(value));
                      }}
                    >
                      <SelectTrigger className="h-8 w-[80px]">
                        <SelectValue>{calendarMonth.getFullYear()}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 21 }, (_, i) => {
                          const year = new Date().getFullYear() - 10 + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(calendarMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCalendarMonth(newDate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Calendar */}
                <Calendar
                  mode="single"
                  selected={periodDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  onSelect={(date) => {
                    if (date) {
                      setPeriodDate(date);
                      setIsOpen(false);
                    }
                  }}
                  initialFocus
                  className="border-none p-0"
                />

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-1 mt-2 border-t pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setPeriodDate(today);
                      setCalendarMonth(today);
                      setIsOpen(false);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      setPeriodDate(yesterday);
                      setCalendarMonth(yesterday);
                      setIsOpen(false);
                    }}
                  >
                    Yesterday
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );

      case "month":
        return (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[150px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(periodType, periodDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="center">
              <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(periodDate);
                      newDate.setFullYear(newDate.getFullYear() - 1);
                      setPeriodDate(newDate);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="font-medium">{periodDate.getFullYear()}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(periodDate);
                      newDate.setFullYear(newDate.getFullYear() + 1);
                      setPeriodDate(newDate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map((month, index) => (
                    <Button
                      key={month}
                      variant={
                        periodDate.getMonth() === index ? "default" : "outline"
                      }
                      size="sm"
                      className="h-9"
                      onClick={() => handleMonthSelect(index)}
                    >
                      {month.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );

      case "year":
        return (
          <div className="flex items-center">
            <Input
              type="number"
              value={periodDate.getFullYear()}
              onChange={handleYearChange}
              className="w-[100px] text-center"
              min={MIN_YEAR}
              max={MAX_YEAR}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="w-full sm:w-auto">
        <Label htmlFor="period-type" className="mb-2 block">
          Period Type
        </Label>
        <Select
          value={periodType}
          onValueChange={(value) => setPeriodType(value as PeriodType)}
        >
          <SelectTrigger id="period-type" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select period type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          aria-label="Previous period"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderDatePicker()}

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          aria-label="Next period"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PeriodSelector;
