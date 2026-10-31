import { Link } from 'react-router-dom'
import { ArrowUpRight, Cog, Fuel, Magnet, MoveUp } from 'lucide-react'
import type { Machine } from '../../types/machine'
const icons={gears:Cog,engine:Fuel,hydraulic:MoveUp,'electric-motor':Magnet}
export function MachineCard({machine,index}:{machine:Machine;index:number}){const Icon=icons[machine.slug];return <Link className="machine-card" to={`/machine/${machine.slug}`}><div className={`machine-art art-${machine.slug}`}><span>0{index+1}</span><Icon size={104} strokeWidth={1.15}/><span>EXPLORE IN 3D ↗</span></div><div className="machine-card-body"><span className="eyebrow">{machine.category.toUpperCase()}</span><h3>{machine.name}<ArrowUpRight size={18}/></h3><p>{machine.summary}</p><div className="machine-card-foot"><span>{machine.lessons.length} LESSONS</span><span>OPEN MACHINE <ArrowUpRight size={13}/></span></div></div></Link>}
