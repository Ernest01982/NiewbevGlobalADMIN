import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CircleCheck as CheckCircle2, ClipboardList, PackageCheck, PackagePlus, Phone, ShoppingBasket, Truck } from 'lucide-react';

type Role = 'picker' | 'receiver' | 'stocktaker' | 'checker' | 'driver';

const demoPickingLines = [
  { id: 'L1', sku: 'NB-APPLE-CASE', name: 'Apple Juice 1L', lot: 'A1-2409', reqCases: 10 },
  { id: 'L2', sku: 'NB-ORANGE-CASE', name: 'Orange Juice 1L', lot: 'B2-2408', reqCases: 6 },
];

const demoInvoices = [
  { inv: 'INV-10041', customer: 'Café Umoya' },
  { inv: 'INV-10042', customer: 'Market on 7th' },
];

export default function MobileApp() {
  const [role, setRole] = useState<Role>('picker');

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-pink-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400">Niew Bev</span>
          </div>
          <RoleSwitcher value={role} onChange={setRole} />
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {role === 'picker' && <PickerHome />}
        {role === 'receiver' && <ReceiverHome />}
        {role === 'stocktaker' && <StockTakerHome />}
        {role === 'checker' && <CheckerHome />}
        {role === 'driver' && <DriverHome />}
      </main>

      <footer className="mx-auto max-w-md px-4 pb-6 pt-2 text-center text-[11px] text-slate-500">
        MVP front-end stubs • Mobile-first • No backend yet
      </footer>
    </div>
  );
}

