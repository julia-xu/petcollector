import { useState, useEffect } from 'react'
import axios from 'axios'
import PhotoUploader from '../components/PhotoUploader'
import PetCard from '../components/PetCard'
import type { Pet } from '../types/pet'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/pets/')
      const sorted = response.data.sort((a: Pet, b: Pet) =>
        new Date(b.collected_at).getTime() - new Date(a.collected_at).getTime()
      )
      setPets(sorted)
    } catch (err) {
      console.error('Failed to fetch pets', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePetCollected = (newPet: Pet) => {
    setPets(prev => [newPet, ...prev])
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pokedex-red)' }}>
      
      {/* Header */}
      <div style={{
        background: 'var(--pokedex-dark-red)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '3px solid var(--pokedex-black)'
      }}>
        {/* Pokédex light */}
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '50%',
          background: 'var(--pokedex-blue)',
          border: '3px solid white',
          boxShadow: '0 0 0 3px var(--pokedex-black)',
          flexShrink: 0
        }} />
        <div>
          <h1 style={{
            color: 'white', fontSize: '24px',
            fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            PetDex
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
            Gotta snap 'em all
          </p>
        </div>

        {/* Small lights */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {['#FF0000', '#FFCB05', '#00CC00'].map((color, i) => (
            <div key={i} style={{
              width: '12px', height: '12px',
              borderRadius: '50%', background: color,
              border: '1.5px solid rgba(0,0,0,0.3)'
            }} />
          ))}
        </div>
      </div>

      {/* Main screen area */}
      <div style={{
        background: 'var(--pokedex-gray)',
        margin: '16px',
        borderRadius: '16px',
        border: '3px solid var(--pokedex-black)',
        overflow: 'hidden'
      }}>
        
        {/* Screen header */}
        <div style={{
          background: 'var(--pokedex-black)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%', background: '#00CC00'
          }} />
          <span style={{
            color: 'white', fontSize: '11px',
            fontFamily: 'monospace', letterSpacing: '1px'
          }}>
            {pets.length} SPECIES CATALOGUED
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <PhotoUploader onPetCollected={handlePetCollected} />

          <div style={{
            borderTop: '1px solid var(--pokedex-border)',
            paddingTop: '1.5rem', marginTop: '0.5rem'
          }}>
            <h2 style={{
              fontSize: '11px', fontWeight: 600,
              color: '#888', letterSpacing: '1px',
              textTransform: 'uppercase', marginBottom: '1rem'
            }}>
              Your collection
            </h2>

            {loading ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                Loading your Pokédex...
              </p>
            ) : pets.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                No pets catalogued yet — go find some! 🐾
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {pets.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onClick={() => navigate(`/pets/${pet.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom buttons - Pokédex style */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        padding: '0 16px 16px'
      }}>
        <div style={{
          background: 'var(--pokedex-dark-red)',
          borderRadius: '8px',
          border: '2px solid var(--pokedex-black)',
          padding: '8px 24px',
          color: 'white',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          ◀ ▶
        </div>
        <div style={{
          background: 'var(--pokedex-yellow)',
          borderRadius: '50%',
          border: '2px solid var(--pokedex-black)',
          width: '40px', height: '40px'
        }} />
      </div>
    </div>
  )
}