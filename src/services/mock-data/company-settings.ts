import type { CompanySettings } from "@/types";

export let companySettings: CompanySettings = {
  id: "comp-001",
  businessName: "SenParts SARL",
  logoUrl: null,
  address: {
    street: "123 Avenue Cheikh Anta Diop",
    city: "Dakar",
    state: "Dakar",
    postalCode: "11000",
    country: "Sénégal",
  },
  phone: "+221 33 800 00 00",
  email: "contact@senparts.sn",
  taxId: "SN-TAX-2024-001",
  ninea: "005234567 2G3",
  rccm: "SN-DKR-2024-B-12345",
  taxRates: [
    { id: "tax-01", label: "TVA 18%", rate: 18, isDefault: true },
    { id: "tax-02", label: "TVA Réduite 10%", rate: 10, isDefault: false },
    { id: "tax-03", label: "Exonéré", rate: 0, isDefault: false },
  ],
  currency: {
    symbol: "FCFA",
    position: "after",
    decimalPlaces: 0,
  },
  invoiceDefaults: {
    proformaPrefix: "PRO",
    invoicePrefix: "FAC",
    depositPrefix: "ACO",
    creditNotePrefix: "AVO",
    orderPrefix: "CMD",
    defaultPaymentTerms: 30,
    defaultProformaValidity: 30,
    defaultInvoiceNotes:
      "Merci pour votre confiance. Paiement à effectuer sous 30 jours.",
    sequentialReset: "yearly",
    defaultInvoiceTemplate: "template-01",
  },
  clientPortal: {
    portalEnabled: true,
    minimumOrderAmount: 5000,
    shippingOption: "flat_rate",
    shippingFlatRate: 2500,
    termsAndConditions:
      "Les pièces vendues ne sont ni reprises ni échangées sauf en cas de défaut constaté sous 48h.",
  },
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2026-02-20T14:30:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

export function setCompanySettings(updated: CompanySettings) {
  companySettings = updated;
}
