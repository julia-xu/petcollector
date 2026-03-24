import type { Pet } from '../types/pet'

interface PetCardProps {
  pet: Pet
  onClick?: () => void
}

const rarityColors: Record<string, { bg: string; color: string }> = {
  Common: { bg: '#F1EFE8', color: '#5F5E5A' },
  Uncommon: { bg: '#E1F5EE', color: '#0F6E56' },
  Rare: { bg: '#E6F1FB', color: '#185FA5' },
  Legendary: { bg: '#EEEDFE', color: '#534AB7' },
}

export default function PetCard({ pet, onClick }: PetCardProps) {
  const rarity = rarityColors[pet.rarity] || rarityColors.Common

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        border: '0.5px solid #D3D1C7',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.1s',
      }}
      onMouseEnter={e => {
        if (onClick) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
      }}
    >
      {pet.photo_url ? (
        <img
          src={pet.photo_url}
          alt={pet.name}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '180px',
          background: '#F1EFE8',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '3rem'
        }}>
          🐾
        </div>
      )}

      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 500 }}>{pet.name}</h3>
          <span style={{
            fontSize: '11px', fontWeight: 500,
            padding: '2px 8px', borderRadius: '8px',
            background: rarity.bg, color: rarity.color
          }}>
            {pet.rarity}
          </span>
        </div>

        <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'capitalize' }}>
          {pet.species}
        </p>

        <p style={{ fontSize: '12px', color: '#5F5E5A', lineHeight: 1.5 }}>
          {pet.personality}
        </p>

        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {pet.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              fontSize: '10px', padding: '2px 6px',
              border: '0.5px solid #D3D1C7',
              borderRadius: '6px', color: '#888'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}