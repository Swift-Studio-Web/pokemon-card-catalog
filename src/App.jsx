import React, { useState, useEffect, useRef } from 'react';

const theme = {
  bgPrimary: '#0a0a0a',
  bgSecondary: '#141414',
  bgTertiary: '#1c1c1c',
  bgElevated: '#222222',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  accent: '#d4af37',
  accentHover: '#e5c456',
  accentSubtle: '#8b7355',
  soldBadge: '#333333',
  danger: '#dc3545',
  dangerHover: '#c82333',
  success: '#28a745',
  border: '#2a2a2a',
};

const STORAGE_KEY = 'pokemon-card-catalog';

const defaultCards = [
  { id: '1', name: 'Piplup', image: '/cards/piplup.png', meta: ['Raw', 'English', 'Ultra Prism'], sold: false },
  { id: '2', name: 'Pikachu', image: '/cards/pikachu.jpg', meta: ['Raw', 'English', 'Base Set'], sold: false },
  { id: '3', name: 'fat gay pikachu', image: '/cards/fat-pikachu.jpg', meta: ['Raw', 'Japanese', 'Promo'], sold: false },
  { id: '4', name: 'Pikachu Illustrator', image: '/cards/pikachu-illustrator.jpg', meta: ['PSA 10', 'Japanese', '1998'], sold: true },
];

// Styled Button Component
const Button = ({ variant = 'default', size = 'md', style = {}, children, ...props }) => {
  const baseStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const sizes = {
    sm: { padding: '8px 12px', fontSize: '0.75rem' },
    md: { padding: '10px 18px', fontSize: '0.85rem' },
    lg: { padding: '14px 24px', fontSize: '0.95rem' },
  };

  const variants = {
    default: {
      background: theme.bgTertiary,
      color: theme.textPrimary,
      border: `1px solid ${theme.border}`,
    },
    primary: {
      background: theme.accent,
      color: theme.bgPrimary,
    },
    danger: {
      background: theme.danger,
      color: '#fff',
    },
    ghost: {
      background: 'transparent',
      color: theme.textSecondary,
      border: `1px solid ${theme.border}`,
    },
  };

  return (
    <button style={{ ...baseStyle, ...sizes[size], ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '500px',
    lg: '600px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.bgSecondary,
          borderRadius: '12px',
          padding: '0',
          maxWidth: sizes[size],
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, cardCount = 1 }) => {
  const isMultiple = cardCount > 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(220, 53, 69, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <span style={{ fontSize: '2rem' }}>🗑️</span>
        </div>
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 600,
            color: theme.textPrimary,
            marginBottom: '0.75rem',
          }}
        >
          Delete {isMultiple ? `${cardCount} Cards` : 'Card'}?
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem',
            color: theme.textSecondary,
            marginBottom: '2rem',
            lineHeight: 1.5,
          }}
        >
          {isMultiple
            ? `This will permanently remove ${cardCount} cards from your catalog.`
            : 'This action cannot be undone. The card will be permanently removed.'}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" size="lg" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="danger" size="lg" onClick={onConfirm} style={{ flex: 1 }}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Card Form Modal
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
    padding: '14px 16px',
    background: theme.bgTertiary,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    color: theme.textPrimary,
    fontSize: '0.9rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '1.5rem 2rem', borderBottom: `1px solid ${theme.border}` }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: theme.textPrimary, margin: 0 }}>
          {card ? 'Edit Card' : 'Add New Card'}
        </h2>
      </div>

      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem', fontWeight: 500 }}>
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
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem', fontWeight: 500 }}>
            Card Image
          </label>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '140px',
              border: `2px dashed ${theme.border}`,
              borderRadius: '8px',
              background: theme.bgTertiary,
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
            ) : (
              <div style={{ textAlign: 'center', color: theme.textMuted }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                <span style={{ fontSize: '0.85rem' }}>Click to upload image</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem', fontWeight: 500 }}>
            Tags <span style={{ color: theme.textMuted }}>(comma separated)</span>
          </label>
          <input
            type="text"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            placeholder="e.g., PSA 10, English, Base Set"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', gap: '12px', borderTop: `1px solid ${theme.border}` }}>
        <Button variant="ghost" size="lg" type="button" onClick={onCancel} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" type="submit" style={{ flex: 1 }}>
          {card ? 'Save Changes' : 'Add Card'}
        </Button>
      </div>
    </form>
  );
};

