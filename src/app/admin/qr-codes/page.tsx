

'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useQRCode } from 'next-qrcode';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Utensils, ShoppingBag, Printer, Download, Image as ImageIcon } from 'lucide-react';
import type { Table, Floor } from '@/lib/types';
import jsPDF from "jspdf";

const loadHtml2Canvas = () => {
  return new Promise<any>((resolve, reject) => {
    const existingScript = document.getElementById('html2canvas-script');
    if (existingScript && (window as any).html2canvas) {
      resolve((window as any).html2canvas);
      return;
    }
    const script = document.createElement('script');
    script.id = 'html2canvas-script';
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => resolve((window as any).html2canvas);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};


interface QRCodeDisplayProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  url: string;
  companyName: string;
  branchName: string;
  qrId: string;
}


function QRCodeDisplay({ title, subtitle, icon: Icon, url, companyName, branchName, qrId }: QRCodeDisplayProps) {
  const { Canvas } = useQRCode();
  const printRef = useRef<HTMLDivElement>(null);

  const captureCardAsCanvas = useCallback(async () => {
    const html2canvas = await loadHtml2Canvas();
    if (!printRef.current || !html2canvas) {
      console.error("Card element not found or html2canvas not loaded.");
      return null;
    }

    const canvas = await html2canvas(printRef.current, {
        scale: 5, 
        useCORS: true,
        backgroundColor: null 
    });
    return canvas;
  }, []);


  const downloadAsPng = useCallback(async () => {
    const canvas = await captureCardAsCanvas();
    if (canvas) {
        const link = document.createElement('a');
        link.download = `${title.toLowerCase().replace(/\s/g, '-')}-${subtitle?.toLowerCase().replace(/\s/g, '-') || 'qr'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
  }, [title, subtitle, captureCardAsCanvas]);

  const downloadAsPdf = useCallback(async () => {
     const canvas = await captureCardAsCanvas();
     if(canvas){
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height] 
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${title.toLowerCase().replace(/\s/g, '-')}-${subtitle?.toLowerCase().replace(/\s/g, '-') || 'qr'}.pdf`);
     }
  }, [title, subtitle, captureCardAsCanvas]);

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl break-inside-avoid">
        <div ref={printRef} className="text-center w-full bg-card p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold font-headline text-center text-primary">{companyName}</h3>
            <p className="text-amber-800 text-center mb-6 text-lg font-semibold">{branchName}</p>
            
            <div className="flex justify-center">
            <Canvas
                text={url}
                options={{
                    type: 'image/png',
                    quality: 1,
                    errorCorrectionLevel: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: { dark: '#000000FF', light: '#FFFFFFFF' },
                }}
            />
            </div>

            <div className="text-center mt-6">
                <Icon className="mx-auto h-12 w-12 text-primary" />
                <h4 className="mt-2 text-2xl font-bold">{title}</h4>
                {subtitle && <p className="text-xl font-semibold">{subtitle}</p>}
                <p className="text-muted-foreground mt-2">Scan this code to begin your order.</p>
            </div>
        </div>

       <div className="flex gap-2 mt-6 print-hidden w-full">
            <Button variant="outline" className="w-full" onClick={downloadAsPng}>
                <ImageIcon className="mr-2 h-4 w-4" /> PNG
            </Button>
             <Button variant="outline" className="w-full" onClick={downloadAsPdf}>
                <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
        </div>
    </div>
  );
}


export default function QRCodesPage() {
  const { settings, isLoading } = useSettings();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadHtml2Canvas(); 
      setOrigin(window.location.origin);
      if (settings.branches.length > 0) {
        setSelectedBranchId(settings.defaultBranchId || settings.branches[0].id);
      }
      if (settings.floors.length > 0) {
        setSelectedFloorId(settings.floors[0].id);
      }
    }
  }, [settings.branches, settings.defaultBranchId, settings.floors]);
  
  const handlePrint = () => {
    window.print();
  };

  const { selectedBranch, tablesForSelectedFloor } = useMemo(() => {
    const branch = settings.branches.find(b => b.id === selectedBranchId);
    if (!branch) return { selectedBranch: null, tablesForSelectedFloor: [] };

    const tables = settings.tables.filter(t => t.floorId === selectedFloorId);
    
    return { selectedBranch: branch, tablesForSelectedFloor: tables };
  }, [selectedBranchId, selectedFloorId, settings.tables, settings.branches]);


  if (isLoading || !origin) {
    return <div>Loading...</div>;
  }

  const takeAwayUrl = `${origin}/branch/${selectedBranchId}?mode=Take-Away`;

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center print-hidden">
        <div>
          <h1 className="font-headline text-4xl font-bold">Printable QR Codes</h1>
          <p className="text-muted-foreground">
            Generate and print QR codes for tables and for Take Away orders.
          </p>
        </div>
        <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Visible Codes
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
          <div className="space-y-12">
            {/* Take Away Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Take Away Orders</CardTitle>
                    <CardDescription>A general-purpose QR code for customers placing take away orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-sm mx-auto">
                        <QRCodeDisplay
                            title="Take Away"
                            icon={ShoppingBag}
                            url={takeAwayUrl}
                            companyName={settings.companyName}
                            branchName={selectedBranch.name}
                            qrId="take-away"
                        />
                    </div>
                </CardContent>
            </Card>
            
            {/* Dine-In Section */}
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline text-2xl">Dine-In Orders</CardTitle>
                    <CardDescription>Select a floor to view and print the QR codes for each table.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="print-hidden">
                        <Label htmlFor="floor-select">Select Floor</Label>
                        <Select value={selectedFloorId} onValueChange={setSelectedFloorId}>
                            <SelectTrigger id="floor-select" className="w-full md:w-[300px]">
                            <SelectValue placeholder="Select a floor" />
                            </SelectTrigger>
                            <SelectContent>
                            {settings.floors.map(floor => (
                                <SelectItem key={floor.id} value={floor.id}>
                                {floor.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="columns-1 md:columns-2 xl:columns-3 gap-8 printable-grid">
                        {tablesForSelectedFloor.map(table => {
                            const floor = settings.floors.find(f => f.id === table.floorId);
                            return (
                                <QRCodeDisplay
                                    key={table.id}
                                    title="Dine-In"
                                    subtitle={`${floor?.name || ''} - ${table.name}`}
                                    icon={Utensils}
                                    url={`${origin}/branch/${selectedBranchId}?mode=Dine-In&tableId=${table.id}&floorId=${table.floorId}`}
                                    companyName={settings.companyName}
                                    branchName={selectedBranch.name}
                                    qrId={`table-${table.id}`}
                                />
                            )
                        })}
                    </div>
                    {tablesForSelectedFloor.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No tables found for the selected floor. Add tables in the Admin Settings.</p>
                    )}
                </CardContent>
            </Card>
          </div>
      )}
    </div>
  );
}
