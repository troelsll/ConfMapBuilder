import { useState } from 'react';
import CreateMapDialog from '../CreateMapDialog';
import { Button } from '@/components/ui/button';

export default function CreateMapDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <CreateMapDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(data) => console.log('Saved:', data)}
      />
    </div>
  );
}
