import Link from 'next/link';
import {
  BookOpen, GraduationCap, Wrench, ArrowRight,
  LayoutDashboard, TrendingUp, CheckCircle,
} from 'lucide-react';
import TrustBadgeRow from '@/components/marketing/TrustBadgeRow';

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="fd-hero">
      <div className="fd-hero-inner">
        <div>
          <span className="fd-hero-eyebrow">Business Education &amp; Tools</span>
          <h1 className="fd-hero-headline">
            Learn. Build.<br />
            <span className="accent">Automate. Profit.</span>
          </h1>
          <p className="fd-hero-sub">
            From importation strategies to free business tools — get everything you need to
            start, manage, and scale your business in one place.
          </p>
          <div className="fd-hero-ctas">
            <Link href="/shop" className="fd-btn fd-btn-primary">
              Get the Book <ArrowRight size={16} />
            </Link>
            <Link href="/tracker/login" className="fd-btn fd-btn-outline-white">
              Try the Tracker Free
            </Link>
          </div>
        </div>

        <div className="fd-hero-visual">
          <div className="fd-hero-visual-inner">
            <div className="fd-hero-card">
              <div className="fd-hero-card-icon">
                <BookOpen size={20} color="#fff" />
              </div>
              <div>
                <div className="fd-hero-card-title">Mini Importation Mastery Guide</div>
                <div className="fd-hero-card-sub">22 chapters · Proven strategies · Real contacts</div>
              </div>
            </div>

            <div className="fd-hero-card">
              <div className="fd-hero-card-icon" style={{ background: '#3B82F6' }}>
                <LayoutDashboard size={20} color="#fff" />
              </div>
              <div>
                <div className="fd-hero-card-title">Sales &amp; Inventory Tracker</div>
                <div className="fd-hero-card-sub">Multi-currency · Multi-user · Free</div>
              </div>
            </div>

            <div className="fd-hero-stat-row">
              <div className="fd-hero-stat">
                <div className="fd-hero-stat-val">22+</div>
                <div className="fd-hero-stat-lbl">Chapters</div>
              </div>
              <div className="fd-hero-stat">
                <div className="fd-hero-stat-val">5+</div>
                <div className="fd-hero-stat-lbl">Free Tools</div>
              </div>
              <div className="fd-hero-stat">
                <div className="fd-hero-stat-val">∞</div>
                <div className="fd-hero-stat-lbl">Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── What We Offer ─────────────────────────────────────────── */
