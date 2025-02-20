import { Action, ActionSchema } from './nlp';
import * as Calendar from 'expo-calendar';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { format } from 'date-fns';

// In-memory storage for actions
const actionsStore: Action[] = [];

export async function saveAction(action: Action): Promise<Action> {
  try {
    // Store action in memory
    actionsStore.push(action);

    // Process action based on type
    switch (action.type) {
      case 'meeting':
        if (action.date) {
          await createCalendarEvent(action);
        }
        break;
      case 'task':
        await createTodoItem(action);
        break;
      case 'note':
        await createNote(action);
        break;
    }

    return ActionSchema.parse(action);
  } catch (error) {
    console.error('Error saving action:', error);
    throw new Error('Failed to save action');
  }
}

async function createCalendarEvent(action: Action) {
  if (Platform.OS === 'web') {
    // For web, create an .ics file and trigger download
    const icsContent = generateICSFile(action);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${action.title}.ics`;
    a.click();
    window.URL.revokeObjectURL(url);
    return;
  }

  // For native platforms
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Calendar permission not granted');
  }

  const calendars = await Calendar.getCalendarsAsync();
  const defaultCalendar = calendars.find(cal => cal.isPrimary);

  if (!defaultCalendar) {
    throw new Error('No default calendar found');
  }

  const eventDetails = {
    title: action.title,
    notes: action.details,
    startDate: action.date!,
    endDate: new Date(action.date!.getTime() + 60 * 60 * 1000), // 1 hour duration
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    alarms: [{ relativeOffset: -30 }], // 30 minute reminder
  };

  await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
}

async function createTodoItem(action: Action) {
  // For web platform, we'll create a downloadable text file
  if (Platform.OS === 'web') {
    const content = `TODO: ${action.title}\nDue: ${action.date ? format(action.date, 'PPP') : 'No deadline'}\nDetails: ${action.details || 'No details'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-${action.title}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    return;
  }

  // For native platforms, we could integrate with the device's reminders/todo app
  // This would require additional native modules
}

async function createNote(action: Action) {
  const noteContent = `# ${action.title}\n\n${action.details || ''}\n\nCreated: ${format(action.created_at, 'PPP')}`;
  
  if (Platform.OS === 'web') {
    const blob = new Blob([noteContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-${action.title}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
    return;
  }

  // For native platforms
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(
      `data:text/markdown;base64,${Buffer.from(noteContent).toString('base64')}`,
      {
        mimeType: 'text/markdown',
        dialogTitle: 'Share Note',
        UTI: 'public.markdown',
      }
    );
  }
}

function generateICSFile(action: Action): string {
  const startDate = action.date!.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(action.date!.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0] + 'Z';

  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${action.title}
DESCRIPTION:${action.details || ''}
END:VEVENT
END:VCALENDAR`;
}

export async function updateActionStatus(
  id: string,
  status: Action['status']
): Promise<Action> {
  try {
    const actionIndex = actionsStore.findIndex(a => a.id === id);
    if (actionIndex === -1) {
      throw new Error('Action not found');
    }

    actionsStore[actionIndex] = {
      ...actionsStore[actionIndex],
      status
    };

    return ActionSchema.parse(actionsStore[actionIndex]);
  } catch (error) {
    console.error('Error updating action:', error);
    throw new Error('Failed to update action');
  }
}

export async function getActions(): Promise<Action[]> {
  try {
    return actionsStore.sort((a, b) => 
      b.created_at.getTime() - a.created_at.getTime()
    );
  } catch (error) {
    console.error('Error fetching actions:', error);
    throw new Error('Failed to fetch actions');
  }
}

export async function shareAction(action: Action) {
  const content = `${action.type.toUpperCase()}: ${action.title}\n\n${
    action.details || ''
  }${
    action.date ? `\n\nDate: ${format(action.date, 'PPP')}` : ''
  }\n\nStatus: ${action.status}`;

  if (Platform.OS === 'web') {
    if (navigator.share) {
      await navigator.share({
        title: action.title,
        text: content,
      });
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    }
    return;
  }

  // For native platforms
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(
      `data:text/plain;base64,${Buffer.from(content).toString('base64')}`,
      {
        dialogTitle: 'Share Action',
        mimeType: 'text/plain',
        UTI: 'public.plain-text',
      }
    );
  }
}