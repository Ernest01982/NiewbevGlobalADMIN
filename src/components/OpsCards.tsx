import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, ClipboardCheck, Truck, RotateCcw } from 'lucide-react';
import DS from '@/design-system';

const returnReasons = [
  'Expired',
  'Damaged',
  'Received Wrong order',
  'Did not Sell',
];

export function OpsCards() {
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const handleViewSubmit = (type: string) => {
    console.log(`Navigating to ${type} demo`);
  };

  const handleCaptureReturn = () => {
    console.log('Capturing return with reason:', returnReason);
    setReturnModalOpen(false);
    setReturnReason('');
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: DS.tokens.spacing.lg,
      }}>
        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DS.tokens.spacing.sm,
            }}>
              <Package size={20} style={{ color: DS.tokens.brand.primary }} />
              <CardTitle style={{ color: DS.tokens.colors.text.primary, fontSize: '1rem' }}>
                Pickers
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleViewSubmit('picking list')}
              style={{
                width: '100%',
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              View & Submit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DS.tokens.spacing.sm,
            }}>
              <ClipboardCheck size={20} style={{ color: DS.tokens.brand.primary }} />
              <CardTitle style={{ color: DS.tokens.colors.text.primary, fontSize: '1rem' }}>
                Checkers
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleViewSubmit('cage check')}
              style={{
                width: '100%',
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              View & Submit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DS.tokens.spacing.sm,
            }}>
              <Truck size={20} style={{ color: DS.tokens.brand.primary }} />
              <CardTitle style={{ color: DS.tokens.colors.text.primary, fontSize: '1rem' }}>
                Drivers
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleViewSubmit('deliveries')}
              style={{
                width: '100%',
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              View & Submit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: DS.tokens.spacing.sm,
            }}>
              <RotateCcw size={20} style={{ color: DS.tokens.brand.primary }} />
              <CardTitle style={{ color: DS.tokens.colors.text.primary, fontSize: '1rem' }}>
                Return Checker
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.sm }}>
              <Button
                onClick={() => setReturnModalOpen(true)}
                style={{
                  width: '100%',
                  backgroundColor: DS.tokens.brand.primary,
                  color: DS.tokens.brand.bg,
                }}
              >
                Capture Return
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log('View/Submit/VR')}
                style={{
                  width: '100%',
                  color: DS.tokens.colors.text.subtle,
                  borderColor: DS.tokens.colors.border,
                }}
              >
                View / Submit / VR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={returnModalOpen} onOpenChange={(open) => !open && setReturnModalOpen(false)}>
        <DialogContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
          <DialogHeader>
            <DialogTitle style={{ color: DS.tokens.colors.text.primary }}>
              Capture Return
            </DialogTitle>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
            <div>
              <Label htmlFor="product" style={{ color: DS.tokens.colors.text.subtle }}>
                Product
              </Label>
              <Input
                id="product"
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              />
            </div>

            <div>
              <Label htmlFor="lot" style={{ color: DS.tokens.colors.text.subtle }}>
                Lot #
              </Label>
              <Input
                id="lot"
                style={{
                  marginTop: DS.tokens.spacing.sm,
                  backgroundColor: DS.tokens.colors.bg.tertiary,
                  color: DS.tokens.colors.text.primary,
                  borderColor: DS.tokens.colors.border,
                }}
              />
            </div>

            <div>
              <Label htmlFor="reason" style={{ color: DS.tokens.colors.text.subtle }}>
                Reason
              </Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger
                  id="reason"
                  style={{
                    marginTop: DS.tokens.spacing.sm,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    color: DS.tokens.colors.text.primary,
                    borderColor: DS.tokens.colors.border,
                  }}
                >
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: DS.tokens.colors.bg.secondary }}>
                  {returnReasons.map((reason) => (
                    <SelectItem
                      key={reason}
                      value={reason}
                      style={{ color: DS.tokens.colors.text.primary }}
                    >
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter style={{ marginTop: DS.tokens.spacing.md }}>
            <Button
              variant="ghost"
              onClick={() => setReturnModalOpen(false)}
              style={{ color: DS.tokens.colors.text.subtle }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCaptureReturn}
              disabled={!returnReason}
              style={{
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
