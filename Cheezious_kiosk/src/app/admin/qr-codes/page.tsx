
'use client';

import { useState, useEffect } from 'react';
import { useQRCode } from 'next-qrcode';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Utensils, ShoppingBag, Printer } from 'lucide-react';
import { CheeziousLogo } from '@/components/icons/CheeziousLogo';

function QRCodeDisplay({ title, icon: Icon, url, companyName, branchName }: { title: string; icon: React.ElementType; url: string; companyName: string; branchName: string }) {
  const { Image: QRCodeImage } = useQRCode();

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl printable-area">
      <CheeziousLogo className="h-16 w-16 mx-auto text-primary" />
      <h3 className="mt-4 text-2xl font-bold font-headline">{companyName}</h3>
      <p className="text-muted-foreground">{branchName}</p>
      
      <div className="my-6">
        <QRCodeImage
          text={url}
          options={{
            type: 'image/jpeg',
            quality: 1,
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200,
            color: { dark: '#000000FF', light: '#FFFFFFFF' },
          }}
        />
      </div>

      <div className="text-center">
        <Icon className="mx-auto h-12 w-12 text-primary" />
        <h4 className="mt-2 text-xl font-semibold">{title}</h4>
        <p className="text-muted-foreground">Scan this code to begin your order.</p>
      </div>
    </div>
  );
}


export default function QRCodesPage() {
  const { settings, isLoading } = useSettings();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
      if (settings.branches.length > 0) {
        setSelectedBranchId(settings.branches[0].id);
      }
    }
  }, [settings.branches]);
  
  const handlePrint = () => {
    window.print();
  };

  const selectedBranch = settings.branches.find(b => b.id === selectedBranchId);

  if (isLoading || !origin) {
    return <div>Loading...</div>;
  }

  const dineInUrl = `${origin}/branch/${selectedBranchId}?mode=Dine-In`;
  const takeAwayUrl = `${origin}/branch/${selectedBranchId}?mode=Take-Away`;

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center print-hidden">
        <div>
          <h1 className="font-headline text-4xl font-bold">Printable QR Codes</h1>
          <p className="text-muted-foreground">
            Generate and print QR codes for customers to start their Dine-In or Take-Away orders.
          </p>
        </div>
        <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Codes
        </Button>
      </header>

      <Card className="print-hidden">
        <CardContent className="pt-6">
          <Label htmlFor="branch-select">Select Branch</Label>
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger id="branch-select" className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {settings.branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedBranch && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QRCodeDisplay
                title="Dine-In"
                icon={Utensils}
                url={dineInUrl}
                companyName={settings.companyName}
                branchName={selectedBranch.name}
            />
            <QRCodeDisplay
                title="Take Away"
                icon={ShoppingBag}
                url={takeAwayUrl}
                companyName={settings.companyName}
                branchName={selectedBranch.name}
            />
          </div>
      )}
    </div>
  );
}
