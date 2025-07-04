'use client';

import { InspectionList } from '@/components/inspections/inspection-list';

export default function ClientInspectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <InspectionList userRole="CLIENT" />
    </div>
  );
}