export type UserRole = 'user' | 'vip' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isVip: boolean;
  createdAt: Date;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  firstPaymentCompleted?: boolean;
  commissionGenerated?: boolean;
  totalEarnings?: number;
}

export type AlertSeverity = 'info' | 'warning' | 'alert';

export interface CityAlert {
  id?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  createdAt: Date;
  updatedAt: Date;
}

export type TipType = 'economy' | 'leisure' | 'reminder';

export interface DailyTip {
  id?: string;
  title: string;
  content: string;
  type: TipType;
  date: string; // ISO Date YYYY-MM-DD
}

export interface AffiliateProduct {
  id?: string;
  name: string;
  image: string;
  price: number;
  affiliateLink: string;
  category: string;
  createdAt: Date;
}

export interface ChatSession {
  id?: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
