import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { type PolicySettings } from '@/types/policies';
import DS from '@/design-system';

interface PoliciesTabProps {
  policies: PolicySettings;
  onUpdate: (policies: PolicySettings) => void;
  onSave: () => void;
}

export function PoliciesTab({ policies, onUpdate, onSave }: PoliciesTabProps) {
  const handleChange = <K extends keyof PolicySettings>(
    key: K,
    value: PolicySettings[K]
  ) => {
    onUpdate({ ...policies, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: DS.tokens.spacing.sm,
        }}>
          <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
            Policies
          </CardTitle>
          <Button
            onClick={onSave}
            style={{
              backgroundColor: DS.tokens.brand.primary,
              color: DS.tokens.brand.bg,
            }}
          >
            <Save size={16} />
            Save Policies
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.xl }}>
          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Stock Holding
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
              <div>
                <Label htmlFor="stockWeeks" style={{ color: DS.tokens.colors.text.subtle }}>
                  Stock Holding (weeks)
                </Label>
                <Input
                  id="stockWeeks"
                  type="number"
                  min="1"
                  value={policies.stockHoldingWeeks}
                  onChange={(e) => handleChange('stockHoldingWeeks', parseInt(e.target.value) || 0)}
                  style={{
                    marginTop: DS.tokens.spacing.sm,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    color: DS.tokens.colors.text.primary,
                    borderColor: DS.tokens.colors.border,
                  }}
                />
              </div>
              <div>
                <Label htmlFor="reorderNote" style={{ color: DS.tokens.colors.text.subtle }}>
                  Reorder Point Policy Note
                </Label>
                <Textarea
                  id="reorderNote"
                  value={policies.reorderPointNote}
                  onChange={(e) => handleChange('reorderPointNote', e.target.value)}
                  placeholder="Optional notes on reorder point calculation"
                  style={{
                    marginTop: DS.tokens.spacing.sm,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    color: DS.tokens.colors.text.primary,
                    borderColor: DS.tokens.colors.border,
                    minHeight: '80px',
                  }}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Expiry Alert Thresholds
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <Label htmlFor="alert90" style={{ color: DS.tokens.colors.text.subtle }}>
                  90 Days Alert
                </Label>
                <Switch
                  id="alert90"
                  checked={policies.expiryAlert90Days}
                  onCheckedChange={(checked) => handleChange('expiryAlert90Days', checked)}
                />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <Label htmlFor="alert60" style={{ color: DS.tokens.colors.text.subtle }}>
                  60 Days Alert
                </Label>
                <Switch
                  id="alert60"
                  checked={policies.expiryAlert60Days}
                  onCheckedChange={(checked) => handleChange('expiryAlert60Days', checked)}
                />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <Label htmlFor="alert30" style={{ color: DS.tokens.colors.text.subtle }}>
                  30 Days Alert
                </Label>
                <Switch
                  id="alert30"
                  checked={policies.expiryAlert30Days}
                  onCheckedChange={(checked) => handleChange('expiryAlert30Days', checked)}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              FIFO Exceptions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <Label htmlFor="fifoExceptions" style={{ color: DS.tokens.colors.text.subtle }}>
                  Allow latest lot for selected clients
                </Label>
                <Switch
                  id="fifoExceptions"
                  checked={policies.allowFifoExceptions}
                  onCheckedChange={(checked) => handleChange('allowFifoExceptions', checked)}
                />
              </div>
              {policies.allowFifoExceptions && (
                <div>
                  <Label htmlFor="clientCodes" style={{ color: DS.tokens.colors.text.subtle }}>
                    Client Codes (comma-separated)
                  </Label>
                  <Textarea
                    id="clientCodes"
                    value={policies.fifoExceptionClients}
                    onChange={(e) => handleChange('fifoExceptionClients', e.target.value)}
                    placeholder="CLIENT001, CLIENT002, CLIENT003"
                    style={{
                      marginTop: DS.tokens.spacing.sm,
                      backgroundColor: DS.tokens.colors.bg.tertiary,
                      color: DS.tokens.colors.text.primary,
                      borderColor: DS.tokens.colors.border,
                      minHeight: '80px',
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Transfers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <Label htmlFor="enableIBT" style={{ color: DS.tokens.colors.text.subtle }}>
                  Enable Inter-Branch Transfers
                </Label>
                <Switch
                  id="enableIBT"
                  checked={policies.enableIBT}
                  onCheckedChange={(checked) => handleChange('enableIBT', checked)}
                />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: DS.tokens.spacing.sm,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <Label htmlFor="requireApproval" style={{ color: DS.tokens.colors.text.subtle }}>
                  Require Approval
                </Label>
                <Switch
                  id="requireApproval"
                  checked={policies.requireTransferApproval}
                  onCheckedChange={(checked) => handleChange('requireTransferApproval', checked)}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Photo Retention
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.md }}>
              <div>
                <Label htmlFor="rawDays" style={{ color: DS.tokens.colors.text.subtle }}>
                  Raw Photos (days)
                </Label>
                <Input
                  id="rawDays"
                  type="number"
                  min="1"
                  value={policies.photoRetentionRawDays}
                  onChange={(e) => handleChange('photoRetentionRawDays', parseInt(e.target.value) || 0)}
                  style={{
                    marginTop: DS.tokens.spacing.sm,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    color: DS.tokens.colors.text.primary,
                    borderColor: DS.tokens.colors.border,
                  }}
                />
              </div>
              <div>
                <Label htmlFor="proofDays" style={{ color: DS.tokens.colors.text.subtle }}>
                  Proof Photos (days)
                </Label>
                <Input
                  id="proofDays"
                  type="number"
                  min="1"
                  value={policies.photoRetentionProofDays}
                  onChange={(e) => handleChange('photoRetentionProofDays', parseInt(e.target.value) || 0)}
                  style={{
                    marginTop: DS.tokens.spacing.sm,
                    backgroundColor: DS.tokens.colors.bg.tertiary,
                    color: DS.tokens.colors.text.primary,
                    borderColor: DS.tokens.colors.border,
                  }}
                />
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
