export interface Pet {
  id: string
  name: string
  species: string
  description: string
  personality: string
  fun_fact: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary'
  tags: string[]
  photo_url: string | null
  collected_by: string
  collected_at: string
}