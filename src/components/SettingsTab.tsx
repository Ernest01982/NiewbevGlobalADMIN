import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getStockholdingConfig, updateStockholdingConfig, type StockholdingConfig } from '@/lib/settingsService';
import DS from '@/design-system';

export function SettingsTab() {
  const [stockholdingConfig, setStockholdingConfig] = useState<StockholdingConfig>({
    defaultWeeks: 8,
    minWeeks: 1,
    maxWeeks: 52,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const config = await getStockholdingConfig();
      setStockholdingConfig(config);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStockholdingConfig = async () => {
    if (stockholdingConfig.minWeeks >= stockholdingConfig.defaultWeeks) {
      toast.error('Minimum weeks must be less than default weeks');
      return;
    }
    if (stockholdingConfig.defaultWeeks >= stockholdingConfig.maxWeeks) {
      toast.error('Default weeks must be less than maximum weeks');
      return;
    }
    if (stockholdingConfig.minWeeks <= 0) {
      toast.error('Minimum weeks must be greater than 0');
      return;
    }

    setSaving(true);
    try {
      await updateStockholdingConfig(stockholdingConfig);
      toast.success('Stockholding configuration saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportTokens = () => {
    const tokensJSON = JSON.stringify(DS.tokens, null, 2);
    const blob = new Blob([tokensJSON], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ui-tokens.json';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: DS.tokens.colors.text.primary }}>
          Settings
        </CardTitle>
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
              Stockholding Configuration
            </h3>
            <p style={{
              color: DS.tokens.colors.text.subtle,
              fontSize: '0.875rem',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Configure default stockholding parameters and validation bounds for inventory management
            </p>

            {loading ? (
              <div style={{
                padding: DS.tokens.spacing.md,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
                textAlign: 'center',
                color: DS.tokens.colors.text.subtle,
              }}>
                Loading settings...
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: DS.tokens.spacing.md,
                padding: DS.tokens.spacing.md,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.xs }}>
                  <Label htmlFor="defaultWeeks" style={{ color: DS.tokens.colors.text.primary }}>
                    Default Stockholding Weeks
                  </Label>
                  <Input
                    id="defaultWeeks"
                    type="number"
                    min="1"
                    step="0.5"
                    value={stockholdingConfig.defaultWeeks}
                    onChange={(e) => setStockholdingConfig({
                      ...stockholdingConfig,
                      defaultWeeks: parseFloat(e.target.value) || 8,
                    })}
                    style={{
                      backgroundColor: DS.tokens.colors.bg.secondary,
                      borderColor: DS.tokens.colors.border,
                      color: DS.tokens.colors.text.primary,
                    }}
                  />
                  <p style={{
                    color: DS.tokens.colors.text.dim,
                    fontSize: '0.75rem',
                    margin: 0,
                  }}>
                    Applied to products without a specified stockholding value
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.xs }}>
                  <Label htmlFor="minWeeks" style={{ color: DS.tokens.colors.text.primary }}>
                    Minimum Stockholding Weeks
                  </Label>
                  <Input
                    id="minWeeks"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={stockholdingConfig.minWeeks}
                    onChange={(e) => setStockholdingConfig({
                      ...stockholdingConfig,
                      minWeeks: parseFloat(e.target.value) || 1,
                    })}
                    style={{
                      backgroundColor: DS.tokens.colors.bg.secondary,
                      borderColor: DS.tokens.colors.border,
                      color: DS.tokens.colors.text.primary,
                    }}
                  />
                  <p style={{
                    color: DS.tokens.colors.text.dim,
                    fontSize: '0.75rem',
                    margin: 0,
                  }}>
                    Prevents under-stocking by setting a floor value
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: DS.tokens.spacing.xs }}>
                  <Label htmlFor="maxWeeks" style={{ color: DS.tokens.colors.text.primary }}>
                    Maximum Stockholding Weeks
                  </Label>
                  <Input
                    id="maxWeeks"
                    type="number"
                    min="1"
                    step="1"
                    value={stockholdingConfig.maxWeeks}
                    onChange={(e) => setStockholdingConfig({
                      ...stockholdingConfig,
                      maxWeeks: parseFloat(e.target.value) || 52,
                    })}
                    style={{
                      backgroundColor: DS.tokens.colors.bg.secondary,
                      borderColor: DS.tokens.colors.border,
                      color: DS.tokens.colors.text.primary,
                    }}
                  />
                  <p style={{
                    color: DS.tokens.colors.text.dim,
                    fontSize: '0.75rem',
                    margin: 0,
                  }}>
                    Prevents over-stocking by setting a ceiling value
                  </p>
                </div>

                <Button
                  onClick={handleSaveStockholdingConfig}
                  disabled={saving}
                  style={{
                    backgroundColor: DS.tokens.brand.primary,
                    color: DS.tokens.brand.bg,
                    marginTop: DS.tokens.spacing.sm,
                  }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            )}
          </section>

          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Design System Tokens
            </h3>
            <p style={{
              color: DS.tokens.colors.text.subtle,
              fontSize: '0.875rem',
              marginBottom: DS.tokens.spacing.md,
            }}>
              Current design system configuration (read-only)
            </p>

            <div style={{
              padding: DS.tokens.spacing.md,
              backgroundColor: DS.tokens.colors.bg.tertiary,
              borderRadius: DS.tokens.radii.md,
              marginBottom: DS.tokens.spacing.md,
            }}>
              <pre style={{
                color: DS.tokens.colors.text.subtle,
                fontSize: '0.875rem',
                margin: 0,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {JSON.stringify(DS.tokens, null, 2)}
              </pre>
            </div>

            <Button
              onClick={handleExportTokens}
              style={{
                backgroundColor: DS.tokens.brand.primary,
                color: DS.tokens.brand.bg,
              }}
            >
              <Download size={16} />
              Export UI Tokens JSON
            </Button>
          </section>

          <section>
            <h3 style={{
              color: DS.tokens.colors.text.primary,
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: DS.tokens.spacing.md,
            }}>
              System Information
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: DS.tokens.spacing.sm,
            }}>
              <div style={{
                padding: DS.tokens.spacing.md,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <p style={{
                  color: DS.tokens.colors.text.subtle,
                  fontSize: '0.875rem',
                  margin: 0,
                }}>
                  <strong>Brand:</strong> {DS.tokens.brand.name}
                </p>
              </div>
              <div style={{
                padding: DS.tokens.spacing.md,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <p style={{
                  color: DS.tokens.colors.text.subtle,
                  fontSize: '0.875rem',
                  margin: 0,
                }}>
                  <strong>Primary Color:</strong> {DS.tokens.brand.primary}
                </p>
              </div>
              <div style={{
                padding: DS.tokens.spacing.md,
                backgroundColor: DS.tokens.colors.bg.tertiary,
                borderRadius: DS.tokens.radii.md,
              }}>
                <p style={{
                  color: DS.tokens.colors.text.subtle,
                  fontSize: '0.875rem',
                  margin: 0,
                }}>
                  <strong>Environment:</strong> Development
                </p>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
