import { useState } from 'react';
import UploadBasemapDialog from '../UploadBasemapDialog';
import { Button } from '@/components/ui/button';

export default function UploadBasemapDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <UploadBasemapDialog
        open={open}
        onOpenChange={setOpen}
        onUpload={(data) => console.log('Uploaded:', data)}
      />
    </div>
  );
}
