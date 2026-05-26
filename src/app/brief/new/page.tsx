import { getProfile } from '@/lib/supabase/profiles';
import BriefNewClient from '@/components/brief/BriefNewClient';

export default async function BriefNewPage() {
  const profile = await getProfile();
  return <BriefNewClient preferredField={profile?.preferred_design_type ?? null} />;
}