function RoleSwitcher({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  const roles: { key: Role; label: string }[] = [
    { key: 'picker', label: 'Picker' },
    { key: 'receiver', label: 'Receiver' },
    { key: 'stocktaker', label: 'Stock Taker' },
    { key: 'checker', label: 'Checker' },
    { key: 'driver', label: 'Driver' },
  ];
  return (
    <div className="flex gap-1 flex-wrap">
      {roles.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={`rounded-full px-3 py-1 text-xs ${
            value === r.key ? 'bg-white text-black' : 'bg-white/10 text-slate-200'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function PickerHome() {
  const [lines, setLines] = useState(demoPickingLines);
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const markPicked = (id: string) => setLines((xs) => xs.filter((l) => l.id !== id));

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <ShoppingBasket className="h-5 w-5" /> Picking List
      </h2>
      {lines.length === 0 && <EmptyCard title="All done" subtitle="No open pick lines." />}
      {lines.map((l) => (
        <Card key={l.id} className="bg-white/5 border-white/10 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> {l.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 space-y-3">
            <div className="flex justify-between">
              <span>SKU</span>
              <span className="text-slate-200">{l.sku}</span>
            </div>
            <div className="flex justify-between">
              <span>Lot</span>
              <span className="text-slate-200">{l.lot}</span>
            </div>
            <div className="flex justify-between">
              <span>Required</span>
              <span className="text-slate-200">{l.reqCases} cases</span>
            </div>
            <Separator className="bg-white/10" />
            <PhotoField
              label="Take photo to confirm (verify Product, Barcode, Lot#)"
              required
              onCaptured={() => setVerified((v) => ({ ...v, [l.id]: true }))}
              showTick={verified[l.id]}
            />
            <div className="text-[11px] text-slate-400">
              No quantity entry needed — photo verification marks this line as picked.
            </div>
            <Button className="w-full" disabled={!verified[l.id]} onClick={() => markPicked(l.id)}>
              {verified[l.id] ? 'Mark picked' : 'Take photo to enable'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function ReceiverHome() {
  const [_count, setCount] = useState<any>({ mode: 'pallet' });
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <PackagePlus className="h-5 w-5" /> Receive
      </h2>
      <Card className="bg-white/5 border-white/10 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Capture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <PhotoField label="Label (required)" required />
          <PhotoField label="Invoice (required)" required />
          <Separator className="bg-white/10" />
          <CountMode
            allowUnits={true}
            allowedModes={['pallet', 'cases', 'units']}
            onChange={setCount}
          />
          <Button className="w-full">Submit (enqueue)</Button>
        </CardContent>
      </Card>
    </section>
  );
}

function StockTakerHome() {
  const [area, setArea] = useState<'bulk' | 'pick_face' | 'singles'>('bulk');
  const [_count, setCount] = useState<any>({});

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <ClipboardList className="h-5 w-5" /> Stock Take
      </h2>
      <Card className="bg-white/5 border-white/10 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Area & Count</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="flex gap-2">
            <Chip selected={area === 'bulk'} onClick={() => setArea('bulk')}>
              Bulk
            </Chip>
            <Chip selected={area === 'pick_face'} onClick={() => setArea('pick_face')}>
              Pick Face
            </Chip>
            <Chip selected={area === 'singles'} onClick={() => setArea('singles')}>
              Singles
            </Chip>
          </div>
          <PhotoField label="Label (required)" required />
          {area === 'pick_face' && (
            <LabeledInput label="Bin # (pick face)" placeholder="e.g., PF-02-07" />
          )}

          {area === 'bulk' && (
            <CountFields pallets cases onChange={(v) => setCount({ area, ...v })} />
          )}
          {area === 'pick_face' && (
            <CountFields layers cases onChange={(v) => setCount({ area, ...v })} />
          )}
          {area === 'singles' && (
            <CountFields cases units onChange={(v) => setCount({ area, ...v })} />
          )}

          <Button className="w-full">Submit (enqueue)</Button>
        </CardContent>
      </Card>
    </section>
  );
}

function CheckerHome() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5" /> Cage Check
      </h2>
      <Card className="bg-white/5 border-white/10 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Verify load</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <PhotoField label="Cage photo (required)" required />
          <div className="grid grid-cols-2 gap-2">
            <LabeledInput label="Driver name" placeholder="e.g., T. Mokoena" />
            <LabeledInput label="Vehicle reg" placeholder="CA 123 456" />
          </div>
          <Separator className="bg-white/10" />
          <CountMode allowUnits={false} onChange={() => {}} />
          <Button className="w-full">Approve & Ship</Button>
        </CardContent>
      </Card>
    </section>
  );
}

function DriverHome() {
  const [invoices, setInvoices] = useState(demoInvoices);
  const complete = (inv: string) => setInvoices((xs) => xs.filter((x) => x.inv !== inv));

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Truck className="h-5 w-5" /> Deliveries
      </h2>
      {invoices.length === 0 && <EmptyCard title="All delivered" subtitle="No open invoices." />}
      {invoices.map((i) => (
        <Card key={i.inv} className="bg-white/5 border-white/10 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PackageCheck className="h-4 w-4" /> {i.inv} — {i.customer}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="grid grid-cols-2 gap-2">
              <SelectRow label="Delivered in full?" options={['Yes', 'No']} />
              <SelectRow label="Returns picked?" options={['No', 'Yes']} />
            </div>
            <Button className="w-full" onClick={() => complete(i.inv)}>
              Mark delivered
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function EmptyCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Card className="bg-white/5 border-white/10 rounded-2xl">
      <CardContent className="p-6 text-center text-slate-300">
        <p className="text-lg text-slate-100 font-semibold">{title}</p>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function LabeledInput({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <Input
        placeholder={placeholder}
        className="bg-white/10 border-white/10 text-slate-100 placeholder:text-slate-500"
      />
    </label>
  );
}

function SelectRow({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <select className="rounded-lg bg-white/10 px-3 py-2 text-slate-100 border border-white/10">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs ${
        selected ? 'bg-white text-black' : 'bg-white/10 text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function PhotoField({
  label,
  required,
  onCaptured,
  showTick,
}: {
  label: string;
  required?: boolean;
  onCaptured?: (file: File) => void;
  showTick?: boolean;
}) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const inputId = `file-${Math.random().toString(36).slice(2)}`;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setHasPhoto(true);
      onCaptured?.(f);
    }
  }

  const openCamera = () => {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    el?.click();
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300 flex items-center gap-2">
          {label}
          {(hasPhoto || showTick) && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </span>
        {required && <span className="text-[10px] text-pink-400">Required</span>}
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={openCamera}
        className="w-full rounded-lg bg-white px-3 py-2 text-black text-sm"
      >
        Take photo
      </button>
    </div>
  );
}

function CountFields({
  pallets = false,
  layers = false,
  cases = false,
  units = false,
  onChange,
}: {
  pallets?: boolean;
  layers?: boolean;
  cases?: boolean;
  units?: boolean;
  onChange: (v: any) => void;
}) {
  const [state, setState] = useState<any>({});
  function setVal(k: string, v: number) {
    const ns = { ...state, [k]: v };
    setState(ns);
    onChange(ns);
  }
  return (
    <div className="space-y-2">
      {pallets && <NumberField label="Pallets" onChange={(v) => setVal('pallets', v)} />}
      {layers && <NumberField label="Layers" onChange={(v) => setVal('layers', v)} />}
      {cases && <NumberField label="Cases" onChange={(v) => setVal('cases', v)} />}
      {units && <NumberField label="Units" onChange={(v) => setVal('units', v)} />}
    </div>
  );
}

function deriveModes(allowUnits: boolean, allowedModes?: readonly string[]) {
  const defaultModes = allowUnits
    ? ['pallet', 'layered', 'cases', 'units']
    : ['pallet', 'layered', 'cases'];
  return (allowedModes ?? defaultModes) as ('pallet' | 'layered' | 'cases' | 'units')[];
}

function CountMode({
  allowUnits = false,
  allowedModes,
  onChange,
}: {
  allowUnits?: boolean;
  allowedModes?: readonly string[];
  onChange: (v: any) => void;
}) {
  const modes = deriveModes(allowUnits, allowedModes);
  const [mode, setMode] = useState<(typeof modes)[number]>(modes[0]);
  const [state, setState] = useState<any>({});

  function setVal(k: string, v: number) {
    const ns = { ...state, [k]: v };
    setState(ns);
    onChange({ mode, ...ns });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              onChange({ mode: m, ...state });
            }}
            className={`rounded-full px-3 py-1 text-xs ${
              mode === m ? 'bg-white text-black' : 'bg-white/10 text-slate-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      {mode === 'pallet' && <NumberField label="Pallets" onChange={(v) => setVal('pallets', v)} />}
      {mode === 'layered' && (
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Layers" onChange={(v) => setVal('layers', v)} />
          <NumberField label="Cases / layer" onChange={(v) => setVal('cpl', v)} />
        </div>
      )}
      {mode === 'cases' && <NumberField label="Cases" onChange={(v) => setVal('cases', v)} />}
      {mode === 'units' && modes.includes('units') && (
        <NumberField label="Units" onChange={(v) => setVal('units', v)} />
      )}
    </div>
  );
}

function NumberField({ label, onChange }: { label: string; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type="number"
        min={0}
        className="rounded-lg bg-white/10 px-3 py-2 text-slate-100 border border-white/10"
        onChange={(e) => onChange(parseInt(e.target.value || '0'))}
      />
    </label>
  );
}
