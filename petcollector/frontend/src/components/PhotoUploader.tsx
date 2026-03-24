import { useState, useRef } from 'react'
import axios from 'axios'
import type { Pet } from '../types/pet'

interface PhotoUploaderProps {
  onPetCollected: (pet: Pet) => void
}

export default function PhotoUploader({ onPetCollected }: PhotoUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:8000/pets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onPetCollected(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Could not identify this species!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={loading}
          style={{
            flex: 1, padding: '0.85rem',
            background: '#CC0000', color: 'white',
            border: '2px solid #2c2c2a', borderRadius: '10px',
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.5px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '🔍 Scanning...' : '📷 Scan Pet'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          style={{
            flex: 1, padding: '0.85rem',
            background: 'white', color: '#CC0000',
            border: '2px solid #CC0000', borderRadius: '10px',
            fontSize: '14px', fontWeight: 700,
            letterSpacing: '0.5px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '🔍 Scanning...' : '📁 Upload'}
        </button>
      </div>

      {loading && (
        <div style={{
          textAlign: 'center', padding: '1rem',
          background: '#fff9e6',
          border: '2px solid #FFCB05',
          borderRadius: '8px',
          color: '#7B4F00', fontSize: '13px', fontWeight: 600
        }}>
          ⚡ Identifying species and generating Pokédex entry...
        </div>
      )}

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#fff0f0',
          border: '2px solid #CC0000',
          borderRadius: '8px',
          color: '#CC0000', fontSize: '13px', fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}