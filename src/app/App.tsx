import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../features/explore/HomePage'
import { ExplorePage } from '../features/explore/ExplorePage'
import { LearningPage } from '../features/learning/LearningPage'
import { ChallengesPage } from '../features/challenges/ChallengesPage'
import { SettingsPage } from '../features/learning/SettingsPage'
import { useLearningStore } from '../stores/useLearningStore'
const MachinePage = lazy(() => import('../features/machines/MachinePage').then(m => ({ default: m.MachinePage })))
export function App(){const theme=useLearningStore(s=>s.theme);return <div data-theme={theme}><Suspense fallback={<div className="route-loading">Loading MechLab…</div>}><Routes><Route path="/" element={<HomePage/>}/><Route path="/explore" element={<ExplorePage/>}/><Route path="/explore/:category" element={<ExplorePage/>}/><Route path="/machine/:slug" element={<MachinePage/>}/><Route path="/lab" element={<ExplorePage lab/>}/><Route path="/simulators" element={<ExplorePage simulators/>}/><Route path="/simulators/:slug" element={<MachinePage/>}/><Route path="/challenges" element={<ChallengesPage/>}/><Route path="/learning" element={<LearningPage/>}/><Route path="/settings" element={<SettingsPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense></div>}
