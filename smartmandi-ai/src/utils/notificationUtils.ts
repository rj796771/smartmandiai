import { PriceAlert } from '../components/PriceAlertModal';
import { POPULAR_CROPS, SAMPLE_MANDIS } from '../data/mandisData';

export interface TriggeredAlert {
  alert: PriceAlert;
  currentPrice: number;
  mandiName: string;
  triggeredAt: string;
}

/**
 * Request Browser Notification permission if supported
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Notification permission error:', e);
      return 'denied';
    }
  }
  return 'denied';
}

/**
 * Check if browser notification permission is currently granted
 */
export function isBrowserNotificationGranted(): boolean {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission === 'granted';
  }
  return false;
}

/**
 * Sends a native Web Browser Notification if permitted
 */
export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
      notif.onclick = () => {
        window.focus();
      };
      return true;
    } catch (e) {
      console.warn('Browser notification trigger failed:', e);
    }
  }
  return false;
}

/**
 * Evaluates active user price alerts against current market prices & historical trend data.
 * Returns array of alerts that met or exceeded the target condition.
 */
export function checkPriceAlerts(alerts: PriceAlert[]): TriggeredAlert[] {
  const activeAlerts = alerts.filter(a => a.active);
  const triggered: TriggeredAlert[] = [];

  activeAlerts.forEach(alert => {
    // Find market price for the crop & mandi
    const crop = POPULAR_CROPS.find(c => c.id === alert.cropId);
    if (!crop) return;

    // Determine current market price (from specific mandi or max price across all mandis)
    let currentPrice = crop.defaultPricePerQuintal;
    let mandiName = alert.mandiName;

    if (alert.mandiName !== 'All Mandis in Maharashtra') {
      const mandi = SAMPLE_MANDIS.find(m => m.name === alert.mandiName);
      if (mandi) {
        currentPrice = mandi.pricePerQuintal;
      }
    } else {
      // Find peak current market price in Maharashtra
      const maxMandiPrice = Math.max(...SAMPLE_MANDIS.map(m => m.pricePerQuintal));
      if (maxMandiPrice > 0) {
        currentPrice = maxMandiPrice;
      }
    }

    let isTriggered = false;
    if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
      isTriggered = true;
    } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
      isTriggered = true;
    } else if (alert.condition === 'daily') {
      isTriggered = true;
    }

    if (isTriggered) {
      triggered.push({
        alert,
        currentPrice,
        mandiName,
        triggeredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    }
  });

  return triggered;
}
