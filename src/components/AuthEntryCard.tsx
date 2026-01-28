import { useState, useEffect } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CountdownRing } from './CountdownRing';
import { AuthEntry, generateTOTP, getTimeRemaining } from '@/lib/totp';
import { toast } from 'sonner';

interface AuthEntryCardProps {
  entry: AuthEntry;
  onDelete: (id: string) => void;
}

export function AuthEntryCard({ entry, onDelete }: AuthEntryCardProps) {
  const [code, setCode] = useState(() => generateTOTP(entry.secret));
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const updateCode = () => {
      const remaining = getTimeRemaining();
      // Update code when timer resets
      if (remaining === 30) {
        setCode(generateTOTP(entry.secret));
      }
    };
    
    const interval = setInterval(updateCode, 1000);
    return () => clearInterval(interval);
  }, [entry.secret]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };
  
  const handleDelete = () => {
    onDelete(entry.id);
    toast.success(`${entry.name} removed`);
  };
  
  const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`;
  
  return (
    <Card className="group p-4 bg-card hover:bg-secondary/50 transition-all duration-200 border-border hover:border-primary/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-lg">
              {entry.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{entry.name}</h3>
            {entry.issuer && (
              <p className="text-sm text-muted-foreground truncate">{entry.issuer}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="font-mono text-2xl font-semibold tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            {formattedCode}
          </button>
          
          <CountdownRing size={36} strokeWidth={2.5} />
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
