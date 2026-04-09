'use client';
import ResourcePage from '@/components/ResourcePage';

export default function Labs() {
  return (
    <ResourcePage 
      title="Computer Science Labs"
      type="labs"
      description="High-performance computing labs equipped with the latest software and hardware for programming, design, and research."
      image="https://picsum.photos/seed/labs/1200/400"
      capacity={40}
      features={['High-End PCs', 'Dual Monitors', 'Linux/Windows', 'Fast WiFi', 'Whiteboards']}
    />
  );
}
