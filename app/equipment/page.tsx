'use client';
import ResourcePage from '@/components/ResourcePage';

export default function Equipment() {
  return (
    <ResourcePage 
      title="Media & Tech Equipment"
      type="equipment"
      description="Borrow cameras, microphones, tripods, and other specialized tech equipment for your projects and assignments."
      image="https://picsum.photos/seed/equipment/1200/400"
      capacity={100}
      features={['DSLR Cameras', 'Microphones', 'Tripods', 'Lighting Kits', 'Drawing Tablets']}
    />
  );
}
