import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  MoreVertical,
  Calendar,
} from "lucide-react";
import { AGENDA_EVENTS } from "../data/mockData";
import { ScreenLayout } from "./ScreenLayout";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { EmptyState } from "./EmptyState";
import { ContextualHelp } from "./ContextualHelp";
import { TutorialOverlay } from "./TutorialOverlay";
import { TUTORIALS } from "../data/tutorialContent";
import { useI18n } from "../context/I18nContext";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year, month) {
  const d = new Date(year, month, 1);
  return (d.getDay() + 6) % 7;
}

function getEventsForDay(events, year, month, day) {
  return events.filter((e) => {
    const start = new Date(e.date + "T00:00:00");
    const end = e.endDate ? new Date(e.endDate + "T00:00:00") : start;
    const current = new Date(year, month, day);
    return current >= start && current <= end;
  });
}

function getNext7Days(year, month, day) {
  const start = new Date(year, month, day);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      date,
    });
  }
  return days;
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function AgendaScreen() {
  const { t } = useI18n();

  const MONTHS = t("agenda.months").split(",");
  const DAYS = t("agenda.daysShort").split(",");
  const DAY_NAMES_FULL = t("agenda.days").split(",");
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState("month");
  const [events, setEvents] = useState(AGENDA_EVENTS);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstWeekday = getFirstWeekday(currentYear, currentMonth);

  const dayEvents = useMemo(
    () =>
      selectedDay !== null
        ? getEventsForDay(events, currentYear, currentMonth, selectedDay)
        : [],
    [events, currentYear, currentMonth, selectedDay],
  );

  const handlePrev = () => {
    setSelectedEvent(null);
    if (viewMode === "month") {
      if (currentMonth === 0) {
        setCurrentYear((y) => y - 1);
        setCurrentMonth(11);
      } else {
        setCurrentMonth((m) => m - 1);
      }
      setSelectedDay(null);
    } else {
      const d = new Date(currentYear, currentMonth, selectedDay ?? 1);
      d.setDate(d.getDate() - 7);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      setSelectedDay(d.getDate());
    }
  };

  const handleNext = () => {
    setSelectedEvent(null);
    if (viewMode === "month") {
      if (currentMonth === 11) {
        setCurrentYear((y) => y + 1);
        setCurrentMonth(0);
      } else {
        setCurrentMonth((m) => m + 1);
      }
      setSelectedDay(null);
    } else {
      const d = new Date(currentYear, currentMonth, selectedDay ?? 1);
      d.setDate(d.getDate() + 7);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
      setSelectedDay(d.getDate());
    }
  };

  const goToMonth = (year, month) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setShowMonthPicker(false);
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const eventDaysMap = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const start = new Date(ev.date + "T00:00:00");
      const end = ev.endDate ? new Date(ev.endDate + "T00:00:00") : start;
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      if (end < monthStart || start > monthEnd) continue;

      const cursor = new Date(Math.max(start.getTime(), monthStart.getTime()));
      const last = new Date(Math.min(end.getTime(), monthEnd.getTime()));
      while (cursor <= last) {
        const day = cursor.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day).push(ev);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }, [events, currentYear, currentMonth]);

  const isTodayVisible =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  const years = [];
  for (let y = today.getFullYear() - 2; y <= today.getFullYear() + 2; y++) {
    years.push(y);
  }

  const calendarDays = [];
  for (let i = 0; i < firstWeekday; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const isMultiDay =
    !!selectedEvent?.endDate && selectedEvent?.endDate !== selectedEvent?.date;

  const getHeaderLabel = () => {
    if (viewMode === "month") return `${MONTHS[currentMonth]} ${currentYear}`;
    const day = selectedDay ?? 1;
    const weekDays = getNext7Days(currentYear, currentMonth, day);
    const first = weekDays[0];
    const last = weekDays[6];
    if (first.month === last.month) {
      return `${first.day}-${last.day}, ${MONTHS[first.month]} ${first.year}`;
    }
    return `${first.day} ${MONTHS[first.month]} - ${last.day} ${MONTHS[last.month]} ${last.year}`;
  };

  return (
    <ScreenLayout
      headerMode="top"
      scrollable={false}
      onHelpClick={() => setShowGuide(true)}
    >
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-[#CCCCCC] dark:border-gray-700" data-tutorial="agenda-navegacion">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 text-[#659B35] hover:text-[#207041] text-sm font-medium"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => {
                setPickerMonth(currentMonth);
                setPickerYear(currentYear);
                setShowMonthPicker((v) => !v);
              }}
              className="text-base font-bold text-[#659B35] hover:text-[#207041] transition-colors flex items-center gap-0.5 border-b border-dotted border-[#659B35] hover:border-[#207041]"
            >
              {getHeaderLabel()}
              <span className="text-xs">▾</span>
            </button>

            {showMonthPicker && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMonthPicker(false)}
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-[#CCCCCC] dark:border-gray-600 z-40 w-56 max-h-80 overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-[#CCCCCC] dark:border-gray-600 px-3 py-2">
                    <div className="relative">
                      <select
                        value={pickerYear}
                        onChange={(e) => setPickerYear(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {viewMode === "month" ? (
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {MONTHS.map((m, i) => {
                        const isActive =
                          currentYear === pickerYear && currentMonth === i;
                        return (
                          <button
                            key={m}
                            onClick={() => goToMonth(pickerYear, i)}
                            className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                              isActive
                                ? "bg-[#659B35] dark:bg-[#85C34A] text-white"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            if (pickerMonth === 0) {
                              setPickerMonth(11);
                              setPickerYear((y) => y - 1);
                            } else {
                              setPickerMonth((m) => m - 1);
                            }
                          }}
                          className="p-1 text-[#659B35] hover:text-[#207041]"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {MONTHS[pickerMonth]} {pickerYear}
                        </span>
                        <button
                          onClick={() => {
                            if (pickerMonth === 11) {
                              setPickerMonth(0);
                              setPickerYear((y) => y + 1);
                            } else {
                              setPickerMonth((m) => m + 1);
                            }
                          }}
                          className="p-1 text-[#659B35] hover:text-[#207041]"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 text-center text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                        {DAYS.map((d) => (
                          <div key={d}>{d}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7">
                        {(() => {
                          const dim = getDaysInMonth(pickerYear, pickerMonth);
                          const fwd = getFirstWeekday(pickerYear, pickerMonth);
                          const cells = [];
                          for (let i = 0; i < fwd; i++) cells.push(null);
                          for (let d = 1; d <= dim; d++) cells.push(d);
                          const todayDate = today.getDate();
                          const isTodayVisible =
                            pickerYear === today.getFullYear() &&
                            pickerMonth === today.getMonth();

                          return cells.map((day, idx) => {
                            if (day === null)
                              return (
                                <div
                                  key={`e-${idx}`}
                                  className="aspect-square"
                                />
                              );

                            const isToday = isTodayVisible && day === todayDate;
                            const isSelected =
                              currentYear === pickerYear &&
                              currentMonth === pickerMonth &&
                              selectedDay === day;

                            return (
                              <button
                                key={day}
                                onClick={() => {
                                  setCurrentYear(pickerYear);
                                  setCurrentMonth(pickerMonth);
                                  setSelectedDay(day);
                                  setShowMonthPicker(false);
                                }}
                                className={`aspect-square rounded-full text-xs flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-[#659B35] dark:bg-[#85C34A] text-white"
                                    : isToday
                                      ? "bg-[#F5F5F5] dark:bg-gray-700 text-[#207041] dark:text-[#85C34A] font-bold"
                                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5" data-tutorial="agenda-vista">
            <button
              onClick={() => {
                const monday = getMonday(today);
                setCurrentYear(monday.getFullYear());
                setCurrentMonth(monday.getMonth());
                setSelectedDay(monday.getDate());
                setViewMode("week");
              }}
              className={`px-3 py-0.5 text-xs font-medium rounded-full transition-colors ${
                viewMode === "week"
                  ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t("agenda.week")}
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-0.5 text-xs font-medium rounded-full transition-colors ${
                viewMode === "month"
                  ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t("agenda.month")}
            </button>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 text-[#659B35] hover:text-[#207041] text-sm font-medium"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {viewMode === "month" && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white dark:bg-gray-800 px-3 py-3 flex-shrink-0 max-h-[45vh] overflow-y-auto" data-tutorial="agenda-eventos">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }

                const eventsOnDay = eventDaysMap.get(day) ?? [];
                const isToday = isTodayVisible && day === today.getDate();
                const isSelected = selectedDay === day;
                const hasEvents = eventsOnDay.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-start pt-1 text-sm transition-colors ${
                      isSelected
                        ? "bg-[#F5F5F5] dark:bg-gray-700 ring-2 ring-[#659B35]"
                        : isToday
                          ? "bg-[#F5F5F5] dark:bg-gray-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        isToday
                          ? "text-[#207041] dark:text-[#85C34A]"
                          : "text-gray-800 dark:text-gray-100"
                      } ${isSelected ? "text-[#207041]" : ""}`}
                    >
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="flex flex-col gap-0.5 mt-0.5 w-full px-1">
                        {eventsOnDay.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className="h-1.5 rounded-full w-full"
                            style={{ backgroundColor: ev.color }}
                          />
                        ))}
                        {eventsOnDay.length > 2 && (
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 text-center">
                            +{eventsOnDay.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll bg-[#F5F5F5] dark:bg-gray-900 px-4 py-3 pb-16 scroll-container">
            <div className="min-h-[calc(100%+1px)]">
            {selectedDay !== null && (
              <>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  {t("agenda.dateFormat")
                    .replace("{day}", String(selectedDay))
                    .replace("{month}", MONTHS[currentMonth])
                    .replace("{year}", String(currentYear))}
                </h3>
                {dayEvents.length === 0 ? (
                  <EmptyState
                    icon={<Calendar size={48} />}
                    title={t("agenda.noEventsDay")}
                  />
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className="w-full bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border-l-4 text-left hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: ev.color }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: ev.color }}
                          />

                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {ev.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 ml-4">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {ev.time}
                          </span>
                          {ev.location && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin size={12} /> {ev.location}
                            </span>
                          )}
                        </div>
                        {ev.endDate && ev.endDate !== ev.date && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 ml-4 mt-0.5">
                            {ev.date} → {ev.endDate}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </div>
      )}

      {viewMode === "week" &&
        (() => {
          const day = selectedDay ?? 1;
          const weekDays = getNext7Days(currentYear, currentMonth, day);

          return (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-white dark:bg-gray-800 px-3 py-3 flex-shrink-0" data-tutorial="agenda-eventos">
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {weekDays.map((d, idx) => {
                    const isToday =
                      d.day === today.getDate() &&
                      d.month === today.getMonth() &&
                      d.year === today.getFullYear();
                    const eventsOnDay = getEventsForDay(
                      events,
                      d.year,
                      d.month,
                      d.day,
                    );
                    const hasEvents = eventsOnDay.length > 0;

                    return (
                      <div
                        key={idx}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-start pt-1 text-sm transition-colors ${
                          isToday
                            ? "bg-[#F5F5F5] dark:bg-gray-700 ring-2 ring-[#659B35] dark:ring-[#85C34A]"
                            : ""
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            isToday
                              ? "text-[#207041]"
                              : "text-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {d.day}
                        </span>
                        {hasEvents && (
                          <div className="flex flex-col gap-0.5 mt-0.5 w-full px-1">
                            {eventsOnDay.slice(0, 2).map((ev) => (
                              <div
                                key={ev.id}
                                className="h-1.5 rounded-full w-full"
                                style={{ backgroundColor: ev.color }}
                              />
                            ))}
                            {eventsOnDay.length > 2 && (
                              <span className="text-[9px] text-gray-400 dark:text-gray-500 text-center">
                                +{eventsOnDay.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-scroll bg-[#F5F5F5] dark:bg-gray-900 px-4 py-3 pb-16 scroll-container">
                <div className="min-h-[calc(100%+1px)]">
                {weekDays.map((d, idx) => {
                  const eventsOnDay = getEventsForDay(
                    events,
                    d.year,
                    d.month,
                    d.day,
                  );
                  const isToday =
                    d.day === today.getDate() &&
                    d.month === today.getMonth() &&
                    d.year === today.getFullYear();

                  return (
                    <div key={idx} className="mb-4">
                      <h3
                        className={`text-sm font-bold mb-2 ${isToday ? "text-[#207041]" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        {DAY_NAMES_FULL[d.date.getDay()]} {d.day}
                      </h3>
                      {eventsOnDay.length === 0 ? (
                        <p className="text-xs text-gray-400 dark:text-gray-500 ml-2 mb-2">
                          {t("agenda.noEvents")}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {eventsOnDay.map((ev) => (
                            <div
                              key={ev.id}
                              className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border-l-4 hover:shadow-md transition-shadow"
                              style={{ borderLeftColor: ev.color }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <button
                                  onClick={() => setSelectedEvent(ev)}
                                  className="flex-1 min-w-0 text-left"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className="w-2 h-2 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: ev.color }}
                                    />
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                      {ev.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 ml-4">
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} /> {ev.time}
                                    </span>
                                    {ev.location && (
                                      <span className="flex items-center gap-1 truncate">
                                        <MapPin size={12} /> {ev.location}
                                      </span>
                                    )}
                                  </div>
                                  {ev.endDate && ev.endDate !== ev.date && (
                                    <div className="text-xs text-gray-400 dark:text-gray-500 ml-4 mt-0.5">
                                      {ev.date} → {ev.endDate}
                                    </div>
                                  )}
                                </button>
                                <div className="relative flex-shrink-0 self-start">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuOpenId(
                                        menuOpenId === ev.id ? null : ev.id,
                                      );
                                    }}
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                  {menuOpenId === ev.id && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setMenuOpenId(null)}
                                      />
                                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 w-40 overflow-hidden">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEvents((prev) =>
                                              prev.filter(
                                                (x) => x.id !== ev.id,
                                              ),
                                            );
                                            setMenuOpenId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                          {t("delete")}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEvent(ev);
                                            setMenuOpenId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                          {t("agenda.view")}
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          );
        })()}
      <PopupOverlay
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      >
        {selectedEvent &&
          (() => {
            return (
              <DetailCard
                color={selectedEvent.color}
                icon={<Calendar size={32} />}
                title={selectedEvent.title}
                subtitle={`${selectedEvent.time} · ${selectedEvent.date}${isMultiDay ? ` → ${selectedEvent.endDate}` : ""}`}
                badges={
                  <>
                    <span>{selectedEvent.date}</span>
                    {isMultiDay && (
                      <>
                        <span>·</span>
                        <span>→ {selectedEvent.endDate}</span>
                      </>
                    )}
                    {selectedEvent.location && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {selectedEvent.location}
                        </span>
                      </>
                    )}
                  </>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
      {showTutorial && (
        <TutorialOverlay
          steps={TUTORIALS.agenda.steps}
          tutorialTitle={TUTORIALS.agenda.title}
          tutorialKey="agenda"
          onClose={() => setShowTutorial(false)}
          onQuickGuide={() => { setShowTutorial(false); setShowGuide(true); }}
        />
      )}

      <ContextualHelp
        helpKey="agenda"
        open={showGuide}
        onClose={() => setShowGuide(false)}
        onStartTutorial={() => { setShowGuide(false); setShowTutorial(true); }}
      />
    </ScreenLayout>
  );
}
