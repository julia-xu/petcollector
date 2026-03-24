import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PetDetail from './pages/PetDetail'
import Collection from './pages/Collection'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pets/:id" element={<PetDetail />} />
      <Route path="/collection" element={<Collection />} />
    </Routes>
  )
}

export default App