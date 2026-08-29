import { EventRecord } from '../hooks/eventHooks';

const formatCalendarDate = (dateString: string) =>
  new Date(dateString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

const escapeCalendarText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

export const getEventGoogleCalendarUrl = (event: EventRecord) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatCalendarDate(event.startDate)}/${formatCalendarDate(event.endDate)}`,
    details: `${event.summary}\n\n${event.description}`,
    location: `${event.venue.name}, ${event.venue.address}, ${event.venue.city}, ${event.venue.parish}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadEventCalendarFile = (event: EventRecord) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Yaad//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@yaad-events`,
    `DTSTAMP:${formatCalendarDate(new Date().toISOString())}`,
    `DTSTART:${formatCalendarDate(event.startDate)}`,
    `DTEND:${formatCalendarDate(event.endDate)}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(`${event.summary}\n\n${event.description}`)}`,
    `LOCATION:${escapeCalendarText(
      `${event.venue.name}, ${event.venue.address}, ${event.venue.city}, ${event.venue.parish}`
    )}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

