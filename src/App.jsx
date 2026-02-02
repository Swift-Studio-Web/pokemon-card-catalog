import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

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
const Modal = ({ isOpen, onClose, children, size = 'md', preventBackdropClose = false }) => {
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
      onClick={preventBackdropClose ? undefined : onClose}
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

const modalIconStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.5rem',
};

const modalTitleStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.textPrimary,
  marginBottom: '0.75rem',
};

const modalTextStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.9rem',
  color: theme.textSecondary,
  marginBottom: '2rem',
  lineHeight: 1.5,
};

// Unsaved Changes Modal
const UnsavedChangesModal = ({ isOpen, onDiscard, onSaveDraft, onCancel }) => (
  <Modal isOpen={isOpen} onClose={onCancel} size="sm">
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ ...modalIconStyle, background: 'rgba(212, 175, 55, 0.1)' }}>
        <span style={{ fontSize: '2rem' }}>⚠️</span>
      </div>
      <h3 style={modalTitleStyle}>Unsaved Changes</h3>
      <p style={modalTextStyle}>
        You have unsaved changes. Would you like to save them as a draft?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button variant="primary" size="lg" onClick={onSaveDraft} style={{ width: '100%' }}>
          Save Draft
        </Button>
        <Button variant="danger" size="lg" onClick={onDiscard} style={{ width: '100%' }}>
          Discard Changes
        </Button>
        <Button variant="ghost" size="md" onClick={onCancel} style={{ width: '100%' }}>
          Keep Editing
        </Button>
      </div>
    </div>
  </Modal>
);

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, cardCount = 1 }) => {
  const isMultiple = cardCount > 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ ...modalIconStyle, background: 'rgba(220, 53, 69, 0.1)' }}>
          <span style={{ fontSize: '2rem' }}>🗑️</span>
        </div>
        <h3 style={modalTitleStyle}>
          Delete {isMultiple ? `${cardCount} Cards` : 'Card'}?
        </h3>
        <p style={modalTextStyle}>
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

const DRAFT_KEY = 'pokemon-card-draft';

const SECTION_OPTIONS = [
  { value: 'forsale', label: 'For Sale' },
  { value: 'buying', label: 'Buying' },
];

const adminButtonBase = {
  padding: '10px',
  backdropFilter: 'blur(8px)',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'all 0.2s ease',
};

// Card Form Modal
const CardForm = ({ card, onSave, onCancel, activeSection }) => {
  // Load draft if no card is being edited
  const loadDraft = () => {
    if (card) return null;
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  };

  const draft = loadDraft();

  const [name, setName] = useState(card?.name || draft?.name || '');
  const [image, setImage] = useState(card?.image || draft?.image || '');
  const [meta, setMeta] = useState(card?.meta?.join(', ') || draft?.meta || '');
  const [imagePreview, setImagePreview] = useState(card?.image || draft?.image || '');
  const [section, setSection] = useState(card?.section || draft?.section || activeSection || 'forsale');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const fileInputRef = useRef(null);

  const hasChanges = () => {
    if (card) {
      return name !== card.name || image !== card.image || meta !== card.meta?.join(', ') || section !== card.section;
    }
    return Boolean(name || image || meta);
  };

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
    // Clear draft on successful save
    localStorage.removeItem(DRAFT_KEY);
    onSave({
      id: card?.id || Date.now().toString(),
      name,
      image,
      meta: meta.split(',').map((m) => m.trim()).filter(Boolean),
      sold: card?.sold || false,
      section,
    });
  };

  const handleClose = () => {
    if (hasChanges()) {
      setShowUnsavedModal(true);
    } else {
      localStorage.removeItem(DRAFT_KEY);
      onCancel();
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ name, image, meta, section }));
    setShowUnsavedModal(false);
    onCancel();
  };

  const handleDiscard = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowUnsavedModal(false);
    onCancel();
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
    <>
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraft}
        onCancel={() => setShowUnsavedModal(false)}
      />
      <form onSubmit={handleSubmit}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: theme.textPrimary, margin: 0 }}>
            {card ? 'Edit Card' : draft ? 'Continue Draft' : 'Add New Card'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
              transition: 'color 0.2s ease',
            }}
          >
            ×
          </button>
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

        <div style={{ marginBottom: '1.25rem' }}>
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

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textSecondary, fontSize: '0.8rem', fontWeight: 500 }}>
            Section
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {SECTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSection(opt.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: section === opt.value ? theme.accent : theme.bgTertiary,
                  border: `1px solid ${section === opt.value ? theme.accent : theme.border}`,
                  borderRadius: '8px',
                  color: section === opt.value ? theme.bgPrimary : theme.textSecondary,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', gap: '12px', borderTop: `1px solid ${theme.border}` }}>
        <Button variant="ghost" size="lg" type="button" onClick={handleClose} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" type="submit" style={{ flex: 1 }}>
          {card ? 'Save Changes' : 'Add Card'}
        </Button>
      </div>
    </form>
    </>
  );
};

