import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { Pet } from '../types/pet'

const rarityColors: Record<string, { bg: string; color: string }> = {
  Common: { bg: '#F1EFE8', color: '#5F5E5A' },
  Uncommon: { bg: '#E1F5EE', color: '#0F6E56' },
  Rare: { bg: '#E6F1FB', color: '#185FA5' },
  Legendary: { bg: '#EEEDFE', color: '#534AB7' },
}

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPet()
  }, [id])

  const fetchPet = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pets/${id}`)
      setPet(response.data)
    } catch (err) {
      setError('Pet not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
      Loading pet...
    </div>
  )

  if (error || !pet) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
      {error || 'Pet not found'} 
      <br />
      <button onClick={() => navigate('/')} style={{
        marginTop: '1rem', padding: '0.5rem 1rem',
        border: '0.5px solid #D3D1C7', borderRadius: '8px',
        background: 'white', cursor: 'pointer'
      }}>
        Go home
      </button>
    </div>
  )

  const rarity = rarityColors[pet.rarity] || rarityColors.Common

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none',
          color: '#888', fontSize: '14px',
          cursor: 'pointer', marginBottom: '1.5rem',
          padding: 0
        }}
      >
        ← Back
      </button>

      {pet.photo_url && (
        <img
          src={pet.photo_url}
          alt={pet.name}
          style={{
            width: '100%', height: '300px',
            objectFit: 'cover', borderRadius: '12px',
            marginBottom: '1.5rem'
          }}
        />
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 500 }}>{pet.name}</h1>
          <span style={{
            fontSize: '12px', fontWeight: 500,
            padding: '3px 10px', borderRadius: '8px',
            background: rarity.bg, color: rarity.color
          }}>
            {pet.rarity}
          </span>
        </div>
        <p style={{ color: '#888', fontSize: '14px', textTransform: 'capitalize' }}>
          {pet.species}
        </p>
      </div>

      <div style={{
        background: 'white', border: '0.5px solid #D3D1C7',
        borderRadius: '12px', padding: '1.25rem',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
          PERSONALITY
        </h2>
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#2c2c2a' }}>
          {pet.personality}
        </p>
      </div>

      <div style={{
        background: 'white', border: '0.5px solid #D3D1C7',
        borderRadius: '12px', padding: '1.25rem',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
          FUN FACT
        </h2>
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#2c2c2a' }}>
          {pet.fun_fact}
        </p>
      </div>

      <div style={{
        background: 'white', border: '0.5px solid #D3D1C7',
        borderRadius: '12px', padding: '1.25rem',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
          TAGS
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {pet.tags.map(tag => (
            <span key={tag} style={{
              fontSize: '12px', padding: '3px 8px',
              border: '0.5px solid #D3D1C7',
              borderRadius: '6px', color: '#888'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        background: 'white', border: '0.5px solid #D3D1C7',
        borderRadius: '12px', padding: '1.25rem'
      }}>
        <h2 style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>
          COLLECTED
        </h2>
        <p style={{ fontSize: '14px', color: '#2c2c2a' }}>
          {new Date(pet.collected_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

    </div>
  )
}