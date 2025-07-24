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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-black/80 border border-green-500/30 shadow-2xl rounded-3xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/40">
            <Key className="w-7 h-7 text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-400 font-sans">Configuración Inicial</CardTitle>
          <CardDescription className="text-base text-white/80 mt-2 font-sans">
            Para mejorar automáticamente las descripciones de tu CV, necesitamos tu API Key de OpenAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-green-400 font-semibold font-sans">API Key de OpenAI</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-12 bg-black/70 border border-green-500/30 text-white placeholder:text-green-300 focus:border-green-500 focus:ring-green-500 font-sans"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-green-400 hover:text-green-300"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="text-xs text-white/60 space-y-2 font-sans">
              <p>• Tu API Key se guarda solo en tu navegador (localStorage)</p>
              <p>• No se envía a ningún servidor externo</p>
              <p>• Puedes obtener una API Key en <a href='https://platform.openai.com' target='_blank' className='text-green-400 underline'>platform.openai.com</a></p>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full py-3 text-lg shadow-lg font-sans transition-all"
            >
              {isLoading ? 'Configurando...' : 'Continuar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};