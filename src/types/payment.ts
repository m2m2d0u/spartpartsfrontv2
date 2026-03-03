export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "CHECK"
  | "CREDIT_CARD"
  | "OTHER";

/** Mirrors backend PaymentResponse */
export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  reference: string;
  notes: string;
  createdAt: string;
};
