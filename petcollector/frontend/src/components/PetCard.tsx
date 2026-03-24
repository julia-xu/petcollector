import type { Pet } from '../types/pet'

interface PetCardProps {
  pet: Pet
  onClick?: () => void
}

const rarityColors: Record<string, { bg: string; color: string; label: string }> = {
  Common: { bg: '#E8E8E8', color: '#666', label: '●' },
  Uncommon: { bg: '#C6E0B4', color: '#375623', label: '◆' },
  Rare: { bg: '#BDD7EE', color: '#1F4E79', label: '★' },
  Legendary: { bg: '#FFCB05', color: '#7B4F00', label: '✦' },
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  const rarity = rarityColors[pet.rarity] || rarityColors.Common

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        border: '2px solid #2c2c2a',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.1s',
      }}
      onMouseEnter={e => {
        if (onClick) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
      }}
    >
      {/* Entry number header */}
      <div style={{
        background: '#2c2c2a',
        padding: '4px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '10px', fontFamily: 'monospace'
        }}>
          #{String(pet.id).slice(-4).toUpperCase()}
        </span>
        <span style={{
          fontSize: '10px', fontWeight: 700,
          padding: '1px 6px', borderRadius: '4px',
          background: rarity.bg, color: rarity.color
        }}>
          {rarity.label} {pet.rarity}
        </span>
      </div>

      {/* Photo */}
      {pet.photo_url ? (
        <img
          src={pet.photo_url}
          alt={pet.name}
          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '160px',
          background: '#f0f0f0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '3rem'
        }}>
          🐾
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '0.75rem' }}>
        <h3 style={{
          fontSize: '14px', fontWeight: 700,
          marginBottom: '2px', color: '#2c2c2a'
        }}>
          {pet.name}
        </h3>
        <p style={{
          fontSize: '11px', color: '#888',
          textTransform: 'capitalize', marginBottom: '8px'
        }}>
          {pet.species} type
        </p>
        <p style={{
          fontSize: '11px', color: '#555',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {pet.personality}
        </p>
      </div>
    </div>
  )
}