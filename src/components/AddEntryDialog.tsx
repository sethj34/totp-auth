import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidSecret, addEntry, AuthEntry } from '@/lib/totp';
import { toast } from 'sonner';

interface AddEntryDialogProps {
  onAdd: (entry: AuthEntry) => void;
}

export function AddEntryDialog({ onAdd }: AddEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter an account name');
      return;
    }
    
    if (!secret.trim()) {
      setError('Please enter a secret key');
      return;
    }
    
    if (!isValidSecret(secret)) {
      setError('Invalid secret key. Please enter a valid Base32 encoded key.');
      return;
    }
    
    const entry = addEntry({
      name: name.trim(),
      issuer: issuer.trim(),
      secret: secret.trim(),
    });
    
    onAdd(entry);
    toast.success(`${name} added successfully`);
    
    // Reset form
    setName('');
    setIssuer('');
    setSecret('');
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 glow-primary-sm">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Authentication Account</DialogTitle>
          <DialogDescription>
            Enter the details from your authenticator setup. The secret key is usually shown as a Base32 encoded string.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder="e.g., GitHub, Google, Discord"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer (Optional)</Label>
            <Input
              id="issuer"
              placeholder="e.g., your email or username"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secret">Secret Key *</Label>
            <Input
              id="secret"
              placeholder="JBSWY3DPEHPK3PXP"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="font-mono"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Usually a string of letters and numbers (Base32 encoded)
            </p>
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
