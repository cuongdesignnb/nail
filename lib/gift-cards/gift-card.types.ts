export type GiftCardMode = "AMOUNT" | "SERVICE";

export type PublicGiftCardService = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  categoryId: string | null;
};

export type PublicGiftCardCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  services: PublicGiftCardService[];
};

export type GiftCardCatalog = {
  settings: {
    currency: string;
    amountPresetValues: number[];
    minCustomAmount: number;
    maxCustomAmount: number;
    allowCustomAmount: boolean;
    giftCardsEnabled: boolean;
  };
  categories: PublicGiftCardCategory[];
  paypal: {
    enabled: boolean;
    clientId: string | null;
    currency: string;
  };
  email: {
    ready: boolean;
    configured: boolean;
    verified: boolean;
  };
};
