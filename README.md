# MechLab — Understand Machines

React + TypeScript + Vite + React Three Fiber ဖြင့် BRD v1.0 အတိုင်း ပြန်ဖွဲ့ထားသော interactive mechanical learning app ဖြစ်သည်။

## Run

```bash
npm install
npm run dev
```

Terminal တွင် ပြထားသော Vite URL (ပုံမှန် `http://localhost:5173`) ကို ဖွင့်ပါ။ Build နှင့် formula tests အတွက် `npm run build`၊ `npm test` ကို သုံးပါ။

## Architecture

- `public/models/{gears,engine,hydraulic,electric-motor}` — နောက်ပိုင်း optimize လုပ်ထားသော GLB/glTF assets ထည့်ရန်
- `src/app` — routes
- `src/components/layout`, `navigation`, `viewer`, `lessons`, `simulators`, `ui` — ပြန်သုံးနိုင်သော UI
- `src/features` — Explore, Machines, Learning, Simulations, Challenges
- `src/models` — လက်ရှိ procedural Three.js machine meshes
- `src/data` နှင့် `src/types` — machine နှင့် lesson content schema
- `src/stores` — localStorage persistence ရှိသော Zustand learning state
- `src/utils` — engineering calculations နှင့် tests
- `src/styles` — responsive design နှင့် theme

## အလုပ်လုပ်ပုံ

1. Home/Explore မှ machine ၄ မျိုးထဲက တစ်ခုကို ဖွင့်ပါ။
2. 3D viewer ကို mouse ဖြင့်လှည့်၊ zoom၊ reset၊ fullscreen လုပ်နိုင်ပြီး component ကို click လုပ်နိုင်သည်။
3. ဘယ်ဘက် lesson list ကို ရွေးပြီး ညာဘက် panel မှ explanation ကို ဖတ်နိုင်သည်။
4. Gear/hydraulic simulator များတွင် input ပြောင်းလျှင် သင်္ချာရလဒ်ကို ချက်ချင်းတွက်သည်။ Engine/motor controls များသည် educational animation ဖြစ်သည်။
5. Lesson completion၊ bookmarks နှင့် quiz scores ကို browser localStorage တွင် သိမ်းသည်။

## Model assets

Gear System အတွက် `public/models/gears/gear-system.glb` ကို အမည်ပေးထားသော component 3D nodes များဖြင့် ထည့်ထားသည်။ `npm run model:gear` ဖြင့် `scripts/generate-gear-glb.mjs` ကနေ ပြန်ထုတ်နိုင်သည်။ Viewer သည် GLB ကို load လုပ်ပြီး driver/driven gear, shaft, teeth ကို ရွေးနိုင်သည်။ Tooth count ပြောင်းလျှင် GLB gear body geometry ကို runtime တွင် ပြန်တွက်ပေးသည်။ Engine အတွက်လည်း `public/models/engine/inline-four-engine.glb` ကို ထည့်ထားသည်။ Inline-four cutaway တွင် cylinder ၄ ခု၊ pistons၊ connecting rods၊ crankshaft၊ intake/exhaust valves၊ camshafts၊ manifolds၊ flywheel၊ oil pan နှင့် block ပါဝင်သည်။ `npm run model:engine` ဖြင့် ထပ်မံ generate လုပ်နိုင်သည်။ Engine page တွင် X-Ray ကို default ပြပြီး piston၊ connecting rod၊ crankshaft တို့ကို exterior shell မှတစ်ဆင့် မြင်နိုင်သည်။ Viewer အောက်ရှိ FULL ENGINE / SEE INSIDE · X-RAY / CUTAWAY ခလုတ်များဖြင့် view ပြောင်းနိုင်သည်။ Components panel သည် engine page တွင် ပုံမှန်ဖွင့်ပြီး part ကိုနှိပ်လျှင် အချက်အလက်ပြသည်။ Engine RPM နှင့် animation speed က piston/crankshaft/valve movement ကို သက်ရောက်စေသည်။ Hydraulic နှင့် motor များက ယခုထိ procedural Three.js geometry ဖြစ်သည်။
