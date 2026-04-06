import * as Notifications from 'expo-notifications';
import { getFutureCards } from './cardRepository';
import { parseSQLiteDatetime } from './scheduler';

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function scheduleCardDueNotification(
  cardId: number,
  nextReviewAt: Date
): Promise<void> {
  const now = new Date();
  const seconds = Math.max(1, Math.floor((nextReviewAt.getTime() - now.getTime()) / 1000));

  await Notifications.scheduleNotificationAsync({
    identifier: `card-due-${cardId}`,
    content: {
      title: 'Cards Ready for Review',
      body: 'You have flashcards waiting to be reviewed!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });
}

export async function cancelCardNotification(cardId: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(`card-due-${cardId}`);
}

export async function rescheduleAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const futureCards = await getFutureCards();
  const now = new Date();

  for (const card of futureCards) {
    const reviewDate = parseSQLiteDatetime(card.next_review_at);
    if (reviewDate > now) {
      await scheduleCardDueNotification(card.id, reviewDate);
    }
  }
}
