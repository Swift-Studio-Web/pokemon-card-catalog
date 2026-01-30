import React, { useState, useEffect, useRef } from 'react';

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
  danger: '#c44',
};

const STORAGE_KEY = 'pokemon-card-catalog';

const defaultCards = [
  {
    id: '1',
    name: 'Piplup',
    image: '/cards/piplup.png',
    meta: ['Raw', 'English', 'Ultra Prism'],
    sold: false,
  },
  {
    id: '2',
    name: 'Pikachu',
    image: '/cards/pikachu.jpg',
    meta: ['Raw', 'English', 'Base Set'],
    sold: false,
  },
  {
    id: '3',
    name: 'fat gay pikachu',
    image: '/cards/fat-pikachu.jpg',
    meta: ['Raw', 'Japanese', 'Promo'],
    sold: false,
  },
  {
    id: '4',
    name: 'Pikachu Illustrator',
    image: '/cards/pikachu-illustrator.jpg',
    meta: ['PSA 10', 'Japanese', '1998'],
    sold: true,
  },
];

const CardContainer = ({ card, index, onEdit, onDelete, onToggleSold, isAdmin }) => {
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
      {isAdmin && isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            display: 'flex',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => onEdit(card)}
            style={{
              flex: 1,
              padding: '8px',
              background: theme.bgSecondary,
              border: `1px solid ${theme.accentSubtle}`,
              borderRadius: '4px',
              color: theme.textPrimary,
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onToggleSold(card.id)}
            style={{
              flex: 1,
              padding: '8px',
              background: card.sold ? theme.accent : theme.bgSecondary,
              border: `1px solid ${card.sold ? theme.accent : theme.accentSubtle}`,
              borderRadius: '4px',
              color: card.sold ? theme.bgPrimary : theme.textPrimary,
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {card.sold ? 'Unmark' : 'Sold'}
          </button>
          <button
            onClick={() => onDelete(card.id)}
            style={{
              padding: '8px 12px',
              background: theme.danger,
              border: 'none',
              borderRadius: '4px',
              color: theme.textPrimary,
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ×
          </button>
        </div>
      )}
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

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.bgSecondary,
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${theme.bgTertiary}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const CardForm = ({ card, onSave, onCancel }) => {
  const [name, setName] = useState(card?.name || '');
  const [image, setImage] = useState(card?.image || '');
  const [meta, setMeta] = useState(card?.meta?.join(', ') || '');
  const [imagePreview, setImagePreview] = useState(card?.image || '');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;

    onSave({
      id: card?.id || Date.now().toString(),
      name,
      image,
      meta: meta.split(',').map((m) => m.trim()).filter(Boolean),
      sold: card?.sold || false,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: theme.bgTertiary,
    border: `1px solid ${theme.bgTertiary}`,
    borderRadius: '4px',
    color: theme.textPrimary,
    fontSize: '0.9rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    marginBottom: '1rem',
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          color: theme.textPrimary,
          marginBottom: '1.5rem',
        }}
      >
        {card ? 'Edit Card' : 'Add New Card'}
      </h2>

      <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem' }}>
        Card Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Charizard VMAX"
        style={inputStyle}
        required
      />

      <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem' }}>
        Card Image
      </label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          ...inputStyle,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
          border: `2px dashed ${theme.accentSubtle}`,
          background: theme.bgTertiary,
        }}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ color: theme.textMuted }}>Click to upload image</span>
        )}
      </div>

      <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem' }}>
        Meta Tags (comma separated)
      </label>
      <input
        type="text"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        placeholder="e.g., PSA 10, English, Base Set"
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            background: 'transparent',
            border: `1px solid ${theme.textMuted}`,
            borderRadius: '4px',
            color: theme.textSecondary,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '12px',
            background: theme.accent,
            border: 'none',
            borderRadius: '4px',
            color: theme.bgPrimary,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {card ? 'Save Changes' : 'Add Card'}
        </button>
      </div>
    </form>
  );
};

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Load cards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCards(JSON.parse(stored));
    } else {
      setCards(defaultCards);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCards));
    }
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards]);

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

  const handleSaveCard = (card) => {
    if (editingCard) {
      setCards(cards.map((c) => (c.id === card.id ? card : c)));
    } else {
      setCards([...cards, card]);
    }
    setShowModal(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('Delete this card?')) {
      setCards(cards.filter((c) => c.id !== id));
    }
  };

  const handleToggleSold = (id) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, sold: !c.sold } : c)));
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowModal(true);
  };

  const filters = ['All', 'Raw', 'Slabs', 'Japanese', 'Sealed'];

  const filteredCards = cards.filter((card) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Slabs') {
      return card.meta.some((m) => m.toLowerCase().includes('psa') || m.toLowerCase().includes('bgs') || m.toLowerCase().includes('cgc'));
    }
    return card.meta.some((m) => m.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <div>
      {/* Admin Toggle */}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isAdmin ? theme.accent : theme.bgSecondary,
          border: `2px solid ${isAdmin ? theme.accent : theme.accentSubtle}`,
          color: isAdmin ? theme.bgPrimary : theme.textPrimary,
          fontSize: '1.5rem',
          cursor: 'pointer',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
        title={isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
      >
        {isAdmin ? '×' : '⚙'}
      </button>

      {/* Add Card Button (Admin only) */}
      {isAdmin && (
        <button
          onClick={() => {
            setEditingCard(null);
            setShowModal(true);
          }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '6rem',
            padding: '1rem 1.5rem',
            borderRadius: '28px',
            background: theme.accent,
            border: 'none',
            color: theme.bgPrimary,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 999,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          + Add Card
        </button>
      )}

      {/* Card Form Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCard(null); }}>
        <CardForm
          card={editingCard}
          onSave={handleSaveCard}
          onCancel={() => { setShowModal(false); setEditingCard(null); }}
        />
      </Modal>

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

        {isAdmin && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: theme.accent,
              color: theme.bgPrimary,
              padding: '0.5rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.1em',
              zIndex: 10,
            }}
          >
            ADMIN MODE
          </div>
        )}
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
        {filteredCards.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem',
              color: theme.textMuted,
            }}
          >
            {isAdmin ? (
              <p>No cards yet. Click "+ Add Card" to get started.</p>
            ) : (
              <p>No cards in this category.</p>
            )}
          </div>
        ) : (
          filteredCards.map((card, index) => (
            <CardContainer
              key={card.id}
              card={card}
              index={index}
              isAdmin={isAdmin}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
              onToggleSold={handleToggleSold}
            />
          ))
        )}
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
