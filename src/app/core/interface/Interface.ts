// models/launch.model.ts
export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  rocket: string;
  success: boolean | null;
  upcoming: boolean;
  details?: string;
  links: {
    wikipedia?: string;
    youtube_id?: string;
    reddit?: { article?: string };
  };
  payloads: string[];
}

// models/rocket.model.ts
export interface Rocket {
  id: string;
  name: string;
  type: string;
  stages: number;
  description: string;
  flickr_images: string[];
}

// models/payload.model.ts
export interface Payload {
  id: string;
  type: string;
  mass_kg: number;
  orbit: string;
}
export interface Launchpad {
  id: string;
  name: string;
  locality: string;
  region: string;
  status: string;
}