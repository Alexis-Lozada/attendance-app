"use client";

import { MapPin } from "lucide-react";
import { DAYS_OF_WEEK } from "@/types/schedule";
import type { Classroom } from "@/types/schedule";

const WEEK_DAYS = DAYS_OF_WEEK.filter(day => day.value !== "SATURDAY");

interface ScheduleBlock {
  id: string;
  idGroupCourse: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  idClassroom: number;
  courseCode?: string;
  courseName?: string;
  professorName?: string;
  classroomCode?: string;
}

interface ScheduleTableProps {
  scheduleBlocks: ScheduleBlock[];
  classrooms: Classroom[];
  timeSlots: string[];
  onBlockDragStart: (e: React.DragEvent, block: ScheduleBlock) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, time: string, timeSlots: string[]) => void;
  onUpdateBlockClassroom: (blockId: string, classroomId: number) => void;
}

export default function ScheduleTable({
  scheduleBlocks,
  classrooms,
  timeSlots,
  onBlockDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onUpdateBlockClassroom,
}: ScheduleTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 border-r border-b border-gray-200 text-left w-20">
                <span className="text-xs font-semibold text-gray-600">HORA</span>
              </th>
              {WEEK_DAYS.map((day) => (
                <th 
                  key={day.value} 
                  className="p-3 border-r last:border-r-0 border-b border-gray-200 text-center min-w-[180px]"
                >
                  <span className="text-xs font-semibold text-gray-700">{day.label}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {timeSlots.map((time) => {
              const skipColumns = new Set<string>();
              
              WEEK_DAYS.forEach((day) => {
                const spanningBlock = scheduleBlocks.find(block => 
                  block.dayOfWeek === day.value && 
                  block.startTime < time && 
                  block.endTime > time
                );
                if (spanningBlock) {
                  skipColumns.add(day.value);
                }
              });

              return (
                <tr key={time} className="border-b border-gray-200">
                  <td className="p-2 bg-gray-50 border-r border-gray-200 text-center min-h-[80px] w-20">
                    <span className="text-xs text-gray-600 font-medium">{time}</span>
                  </td>

                  {WEEK_DAYS.map((day) => {
                    if (skipColumns.has(day.value)) {
                      return null;
                    }

                    const block = scheduleBlocks.find(b => 
                      b.dayOfWeek === day.value && 
                      b.startTime === time
                    );

                    let rowSpan = 1;
                    if (block) {
                      const startIdx = timeSlots.indexOf(block.startTime);
                      const endIdx = timeSlots.indexOf(block.endTime);
                      if (startIdx !== -1 && endIdx !== -1) {
                        rowSpan = endIdx - startIdx;
                      }
                    }

                    return (
                      <td
                        key={day.value}
                        rowSpan={rowSpan}
                        draggable={!!block}
                        onDragStart={(e) => block && onBlockDragStart(e, block)}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, day.value, time, timeSlots)}
                        className={`border-r last:border-r-0 border-gray-200 min-h-[80px] min-w-[180px] transition-colors relative group ${
                          block 
                            ? 'bg-primary/10 border-l-4 border-l-primary cursor-move' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {block ? (
                          <div className="p-2 h-full flex flex-col justify-between min-h-[80px]">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-900 truncate">
                                {block.courseCode}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {block.courseName}
                              </p>
                            </div>

                            <div className="space-y-1 mt-2">
                              <div className="flex items-center gap-1 text-xs">
                                <MapPin size={10} className="text-gray-500 flex-shrink-0" />
                                <select
                                  value={block.idClassroom}
                                  onChange={(e) => onUpdateBlockClassroom(block.id, Number(e.target.value))}
                                  className="flex-1 bg-white text-gray-700 text-xs rounded px-1 py-0.5 border border-gray-300 cursor-pointer hover:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {classrooms.map((classroom) => (
                                    <option key={classroom.idClassroom} value={classroom.idClassroom}>
                                      {classroom.roomCode}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}