// Bulk Edit Modal
const BulkEditModal = ({ isOpen, onClose, selectedCards, onMarkSold, onMarkUnsold, onDelete, activeSection }) => {
  const count = selectedCards.length;
  const isBuying = activeSection === 'buying';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ padding: '1.5rem 2rem', borderBottom: `1px solid ${theme.border}` }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
          Edit {count} Selected Card{count > 1 ? 's' : ''}
        </h2>
      </div>
      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!isBuying && (
          <>
            <Button variant="default" size="lg" onClick={onMarkSold} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <span>✓</span> Mark as Sold
            </Button>
            <Button variant="default" size="lg" onClick={onMarkUnsold} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <span>↩</span> Mark as Available
            </Button>
          </>
        )}
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
const CardContainer = ({ card, index, onEdit, onDelete, onToggleSold, isAdmin, isSelectMode, isSelected, onSelect, activeSection }) => {
  const isBuying = activeSection === 'buying';
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
              ...adminButtonBase,
              flex: 1,
              background: 'rgba(20, 20, 20, 0.95)',
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary,
            }}
          >
            Edit
          </button>
          {!isBuying && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSold(card.id); }}
              style={{
                ...adminButtonBase,
                flex: 1,
                background: card.sold ? theme.accent : 'rgba(20, 20, 20, 0.95)',
                border: `1px solid ${card.sold ? theme.accent : theme.border}`,
                color: card.sold ? theme.bgPrimary : theme.textPrimary,
              }}
            >
              {card.sold ? 'Unmark' : 'Sold'}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
            style={{
              ...adminButtonBase,
              padding: '10px 14px',
              background: theme.danger,
              border: 'none',
              color: '#fff',
              fontSize: '0.85rem',
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

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const ADMIN_SESSION_KEY = 'bakery-admin-session';
const ADMIN_LOCKOUT_KEY = 'bakery-admin-lockout';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const App = () => {
  const [activeSection, setActiveSection] = useState('forsale');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      const { expiry } = JSON.parse(session);
      if (Date.now() < expiry) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
  }, []);

  // Check for ?admin in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') && !isAdmin) {
      setShowAdminLogin(true);
    }
  }, [isAdmin]);

  // Check lockout status
  useEffect(() => {
    const checkLockout = () => {
      const lockout = localStorage.getItem(ADMIN_LOCKOUT_KEY);
      if (lockout) {
        const { until } = JSON.parse(lockout);
        if (Date.now() < until) {
          setIsLockedOut(true);
          setLockoutRemaining(Math.ceil((until - Date.now()) / 1000 / 60));
        } else {
          localStorage.removeItem(ADMIN_LOCKOUT_KEY);
          setIsLockedOut(false);
        }
      }
    };
    checkLockout();
    const interval = setInterval(checkLockout, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (isLockedOut) return;

    if (adminPassword === ADMIN_PASSWORD) {
      // Success - save session
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        expiry: Date.now() + SESSION_DURATION
      }));
      localStorage.removeItem(ADMIN_LOCKOUT_KEY);
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      // Failed attempt - track it
      const lockout = localStorage.getItem(ADMIN_LOCKOUT_KEY);
      let attempts = 1;

      if (lockout) {
        const data = JSON.parse(lockout);
        attempts = (data.attempts || 0) + 1;
      }

      if (attempts >= MAX_ATTEMPTS) {
        // Lock out
        localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify({
          until: Date.now() + LOCKOUT_DURATION,
          attempts
        }));
        setIsLockedOut(true);
        setLockoutRemaining(15);
        setAdminError(`Too many attempts. Locked out for 15 minutes.`);
      } else {
        localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify({ attempts }));
        setAdminError(`Incorrect password. ${MAX_ATTEMPTS - attempts} attempts remaining.`);
      }
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    exitSelectMode();
  };

  // Fetch cards from Supabase
  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cards:', error);
    } else {
      const transformed = data.map(card => ({
        id: card.id,
        name: card.name,
        image: card.image_url,
        meta: card.meta || [],
        sold: card.sold || false,
        section: card.section || 'forsale',
      }));
      setCards(transformed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

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

  const uploadImage = async (base64Image) => {
    // If it's already a URL (not base64), return it
    if (!base64Image.startsWith('data:')) {
      return base64Image;
    }

    // Convert base64 to blob
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Generate unique filename
    const fileName = `card-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(fileName, blob);

    if (error) {
      console.error('Error uploading image:', error);
      return base64Image; // Fallback to base64 if upload fails
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSaveCard = async (card) => {
    try {
      // Upload image if it's base64
      const imageUrl = await uploadImage(card.image);

      if (editingCard) {
        // Update existing card
        const { error } = await supabase
          .from('cards')
          .update({
            name: card.name,
            image_url: imageUrl,
            meta: card.meta,
            sold: card.sold,
            section: card.section,
          })
          .eq('id', card.id);

        if (error) throw error;
        setCards(cards.map((c) => (c.id === card.id ? { ...card, image: imageUrl } : c)));
      } else {
        // Insert new card
        const { data, error } = await supabase
          .from('cards')
          .insert({
            name: card.name,
            image_url: imageUrl,
            meta: card.meta,
            sold: card.sold,
            section: card.section,
          })
          .select()
          .single();

        if (error) throw error;
        setCards([{ ...card, id: data.id, image: imageUrl }, ...cards]);
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
    setShowModal(false);
    setEditingCard(null);
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedCards([]);
  };

  const handleDeleteCard = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteTarget === 'bulk') {
        const { error } = await supabase
          .from('cards')
          .delete()
          .in('id', selectedCards);

        if (error) throw error;
        setCards(cards.filter((c) => !selectedCards.includes(c.id)));
        exitSelectMode();
      } else {
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', deleteTarget);

        if (error) throw error;
        setCards(cards.filter((c) => c.id !== deleteTarget));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setShowBulkEditModal(false);
  };

  const handleToggleSold = async (id) => {
    const card = cards.find((c) => c.id === id);
    const newSoldStatus = !card.sold;

    try {
      const { error } = await supabase
        .from('cards')
        .update({ sold: newSoldStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating card:', error);
    }
    setCards(cards.map((c) => (c.id === id ? { ...c, sold: newSoldStatus } : c)));
  };

  const handleSelectCard = (id) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkSetSold = async (sold) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({ sold })
        .in('id', selectedCards);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating cards:', error);
    }
    setCards(cards.map((c) => (selectedCards.includes(c.id) ? { ...c, sold } : c)));
    exitSelectMode();
    setShowBulkEditModal(false);
  };

  const handleBulkDelete = () => {
    setDeleteTarget('bulk');
    setShowDeleteModal(true);
  };

  const filters = ['All', 'Raw', 'Slabs', 'Japanese', 'Sealed'];
  const filteredCards = cards.filter((card) => {
    // First filter by section
    if (card.section !== activeSection) return false;
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = card.name.toLowerCase().includes(query);
      const matchesMeta = card.meta.some((m) => m.toLowerCase().includes(query));
      if (!matchesName && !matchesMeta) return false;
    }
    // Then filter by category
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Slabs') return card.meta.some((m) => /psa|bgs|cgc/i.test(m));
    return card.meta.some((m) => m.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <div>
      {/* Admin Login Modal */}
      <Modal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} size="sm">
        <form onSubmit={handleAdminLogin}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ ...modalIconStyle, background: 'rgba(212, 175, 55, 0.1)' }}>
              <span style={{ fontSize: '2rem' }}>🔐</span>
            </div>
            <h3 style={modalTitleStyle}>Admin Access</h3>
            <p style={{ ...modalTextStyle, marginBottom: '1.5rem' }}>
              {isLockedOut ? `Too many failed attempts. Try again in ${lockoutRemaining} minute${lockoutRemaining !== 1 ? 's' : ''}.` : 'Enter password to continue'}
            </p>
            {!isLockedOut && (
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: theme.bgTertiary,
                  border: `1px solid ${adminError ? theme.danger : theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '0.9rem',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  marginBottom: adminError ? '0.5rem' : '1.5rem',
                }}
                autoFocus
              />
            )}
            {adminError && !isLockedOut && (
              <p style={{ color: theme.danger, fontSize: '0.8rem', marginBottom: '1rem' }}>{adminError}</p>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="ghost" size="lg" type="button" onClick={() => { setShowAdminLogin(false); setAdminPassword(''); setAdminError(''); window.history.replaceState({}, '', window.location.pathname); }} style={{ flex: 1 }}>
                {isLockedOut ? 'Close' : 'Cancel'}
              </Button>
              {!isLockedOut && (
                <Button variant="primary" size="lg" type="submit" style={{ flex: 1 }}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </form>
      </Modal>

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
        onMarkSold={() => handleBulkSetSold(true)}
        onMarkUnsold={() => handleBulkSetSold(false)}
        onDelete={handleBulkDelete}
        activeSection={activeSection}
      />

      {/* Card Form Modal */}
      <Modal isOpen={showModal} onClose={() => {}} preventBackdropClose>
        <CardForm card={editingCard} onSave={handleSaveCard} onCancel={() => { setShowModal(false); setEditingCard(null); }} activeSection={activeSection} />
      </Modal>

      {/* Floating Admin Controls - Only visible when logged in */}
      {isAdmin && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 999 }}>
          {isSelectMode && selectedCards.length > 0 && (
            <Button variant="primary" size="lg" onClick={() => setShowBulkEditModal(true)} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              Edit {selectedCards.length} Selected
            </Button>
          )}
          <Button
            variant={isSelectMode ? 'primary' : 'default'}
            size="lg"
            onClick={() => isSelectMode ? exitSelectMode() : setIsSelectMode(true)}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </Button>
          {!isSelectMode && (
            <Button variant="primary" size="lg" onClick={() => { setEditingCard(null); setShowModal(true); }} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              + Add Card
            </Button>
          )}
          <button
            onClick={handleAdminLogout}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: theme.accent,
              border: `2px solid ${theme.accent}`,
              color: theme.bgPrimary,
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
            title="Logout"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero */}
      <header
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2rem 2rem',
          background: `radial-gradient(ellipse at 50% 0%, ${theme.bgSecondary} 0%, ${theme.bgPrimary} 70%)`,
        }}
      >
        {isAdmin && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
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
        <img src="/logo.png" alt="Bakery TCG" style={{ height: '140px', marginBottom: '1.5rem' }} />
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            lineHeight: 0.9,
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          Bakery TCG Catalog
        </h1>
      </header>

      {/* Section Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0',
          padding: '1.5rem 2rem 0',
          background: theme.bgPrimary,
        }}
      >
        {SECTION_OPTIONS.map((sec) => (
          <button
            key={sec.value}
            onClick={() => { setActiveSection(sec.value); setActiveFilter('All'); setSelectedCards([]); setIsSelectMode(false); }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.4rem',
              letterSpacing: '0.05em',
              color: activeSection === sec.value ? theme.textPrimary : theme.textMuted,
              cursor: 'pointer',
              padding: '0.75rem 2rem',
              position: 'relative',
              transition: 'color 0.2s ease',
            }}
          >
            {sec.label}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '2rem',
                right: '2rem',
                height: '3px',
                background: theme.accent,
                transform: activeSection === sec.value ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
        }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px 14px 48px',
              background: theme.bgSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              color: theme.textPrimary,
              fontSize: '0.95rem',
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '1rem' }}>🔍</span>
        </div>
      </div>

      {/* Filter Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
          padding: '1rem 2rem',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
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
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: theme.textMuted }}>
            <p>Loading cards...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: theme.textMuted }}>
            <p>{isAdmin
              ? `No cards yet. Click "+ Add Card" to add ${activeSection === 'buying' ? 'cards you\'re looking for' : 'cards for sale'}.`
              : activeSection === 'buying'
                ? 'No cards in the wishlist yet.'
                : 'No cards in this category.'}</p>
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
              activeSection={activeSection}
            />
          ))
        )}
      </main>

      {/* Contact */}
      <section style={{ padding: '5rem 2rem 6rem', textAlign: 'center', background: `linear-gradient(to bottom, ${theme.bgPrimary}, ${theme.bgSecondary})` }}>
        <p style={{ color: theme.textSecondary, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          {activeSection === 'buying' ? 'Have a card I\'m looking for?' : 'Interested in a card?'}
        </p>
        <a href="https://www.instagram.com/bakery.tcg" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: theme.textPrimary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1em', height: '1em' }}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          @bakery.tcg
        </a>
        <p style={{ color: theme.textMuted, marginTop: '2rem', fontSize: '0.75rem' }}>DM on Instagram to inquire</p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: `1px solid ${theme.border}` }}>
        <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>© {new Date().getFullYear()} Bakery TCG</p>
        <p style={{ fontSize: '0.65rem', color: theme.bgTertiary, marginTop: '0.5rem' }}>Pokemon is a trademark of Nintendo. Not affiliated.</p>
      </footer>
    </div>
  );
};

export default App;