function WhatWeOffer() {
  const offers = [
    {
      Icon: BookOpen,
      title: 'The Book',
      desc: 'The Mini Importation Mastery Guide walks you through everything — from finding suppliers to making your first sale. 22 chapters, zero fluff.',
      cta: 'Get the Book',
      href: '/shop',
    },
    {
      Icon: GraduationCap,
      title: 'The Course',
      desc: 'The Importation Mastery Course takes you deeper with video lessons, live Q&As, real supplier contacts, and a community of fellow business builders.',
      cta: 'Join the Course',
      href: '/shop',
    },
    {
      Icon: Wrench,
      title: 'Business Tools',
      desc: 'Free tools to run your business — Sales & Inventory Tracker, Invoice Generator, Shipping Calculator, Currency Converter, and more.',
      cta: 'Explore Tools',
      href: '/business-tools',
    },
  ];

  return (
    <section className="fd-section" style={{ background: 'var(--fd-bg-alt)' }}>
      <div className="fd-container">
        <div className="fd-section-heading">
          <div className="fd-section-label">What We Offer</div>
          <h2 className="fd-section-title">Everything you need to win in business</h2>
          <p className="fd-section-sub">
            Whether you're starting from scratch or scaling up, we have the education and tools to get you there.
          </p>
        </div>
        <div className="fd-offers-grid">
          {offers.map(({ Icon, title, desc, cta, href }) => (
            <Link key={title} href={href} className="fd-offer-tile">
              <div className="fd-offer-icon">
                <Icon size={26} />
              </div>
              <h3 className="fd-offer-title">{title}</h3>
              <p className="fd-offer-desc">{desc}</p>
              <span className="fd-offer-cta">{cta} <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured banner ───────────────────────────────────────── */
function FeaturedBanner() {
  return (
    <section className="fd-promo">
      <div className="fd-container fd-promo-inner">
        <p className="fd-promo-label">Featured Offer</p>
        <h2 className="fd-promo-headline">
          Start your importation journey today
        </h2>
        <p className="fd-promo-sub">
          Join the course and get access to proven strategies, real supplier contacts,
          and a community of business builders who are already winning.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/shop" className="fd-btn fd-btn-primary">
            Enroll Now <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="fd-btn fd-btn-outline-white">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Product showcase ──────────────────────────────────────── */
function ProductShowcase() {
  const products = [
    {
      badge: 'Bestseller',
      badgeCls: '',
      title: 'Mini Importation Mastery Guide',
      desc: '22 chapters covering every stage of the importation business — from sourcing to selling. Includes bonus worksheets and checklists.',
      price: 'See pricing',
      href: '/shop',
      icon: <BookOpen size={36} color="var(--fd-orange)" />,
    },
    {
      badge: 'New',
      badgeCls: 'badge-new',
      title: 'Importation Mastery Course',
      desc: 'Video-based course with live support, real supplier contact lists, and lifetime access. The complete importation education.',
      price: 'See pricing',
      href: '/shop',
      icon: <GraduationCap size={36} color="#3B82F6" />,
    },
    {
      badge: 'Free',
      badgeCls: 'badge-free',
      title: 'Sales & Inventory Tracker',
      desc: 'A full-featured business tracker — manage products, sales, purchases, customers, invoices, and reports. Multi-user. Multi-currency.',
      price: <span className="free-tag">Free Forever</span>,
      href: '/tracker/login',
      icon: <LayoutDashboard size={36} color="#16a34a" />,
    },
  ];

  return (
    <section className="fd-section">
      <div className="fd-container">
        <div className="fd-section-heading">
          <div className="fd-section-label">Our Products</div>
          <h2 className="fd-section-title">Built for serious business builders</h2>
          <p className="fd-section-sub">
            Every product is designed to give you a real, practical advantage in your business.
          </p>
        </div>
        <div className="fd-products-grid">
          {products.map(({ badge, badgeCls, title, desc, price, href, icon }) => (
            <div key={title} className="fd-product-card">
              <div className="fd-product-img">
                {icon}
                <span className={`fd-product-badge ${badgeCls}`}>{badge}</span>
              </div>
              <div className="fd-product-body">
                <h3 className="fd-product-title">{title}</h3>
                <p className="fd-product-desc">{desc}</p>
                <div className="fd-product-price">{price}</div>
                <Link href={href} className="fd-btn fd-btn-primary fd-btn-sm">
                  {href === '/tracker/login' ? 'Get Started Free' : 'View Details'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Two-up CTA ─────────────────────────────────────────────── */
function TwoUpCTA() {
  return (
    <section className="fd-section" style={{ background: 'var(--fd-bg-alt)' }}>
      <div className="fd-container">
        <div className="fd-twoup">
          <div className="fd-twoup-card">
            <p className="fd-twoup-eyebrow">Free Tool</p>
            <h3 className="fd-twoup-title">New to business? Start with the free Tracker</h3>
            <p className="fd-twoup-sub">
              Track your products, sales, purchases, and customers — all in one place.
              No credit card. No setup fee. Just sign up and go.
            </p>
            <Link href="/tracker/login" className="fd-btn fd-btn-primary fd-btn-sm">
              Open the Tracker <ArrowRight size={14} />
            </Link>
          </div>

          <div className="fd-twoup-card">
            <p className="fd-twoup-eyebrow" style={{ color: 'var(--fd-orange)' }}>Education</p>
            <h3 className="fd-twoup-title" style={{ color: 'var(--fd-navy)' }}>
              Already importing? Level up with the course
            </h3>
            <p className="fd-twoup-sub">
              Get the playbook, real supplier contacts, and the community to help you
              go from side hustle to full-scale operation.
            </p>
            <Link href="/shop" className="fd-btn fd-btn-outline fd-btn-sm">
              See the Course <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────── */
function Testimonials() {
  return (
    <section className="fd-section">
      <div className="fd-container">
        <div className="fd-section-heading">
          <div className="fd-section-label">Testimonials</div>
          <h2 className="fd-section-title">What our customers say</h2>
        </div>
        <div className="fd-testimonials-empty">
          <TrendingUp size={36} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--fd-orange)' }} />
          <strong style={{ display: 'block', marginBottom: 6, color: 'var(--fd-navy)' }}>
            Reviews coming soon
          </strong>
          Be among the first to use Flom Digital and share your experience.
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeOffer />
      <FeaturedBanner />
      <ProductShowcase />
      <TwoUpCTA />
      <Testimonials />
      <TrustBadgeRow />
    </>
  );
}
