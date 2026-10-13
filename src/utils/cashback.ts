/**
 * Tỉ lệ chia hoa hồng cho người mua.
 * product.cashbackRate = tổng hoa hồng từ affiliate (100%).
 * Người mua nhận 70%, app giữ 30% làm phí vận hành.
 */
export const USER_CASHBACK_SHARE = 0.5;

/** Rate thực tế người mua được nhận (vd: 0.08 -> 0.056). */
export const getUserCashbackRate = (cashbackRate: number): number =>
  cashbackRate * USER_CASHBACK_SHARE;

/** Số tiền hoàn người mua được nhận, làm tròn đồng. */
export const getUserCashbackAmount = (price: number, cashbackRate: number): number =>
  Math.round(price * cashbackRate * USER_CASHBACK_SHARE);
