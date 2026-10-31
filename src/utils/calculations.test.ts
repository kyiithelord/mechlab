import { describe, expect, it } from 'vitest'
import { gearResults, hydraulicResults } from './calculations'
describe('engineering formulas',()=>{it('computes ideal gear ratio, speed and torque',()=>{expect(gearResults(20,40,120,10)).toEqual({ratio:2,outputRpm:60,outputTorque:20})});it('computes Pascal pressure and output force',()=>{expect(hydraulicResults(100,2,10)).toEqual({pressure:50,outputForce:500,multiplier:5})});it('rejects zero piston area',()=>{expect(()=>hydraulicResults(100,0,10)).toThrow()})})
