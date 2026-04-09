'use client';
import ResourcePage from '@/components/ResourcePage';

export default function Auditorium() {
  return (
    <ResourcePage 
      title="Grand Auditorium"
      type="auditorium"
      description="A large, acoustically treated hall perfect for lectures, seminars, cultural events, and large gatherings."
      image="https://picsum.photos/seed/auditorium/1200/400"
      capacity={500}
      features={['Projector', 'PA System', 'Stage Lighting', 'Air Conditioning', 'Wheelchair Accessible']}
    />
  );
}
