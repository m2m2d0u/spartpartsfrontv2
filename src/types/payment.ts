import type { Auditable } from "./common";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "check"
  | "mobile_money"
  | "card"
  | "other";

export type Payment = Auditable & {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  paymentDate: string;
  notes: string;
};
