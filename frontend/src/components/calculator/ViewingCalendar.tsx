import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { X, Clock, CheckCircle2 } from 'lucide-react';

interface ViewingCalendarProps {
  totalEpisodes: number;
  runtimePerEpisode: number;
  dailyTimeLimit: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  extendedProps: {
    episodes: number[];
    totalTime: number;
  };
}

const ViewingCalendar: React.FC<ViewingCalendarProps> = ({
  totalEpisodes,
  runtimePerEpisode,
  dailyTimeLimit,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // 이벤트를 생성하는 로직
  const events = useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];
    let currentDay = 0;
    let currentEpisodes: number[] = [];
    let currentTimeInDay = 0;
    const today = new Date();

    for (let i = 1; i <= totalEpisodes; i++) {
      if (runtimePerEpisode > dailyTimeLimit && currentEpisodes.length === 0) {
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + currentDay);
        
        calendarEvents.push({
          id: `day-${currentDay}`,
          title: `${i}화 시청`,
          start: eventDate.toISOString().split('T')[0],
          extendedProps: { episodes: [i], totalTime: runtimePerEpisode }
        });
        currentDay++;
        continue;
      }

      if (currentTimeInDay + runtimePerEpisode > dailyTimeLimit && currentEpisodes.length > 0) {
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + currentDay);
        
        calendarEvents.push({
          id: `day-${currentDay}`,
          title: `${currentEpisodes[0]}~${currentEpisodes[currentEpisodes.length-1]}화 시청`,
          start: eventDate.toISOString().split('T')[0],
          extendedProps: { episodes: currentEpisodes, totalTime: currentTimeInDay }
        });
        
        currentDay++;
        currentEpisodes = [i];
        currentTimeInDay = runtimePerEpisode;
      } else {
        currentEpisodes.push(i);
        currentTimeInDay += runtimePerEpisode;
      }
    }

    if (currentEpisodes.length > 0) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + currentDay);
      calendarEvents.push({
        id: `day-${currentDay}`,
        title: `${currentEpisodes[0]}~${currentEpisodes[currentEpisodes.length-1]}화 시청`,
        start: eventDate.toISOString().split('T')[0],
        extendedProps: { episodes: currentEpisodes, totalTime: currentTimeInDay }
      });
    }

    return calendarEvents;
  }, [totalEpisodes, runtimePerEpisode, dailyTimeLimit]);

  const handleEventClick = (info: any) => {
    const event = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      extendedProps: info.event.extendedProps
    };
    setSelectedEvent(event);
  };

  return (
    <div className="mt-8 relative animate-in fade-in duration-700">
      {/* Custom Styles for FullCalendar Dark Mode */}
      <style>{`
        .fc { --fc-border-color: rgba(255,255,255,0.1); --fc-page-bg-color: transparent; }
        .fc .fc-col-header-cell-cushion { color: #94a3b8; font-size: 0.875rem; padding: 10px 0; }
        .fc .fc-daygrid-day-number { color: #64748b; font-size: 0.875rem; padding: 8px; }
        .fc .fc-day-today { background: rgba(229,9,20,0.05) !important; }
        .fc-event { cursor: pointer; border: none !important; padding: 2px 4px; }
        .fc-h-event { background-color: #E50914 !important; border-radius: 4px !important; }
        .fc-event-title { font-size: 0.75rem !important; font-weight: 700 !important; }
        .fc .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 800; }
        .fc .fc-button-primary { background-color: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .fc .fc-button-primary:hover { background-color: rgba(255,255,255,0.1) !important; }
      `}</style>

      <div className="bg-white/5 rounded-3xl p-4 md:p-6 border border-white/10 shadow-inner">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale="ko"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          height="auto"
          eventClick={handleEventClick}
        />
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h5 className="text-accent-red text-xs font-black uppercase tracking-widest mb-1">시청 일정 상세</h5>
                <p className="text-xl font-bold text-white">{selectedEvent.start}</p>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Clock size={20} className="text-accent-red" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">총 시청 시간</p>
                  <p className="text-lg font-black text-white">{selectedEvent.extendedProps.totalTime}분</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  오늘의 시청 에피소드
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.extendedProps.episodes.map(ep => (
                    <span key={ep} className="px-3 py-1.5 rounded-lg bg-accent-red/10 border border-accent-red/20 text-sm font-bold text-white">
                      {ep}화
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-8 py-4 rounded-xl bg-accent-red text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-accent-red/20"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewingCalendar;
