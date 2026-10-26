import { UserProfile } from '../types';

const GOLD_THRESHOLD = 500000;
const DIAMOND_THRESHOLD = 2000000;

/**
 * Hạng thành viên dựa trên tổng tiền đã tích lũy trong ví.
 */
export function getMemberTier(totalEarned: number): UserProfile['memberTier'] {
  if (totalEarned >= DIAMOND_THRESHOLD) return 'Kim Cương';
  if (totalEarned >= GOLD_THRESHOLD) return 'Vàng';
  return 'Bạc';
}
