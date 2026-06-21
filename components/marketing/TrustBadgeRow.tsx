import { Shield, Clock, Package, Globe, Headphones, Star } from 'lucide-react';

const BADGES = [
  { Icon: Shield,     label: 'Proven strategies from a practising importer' },
  { Icon: Star,       label: 'Step-by-step guidance for every level' },
  { Icon: Package,    label: 'Real supplier contacts included' },
  { Icon: Clock,      label: 'Lifetime access to all materials' },
  { Icon: Globe,      label: 'Multi-currency business tools' },
  { Icon: Headphones, label: 'Ongoing updates & community support' },
];

export default function TrustBadgeRow() {
  return (
    <section className="fd-section-sm" style={{ background: 'var(--fd-bg-alt)', borderTop: '1px solid var(--fd-border)' }}>
      <div className="fd-container">
        <div className="fd-trust-row">
          {BADGES.map(({ Icon, label }) => (
            <div key={label} className="fd-trust-item">
              <div className="fd-trust-icon">
                <Icon size={24} />
              </div>
              <span className="fd-trust-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
