export interface BriefForm {
  field: string | null;
  difficulty: string | null;
  duration: string | null;
  client: string | null;
  budget: string | null;
  styles: string[];
  refUrl: string;
  avoid: string;
}

export interface Persona {
  company: string;
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface BriefData {
  persona: Persona;
  project: { name: string; purpose: string };
  dates: { kickoff: string; mid: string; final: string };
  target: { age: string; gender: string; lifestyle: string };
  emotion: string;
  deliverable: string;
  budget: string;
  difficulty: string;
  fieldLabel: string;
  durationLabel: string;
  styleLabels: string;
  refUrl: string;
  avoid: string;
}

export interface Lookup {
  field: Record<string, string>;
  difficulty: Record<string, string>;
  duration: Record<string, string>;
  client: Record<string, string>;
  budget: Record<string, string>;
  styles: Record<string, string>;
}
