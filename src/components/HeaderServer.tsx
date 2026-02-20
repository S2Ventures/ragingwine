import { getCities } from '@/lib/sanity';
import Header from './Header';

export default async function HeaderServer() {
  const cities = await getCities();
  return <Header cities={cities} />;
}
