import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Watch from '../pages/Watch'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Route>
      <Route path="/watch/:id" element={<Watch />} />
    </Routes>
  )
}