// Bulk Edit Modal
const BulkEditModal = ({ isOpen, onClose, selectedCards, onMarkSold, onMarkUnsold, onDelete }) => {
  const count = selectedCards.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ padding: '1.5rem 2rem', borderBottom: `1px solid ${theme.border}` }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
          Edit {count} Selected Card{count > 1 ? 's' : ''}
        </h2>
      </div>
      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button variant="default" size="lg" onClick={onMarkSold} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <span>✓</span> Mark as Sold
        </Button>
        <Button variant="default" size="lg" onClick={onMarkUnsold} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <span>↩</span> Mark as Available
        </Button>
        <Button variant="danger" size="lg" onClick={onDelete} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <span>🗑</span> Delete Selected
        </Button>
      </div>
      <div style={{ padding: '1rem 2rem 1.5rem', borderTop: `1px solid ${theme.border}` }}>
        <Button variant="ghost" size="md" onClick={onClose} style={{ width: '100%' }}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

// Card Component
const CardContainer = ({ card, index, onEdit, onDelete, onToggleSold, isAdmin, isSelectMode, isSelected, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => {
    if (isSelectMode) {
      onSelect(card.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        cursor: isSelectMode ? 'pointer' : card.sold ? 'default' : 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? (isHovered && !card.sold && !isSelectMode ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      {isSelectMode && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: isSelected ? theme.accent : theme.bgSecondary,
            border: `2px solid ${isSelected ? theme.accent : theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
        >
          {isSelected && <span style={{ color: theme.bgPrimary, fontSize: '1rem', fontWeight: 'bold' }}>✓</span>}
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && isHovered && !isSelectMode && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(card); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.textPrimary,
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSold(card.id); }}
            style={{
              flex: 1,
              padding: '10px',
              background: card.sold ? theme.accent : 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${card.sold ? theme.accent : theme.border}`,
              borderRadius: '6px',
              color: card.sold ? theme.bgPrimary : theme.textPrimary,
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            {card.sold ? 'Unmark' : 'Sold'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
            style={{
              padding: '10px 14px',
              background: theme.danger,
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Card Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2.5/3.5',
          overflow: 'hidden',
          background: theme.bgSecondary,
          borderRadius: '8px',
          border: `2px solid ${isSelected ? theme.accent : isHovered ? theme.border : 'transparent'}`,
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src={card.image}
          alt={card.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: card.sold ? 'grayscale(100%) brightness(40%)' : isHovered ? 'brightness(105%)' : 'brightness(95%)',
            transform: isHovered && !card.sold && !isSelectMode ? 'scale(1.02)' : 'scale(1)',
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
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '6px 12px',
              borderRadius: '4px',
            }}
          >
            Sold
          </div>
        )}
      </div>

      {/* Card Info */}
      <div style={{ marginTop: '1rem' }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '0.95rem',
            color: card.sold ? theme.textMuted : theme.textPrimary,
            marginBottom: '0.4rem',
          }}
        >
          {card.name}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.75rem',
            color: theme.textMuted,
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {card.meta.map((item, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {item}
              {idx < card.meta.length - 1 && <span style={{ color: theme.border }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCards(JSON.parse(stored));
    } else {
      setCards(defaultCards);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCards));
    }
  }, []);

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

    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      html { scroll-behavior: smooth; }
      body { background: ${theme.bgPrimary}; color: ${theme.textPrimary}; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: ${theme.bgPrimary}; }
      ::-webkit-scrollbar-thumb { background: ${theme.bgTertiary}; border-radius: 4px; }
      ::selection { background: ${theme.accent}; color: ${theme.bgPrimary}; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
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
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === 'bulk') {
      setCards(cards.filter((c) => !selectedCards.includes(c.id)));
      setSelectedCards([]);
      setIsSelectMode(false);
    } else {
      setCards(cards.filter((c) => c.id !== deleteTarget));
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setShowBulkEditModal(false);
  };

  const handleToggleSold = (id) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, sold: !c.sold } : c)));
  };

  const handleSelectCard = (id) => {
    setSelectedCards((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkMarkSold = () => {
    setCards(cards.map((c) => (selectedCards.includes(c.id) ? { ...c, sold: true } : c)));
    setSelectedCards([]);
    setIsSelectMode(false);
    setShowBulkEditModal(false);
  };

  const handleBulkMarkUnsold = () => {
    setCards(cards.map((c) => (selectedCards.includes(c.id) ? { ...c, sold: false } : c)));
    setSelectedCards([]);
    setIsSelectMode(false);
    setShowBulkEditModal(false);
  };

  const handleBulkDelete = () => {
    setDeleteTarget('bulk');
    setShowDeleteModal(true);
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedCards([]);
  };

  const filters = ['All', 'Raw', 'Slabs', 'Japanese', 'Sealed'];
  const filteredCards = cards.filter((card) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Slabs') return card.meta.some((m) => /psa|bgs|cgc/i.test(m));
    return card.meta.some((m) => m.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <div>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
        onConfirm={confirmDelete}
        cardCount={deleteTarget === 'bulk' ? selectedCards.length : 1}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        selectedCards={selectedCards}
        onMarkSold={handleBulkMarkSold}
        onMarkUnsold={handleBulkMarkUnsold}
        onDelete={handleBulkDelete}
      />

      {/* Card Form Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCard(null); }}>
        <CardForm card={editingCard} onSave={handleSaveCard} onCancel={() => { setShowModal(false); setEditingCard(null); }} />
      </Modal>

      {/* Floating Admin Controls */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 999 }}>
        {isAdmin && isSelectMode && selectedCards.length > 0 && (
          <Button variant="primary" size="lg" onClick={() => setShowBulkEditModal(true)} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            Edit {selectedCards.length} Selected
          </Button>
        )}
        {isAdmin && (
          <Button
            variant={isSelectMode ? 'primary' : 'default'}
            size="lg"
            onClick={() => isSelectMode ? exitSelectMode() : setIsSelectMode(true)}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </Button>
        )}
        {isAdmin && !isSelectMode && (
          <Button variant="primary" size="lg" onClick={() => { setEditingCard(null); setShowModal(true); }} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            + Add Card
          </Button>
        )}
        <button
          onClick={() => { setIsAdmin(!isAdmin); if (isAdmin) exitSelectMode(); }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isAdmin ? theme.accent : theme.bgSecondary,
            border: `2px solid ${isAdmin ? theme.accent : theme.border}`,
            color: isAdmin ? theme.bgPrimary : theme.textPrimary,
            fontSize: '1.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {isAdmin ? '×' : '⚙'}
        </button>
      </div>

      {/* Hero */}
      <header
        style={{
          position: 'relative',
          height: '70vh',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '4rem',
          background: `radial-gradient(ellipse at 50% 0%, ${theme.bgSecondary} 0%, ${theme.bgPrimary} 70%)`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent, ${theme.bgPrimary})`, zIndex: 1 }} />
        {isAdmin && (
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: theme.accent,
              color: theme.bgPrimary,
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              zIndex: 10,
            }}
          >
            {isSelectMode ? `SELECT MODE · ${selectedCards.length} SELECTED` : 'ADMIN MODE'}
          </div>
        )}
        <p style={{ color: theme.textSecondary, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', zIndex: 2 }}>
          Pokemon Card Inventory
        </p>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            lineHeight: 0.9,
            color: theme.textPrimary,
            zIndex: 2,
            textAlign: 'center',
          }}
        >
          Card Catalog
        </h1>
        <div style={{ color: theme.textMuted, fontSize: '0.8rem', letterSpacing: '0.15em', marginTop: '1.5rem', zIndex: 2, display: 'flex', gap: '1.5rem' }}>
          {['Rare', 'Graded', 'Sealed', 'Japanese'].map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < 3 && <span style={{ marginLeft: '1.5rem', color: theme.border }}>·</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Filter Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
          padding: '1rem 0',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
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
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: '6px',
              transition: 'color 0.2s ease',
            }}
          >
            {filter}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: theme.accent,
                transform: activeFilter === filter ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        ))}
      </nav>

      {/* Card Grid */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2.5rem 2rem' }}>
        {filteredCards.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: theme.textMuted }}>
            <p>{isAdmin ? 'No cards yet. Click "+ Add Card" to get started.' : 'No cards in this category.'}</p>
          </div>
        ) : (
          filteredCards.map((card, index) => (
            <CardContainer
              key={card.id}
              card={card}
              index={index}
              isAdmin={isAdmin}
              isSelectMode={isSelectMode}
              isSelected={selectedCards.includes(card.id)}
              onSelect={handleSelectCard}
              onEdit={(c) => { setEditingCard(c); setShowModal(true); }}
              onDelete={handleDeleteCard}
              onToggleSold={handleToggleSold}
            />
          ))
        )}
      </main>

      {/* Contact */}
      <section style={{ padding: '5rem 2rem 6rem', textAlign: 'center', background: `linear-gradient(to bottom, ${theme.bgPrimary}, ${theme.bgSecondary})` }}>
        <p style={{ color: theme.textSecondary, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Interested in a card?
        </p>
        <a href="#" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: theme.textPrimary, textDecoration: 'none' }}>
          Instagram
        </a>
        <br />
        <a href="#" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: theme.textMuted, textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>
          Facebook Marketplace
        </a>
        <p style={{ color: theme.textMuted, marginTop: '2rem', fontSize: '0.75rem' }}>DM to inquire · All sales via social media</p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: `1px solid ${theme.border}` }}>
        <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>© {new Date().getFullYear()} Card Catalog</p>
        <p style={{ fontSize: '0.65rem', color: theme.bgTertiary, marginTop: '0.5rem' }}>Pokemon is a trademark of Nintendo. Not affiliated.</p>
      </footer>
    </div>
  );
};

export default App;
