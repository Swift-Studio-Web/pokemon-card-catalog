import React, { useState, useEffect } from 'react';

const theme = {
  bgPrimary: '#0d0d0d',
  bgSecondary: '#161616',
  bgTertiary: '#1a1a1a',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a0',
  textMuted: '#5a5a5a',
  accent: '#d4af37',
  accentSubtle: '#8b7355',
  soldBadge: '#404040',
};

const CardContainer = ({ card, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      style={{
        position: 'relative',
        cursor: card.sold ? 'default' : 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? isHovered && !card.sold ? 'translateY(-8px)' : 'translateY(0)'
          : 'translateY(16px)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2.5/3.5',
          overflow: 'hidden',
          background: theme.bgSecondary,
          borderRadius: '4px',
          border: `1px solid ${isHovered && !card.sold ? theme.accentSubtle : theme.bgTertiary}`,
          transition: 'border-color 0.3s ease',
        }}
      >
        <img
          src={card.image}
          alt={card.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: card.sold
              ? 'grayscale(100%) brightness(40%)'
              : isHovered
                ? 'grayscale(0%) brightness(100%)'
                : 'grayscale(20%) brightness(90%)',
            transform: isHovered && !card.sold ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        {card.sold && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: theme.soldBadge,
              color: theme.textSecondary,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '6px 12px',
              borderRadius: '2px',
            }}
          >
            Sold
          </div>
        )}
      </div>
      <div style={{ marginTop: '1.25rem' }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            color: card.sold ? theme.textMuted : theme.textPrimary,
            marginBottom: '0.5rem',
            transition: 'color 0.3s ease',
          }}
        >
          {card.name}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.75rem',
            color: theme.textMuted,
            letterSpacing: '0.05em',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {card.meta.map((item, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {item}
              {idx < card.meta.length - 1 && (
                <span style={{ color: theme.accentSubtle }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const styleElement = document.createElement('style');
    styleElement.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        background-color: ${theme.bgPrimary};
        color: ${theme.textPrimary};
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        overflow-x: hidden;
        min-height: 100vh;
      }
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: ${theme.bgPrimary};
      }
      ::-webkit-scrollbar-thumb {
        background: ${theme.bgTertiary};
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.accentSubtle};
      }
      ::selection {
        background: ${theme.accent};
        color: ${theme.bgPrimary};
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(styleElement);
    };
  }, []);

  const cards = [
    {
      name: 'Piplup',
      image: '/cards/piplup.png',
      meta: ['Raw', 'English', 'Ultra Prism'],
      sold: false,
    },
    {
      name: 'Pikachu',
      image: '/cards/pikachu.jpg',
      meta: ['Raw', 'English', 'Base Set'],
      sold: false,
    },
    {
      name: 'fat gay pikachu',
      image: '/cards/fat-pikachu.jpg',
      meta: ['Raw', 'Japanese', 'Promo'],
      sold: false,
    },
    {
      name: 'Pikachu Illustrator',
      image: '/cards/pikachu-illustrator.jpg',
      meta: ['PSA 10', 'Japanese', '1998'],
      sold: true,
    },
  ];

  const filters = ['All', 'Raw', 'Slabs', 'Japanese', 'Sealed'];

  return (
    <div>
      {/* Hero Section */}
      <header
        style={{
          position: 'relative',
          height: '80vh',
          minHeight: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '5rem',
          background: `radial-gradient(ellipse at 50% 0%, ${theme.bgSecondary} 0%, ${theme.bgPrimary} 70%)`,
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${theme.bgPrimary} 95%)`,
            zIndex: 1,
          }}
        />

        {/* Subtle decorative line */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1px',
            height: '80px',
            background: `linear-gradient(to bottom, transparent, ${theme.accentSubtle}, transparent)`,
            zIndex: 2,
          }}
        />

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            color: theme.textSecondary,
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            zIndex: 2,
          }}
        >
          Pokemon Card Inventory
        </p>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            color: theme.textPrimary,
            position: 'relative',
            zIndex: 2,
            letterSpacing: '0.02em',
            textAlign: 'center',
          }}
        >
          Card Catalog
        </h1>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: theme.textMuted,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            marginTop: '2rem',
            textAlign: 'center',
            zIndex: 2,
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['Rare', 'Graded', 'Sealed', 'Japanese'].map((item, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {item}
              {idx < 3 && <span style={{ color: theme.accentSubtle }}>·</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Filter Navigation */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          background: `rgba(13, 13, 13, 0.95)`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 100,
          padding: '1.25rem 0',
          borderBottom: `1px solid ${theme.bgTertiary}`,
          display: 'flex',
          justifyContent: 'center',
          gap: '2.5rem',
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              background: 'none',
              border: 'none',
              color: activeFilter === filter ? theme.textPrimary : theme.textMuted,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              position: 'relative',
              paddingBottom: '4px',
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter) {
                e.currentTarget.style.color = theme.textSecondary;
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter) {
                e.currentTarget.style.color = theme.textMuted;
              }
            }}
          >
            {filter}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: theme.accent,
                transform: activeFilter === filter ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformOrigin: 'center',
              }}
            />
          </button>
        ))}
      </nav>

      {/* Card Grid */}
      <main
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '4rem 2rem 6rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '3rem 2rem',
        }}
      >
        {cards.map((card, index) => (
          <CardContainer key={index} card={card} index={index} />
        ))}
      </main>

      {/* Contact Section */}
      <section
        style={{
          padding: '6rem 2rem 8rem',
          textAlign: 'center',
          background: `linear-gradient(to bottom, ${theme.bgPrimary} 0%, ${theme.bgSecondary} 100%)`,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: theme.textSecondary,
            marginBottom: '2rem',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Interested in a card?
        </p>

        <a
          href="#"
          style={{
            display: 'inline-block',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            textDecoration: 'none',
            color: theme.textPrimary,
            lineHeight: 1,
            transition: 'color 0.3s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.textPrimary;
          }}
        >
          Instagram
        </a>

        <br />

        <a
          href="#"
          style={{
            display: 'inline-block',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            textDecoration: 'none',
            color: theme.textMuted,
            marginTop: '1rem',
            lineHeight: 1,
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.textSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.textMuted;
          }}
        >
          Facebook Marketplace
        </a>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: theme.textMuted,
            marginTop: '3rem',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          DM to inquire · All sales via social media
        </p>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: `1px solid ${theme.bgTertiary}`,
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem',
            color: theme.textMuted,
            letterSpacing: '0.1em',
          }}
        >
          © {new Date().getFullYear()} Card Catalog
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            color: theme.bgTertiary,
            marginTop: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          Pokemon is a trademark of Nintendo. Not affiliated.
        </p>
      </footer>
    </div>
  );
};

export default App;
