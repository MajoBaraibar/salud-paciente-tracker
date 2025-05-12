
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type StaffMember = {
  id: string;
  name: string;
  role: "medico" | "enfermera" | "admin";
  avatar?: string;
};

type Shift = {
  id: string;
  staffId: string;
  date: string; // ISO date string
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: "morning" | "afternoon" | "night";
};

export const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate));
  
  // Mock staff data
  const staff: StaffMember[] = [
    { id: "1", name: "Dr. Juan Pérez", role: "medico" },
    { id: "2", name: "Dra. Ana Martínez", role: "medico" },
    { id: "3", name: "Enf. María Rodríguez", role: "enfermera" },
    { id: "4", name: "Enf. Carlos López", role: "enfermera" },
    { id: "5", name: "Admin. Laura Sánchez", role: "admin" },
  ];
  
  // Mock shifts data
  const shifts: Shift[] = [
    { id: "1", staffId: "1", date: "2025-05-12", startTime: "08:00", endTime: "16:00", type: "morning" },
    { id: "2", staffId: "2", date: "2025-05-12", startTime: "16:00", endTime: "00:00", type: "afternoon" },
    { id: "3", staffId: "3", date: "2025-05-12", startTime: "08:00", endTime: "16:00", type: "morning" },
    { id: "4", staffId: "4", date: "2025-05-12", startTime: "16:00", endTime: "00:00", type: "afternoon" },
    { id: "5", staffId: "1", date: "2025-05-13", startTime: "16:00", endTime: "00:00", type: "afternoon" },
    { id: "6", staffId: "2", date: "2025-05-13", startTime: "08:00", endTime: "16:00", type: "morning" },
    { id: "7", staffId: "3", date: "2025-05-13", startTime: "00:00", endTime: "08:00", type: "night" },
    { id: "8", staffId: "4", date: "2025-05-14", startTime: "08:00", endTime: "16:00", type: "morning" },
    { id: "9", staffId: "1", date: "2025-05-15", startTime: "08:00", endTime: "16:00", type: "morning" },
    { id: "10", staffId: "3", date: "2025-05-15", startTime: "16:00", endTime: "00:00", type: "afternoon" },
  ];
  
  // Calculate days of the current week
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6)
  });
  
  // Navigate to previous week
  const prevWeek = () => {
    const newWeekStart = addDays(weekStart, -7);
    setWeekStart(newWeekStart);
  };
  
  // Navigate to next week
  const nextWeek = () => {
    const newWeekStart = addDays(weekStart, 7);
    setWeekStart(newWeekStart);
  };
  
  // Get shifts for a specific staff member on a specific day
  const getShifts = (staffId: string, date: string) => {
    return shifts.filter(shift => 
      shift.staffId === staffId && 
      shift.date === date
    );
  };
  
  // Format the shift for display
  const formatShift = (type: Shift["type"]) => {
    switch (type) {
      case "morning":
        return { label: "Mañana", color: "bg-blue-100 text-blue-700 hover:bg-blue-100" };
      case "afternoon":
        return { label: "Tarde", color: "bg-orange-100 text-orange-700 hover:bg-orange-100" };
      case "night":
        return { label: "Noche", color: "bg-purple-100 text-purple-700 hover:bg-purple-100" };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl">Horario del Personal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualización de turnos semanales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
            <CalendarIcon className="h-4 w-4 opacity-70" />
            <span className="text-sm">
              {format(weekStart, "d MMM", { locale: es })} - {format(addDays(weekStart, 6), "d MMM, yyyy", { locale: es })}
            </span>
          </div>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week days header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="flex items-center justify-center h-12 border-b font-medium">
                Personal
              </div>
              {weekDays.map((day, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center h-12 border-b font-medium ${
                    format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") 
                      ? "bg-health-50 text-health-700" 
                      : ""
                  }`}
                >
                  <span className="text-sm">{format(day, "EEE", { locale: es })}</span>
                  <span className="text-sm font-bold">{format(day, "d")}</span>
                </div>
              ))}
            </div>
            
            {/* Staff rows */}
            {staff.map((member) => (
              <div key={member.id} className="grid grid-cols-8 gap-2 mb-2">
                <div className="flex items-center gap-2 pl-2 border-r">
                  <div className={`w-2 h-2 rounded-full ${
                    member.role === "medico" ? "bg-blue-500" :
                    member.role === "enfermera" ? "bg-green-500" : "bg-purple-500"
                  }`} />
                  <span className="font-medium truncate">{member.name}</span>
                </div>
                
                {weekDays.map((day, i) => {
                  const dayShifts = getShifts(member.id, format(day, "yyyy-MM-dd"));
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-wrap gap-1 items-center justify-center p-1 min-h-[60px] border rounded-md ${
                        format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") 
                          ? "bg-health-50" 
                          : "bg-white"
                      }`}
                    >
                      {dayShifts.length > 0 ? (
                        dayShifts.map((shift) => {
                          const shiftStyle = formatShift(shift.type);
                          return (
                            <TooltipProvider key={shift.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className={shiftStyle.color}>
                                    {shiftStyle.label}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Horario: {shift.startTime} - {shift.endTime}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
