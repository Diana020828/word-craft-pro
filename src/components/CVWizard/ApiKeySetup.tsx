import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key } from 'lucide-react';
import { openaiService } from '@/services/openaiService';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onComplete: () => void;
}

export const ApiKeySetup = ({ onComplete }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa tu API Key de OpenAI',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      openaiService.setApiKey(apiKey);
      toast({
        title: 'API Key configurada',
        description: 'Tu API Key se ha guardado correctamente',
      });
      onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al configurar la API Key',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Configuración Inicial</CardTitle>
          <CardDescription>
            Para mejorar automáticamente las descripciones de tu CV, necesitamos tu API Key de OpenAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key de OpenAI</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p>• Tu API Key se guarda solo en tu navegador (localStorage)</p>
              <p>• No se envía a ningún servidor externo</p>
              <p>• Puedes obtener una API Key en platform.openai.com</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Configurando...' : 'Continuar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};