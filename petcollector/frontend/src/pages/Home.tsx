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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '4px' }}>
          🐾 PetCollector
        </h1>
        <p style={{ color: '#888' }}>Snap a pet, collect them all</p>
      </div>

      <PhotoUploader onPetCollected={handlePetCollected} />

      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#888' }}>
          Recent catches — {pets.length} collected
        </h2>
      </div>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center' }}>Loading your collection...</p>
      ) : pets.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>
          No pets yet — go find some! 🐾
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px'
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
  )
}