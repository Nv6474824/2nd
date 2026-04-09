'use client';
import ResourcePage from '@/components/ResourcePage';

export default function Gym() {
  return (
    <ResourcePage 
      title="Main Campus Gym"
      type="gym"
      description="State-of-the-art fitness center equipped with modern cardio machines, free weights, and dedicated spaces for yoga and aerobics."
      image="https://picsum.photos/seed/gym/1200/400"
      capacity={50}
      features={['Cardio Equipment', 'Free Weights', 'Showers', 'Lockers', 'Water Station']}
    />
  );
}
