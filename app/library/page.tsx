'use client';
import ResourcePage from '@/components/ResourcePage';

export default function Library() {
  return (
    <ResourcePage 
      title="Central Library Study Pods"
      type="library"
      description="Quiet, isolated study pods within the central library, perfect for focused individual work or small group discussions."
      image="https://picsum.photos/seed/library/1200/400"
      capacity={4}
      features={['Power Outlets', 'Soundproof', 'Whiteboard', 'Ergonomic Chairs', 'Reading Lights']}
    />
  );
}
