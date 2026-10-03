import { redirect } from 'next/navigation';

// The workspace is the app; there's no separate landing page.
export default function HomePage() {
  redirect('/submissions');
}
