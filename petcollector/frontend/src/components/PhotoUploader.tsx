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
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={loading}
          style={{
            flex: 1, padding: '1rem',
            background: '#534AB7', color: 'white',
            border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: 500,
          }}
        >
          {loading ? 'Analyzing...' : '📷 Take Photo'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          style={{
            flex: 1, padding: '1rem',
            background: 'white', color: '#534AB7',
            border: '2px solid #534AB7', borderRadius: '12px',
            fontSize: '15px', fontWeight: 500,
          }}
        >
          {loading ? 'Analyzing...' : '📁 Upload Photo'}
        </button>
      </div>

      {loading && (
        <div style={{
          textAlign: 'center', padding: '1rem',
          color: '#534AB7', fontSize: '14px'
        }}>
          🔍 Identifying pet and generating profile...
        </div>
      )}

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#FCEBEB', color: '#A32D2D',
          borderRadius: '8px', fontSize: '13px'
        }}>
          {error}
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