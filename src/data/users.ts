import { UserProfile, BankAccountInfo } from '../types';

export const mockUser: UserProfile = {
  id: 'usr-108',
  name: 'Nguyễn Văn An',
  phone: '0988 123 456',
  email: 'nguyenvanan.tech@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  memberTier: 'Vàng',
  referralCode: 'HOANXU88',
  totalReferredCount: 6,
  totalReferralBonus: 60000,
};

export const defaultSavedBankAccounts: BankAccountInfo[] = [
  {
    bankName: 'MB Bank (Quân Đội)',
    accountNumber: '03889998888',
    accountName: 'NGUYEN VAN AN',
  },
  {
    bankName: 'Techcombank',
    accountNumber: '19036789012015',
    accountName: 'NGUYEN VAN AN',
  },
  {
    bankName: 'Vietcombank',
    accountNumber: '1025588990',
    accountName: 'NGUYEN VAN AN',
  },
];
