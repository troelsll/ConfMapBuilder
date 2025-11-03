import { useState } from 'react';
import AddPOIDialog from '../AddPOIDialog';
import { Button } from '@/components/ui/button';

export default function AddPOIDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <AddPOIDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={(data) => console.log('Added:', data)}
      />
    </div>
  );
}
