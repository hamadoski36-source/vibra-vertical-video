import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function VibraSheet({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="vibra-sheet-overlay" />
      <Dialog.Content className="vibra-sheet" aria-describedby={undefined}>
        <header><Dialog.Title>{title}</Dialog.Title><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close panel"><X /></Button></Dialog.Close></header>
        <div className="vibra-sheet-body">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}