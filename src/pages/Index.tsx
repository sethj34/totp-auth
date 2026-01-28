import { useState, useEffect } from 'react';
import { Shield, Lock } from 'lucide-react';
import { AuthEntryCard } from '@/components/AuthEntryCard';
import { AddEntryDialog } from '@/components/AddEntryDialog';
import { AuthEntry, getStoredEntries, deleteEntry } from '@/lib/totp';

const Index = () => {
  const [entries, setEntries] = useState<AuthEntry[]>([]);
  
  useEffect(() => {
    setEntries(getStoredEntries());
  }, []);
  
  const handleAddEntry = (entry: AuthEntry) => {
    setEntries(prev => [...prev, entry]);
  };
  
  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary-sm">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Authenticator</h1>
                <p className="text-xs text-muted-foreground">Two-factor authentication</p>
              </div>
            </div>
            <AddEntryDialog onAdd={handleAddEntry} />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <Lock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No accounts yet</h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              Add your first authentication account to start generating secure one-time codes. Codes are saved locally and never leave your device.
            </p>
            <AddEntryDialog onAdd={handleAddEntry} />
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <AuthEntryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
