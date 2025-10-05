import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import DS from '@/design-system';

export function SettingsTab() {
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
