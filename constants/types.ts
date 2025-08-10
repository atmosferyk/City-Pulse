export type City = {
    name: string;
    latitude: number;
    longitude: number;
    countryCode: string;   // "PL"
    admin1?: string | null; // voivodeship
    admin2?: string | null;
    timezone?: string | null;
    label: string;         // e.g., "Szczecin, Zachodniopomorskie"
  };
  