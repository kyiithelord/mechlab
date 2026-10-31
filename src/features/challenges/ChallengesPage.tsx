import { Link } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { machineList } from '../../data/machines'
export function ChallengesPage(){return <AppShell title="Challenges" subtitle="Check your understanding of each machine."><div className="section-title"><div><span className="eyebrow">KNOWLEDGE CHECKS</span><h2>Choose a challenge</h2></div></div><div className="machine-grid">{machineList.map((m,i)=><Link className="challenge-card" key={m.slug} to={`/machine/${m.slug}`}><span>0{i+1} / {m.category.toUpperCase()}</span><h2>{m.name}</h2><p>{m.quiz.length} question · immediate feedback · saved score</p><strong>START CHALLENGE ↗</strong></Link>)}</div></AppShell>}
