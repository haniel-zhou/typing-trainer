import { RhythmPreset } from "@/lib/types";

export const RHYTHM_PRESETS: RhythmPreset[] = [
  {
    id: "nitro-rise",
    name: "Nitro Rise",
    bpm: 132,
    mood: "热身冲刺",
    rootHz: 110,
    kickPattern: "x---x---x---x---",
    snarePattern: "----x-------x---",
    hatPattern: "x-x-xxxxx-x-xxxx",
    bassline: [0, 0, 3, 5],
    leadline: [12, null, 15, null, 10, null, 15, null]
  },
  {
    id: "pulse-drive",
    name: "Pulse Drive",
    bpm: 136,
    mood: "稳定推进",
    rootHz: 116.54,
    kickPattern: "x--xx---x--xx---",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 5, 7, 3],
    leadline: [12, 10, null, 15, 12, 10, null, 17]
  },
  {
    id: "flash-grid",
    name: "Flash Grid",
    bpm: 140,
    mood: "电子颗粒",
    rootHz: 123.47,
    kickPattern: "x---x-x-x---x-x-",
    snarePattern: "----x-------x---",
    hatPattern: "x-xxxxxxxx-x-xxx",
    bassline: [0, 7, 3, 10],
    leadline: [12, null, 19, null, 15, null, 17, null]
  },
  {
    id: "vector-dash",
    name: "Vector Dash",
    bpm: 142,
    mood: "高速直线",
    rootHz: 130.81,
    kickPattern: "x-x-x---x-x-x---",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 3, 7, 10],
    leadline: [12, 15, 17, 15, 12, 15, 19, null]
  },
  {
    id: "blaze-loop",
    name: "Blaze Loop",
    bpm: 145,
    mood: "竞技燃感",
    rootHz: 98,
    kickPattern: "x---x---x-xx----",
    snarePattern: "----x-------x-x-",
    hatPattern: "x-x-xxxxxxx-xxxx",
    bassline: [0, 0, 7, 5],
    leadline: [12, null, 10, 12, 15, null, 10, 12]
  },
  {
    id: "redline-core",
    name: "Redline Core",
    bpm: 148,
    mood: "耐力提速",
    rootHz: 110,
    kickPattern: "x-xx----x-xx----",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 5, 3, 7],
    leadline: [12, 17, null, 15, 12, 19, null, 17]
  },
  {
    id: "cyber-lane",
    name: "Cyber Lane",
    bpm: 150,
    mood: "霓虹夜跑",
    rootHz: 116.54,
    kickPattern: "x---x-xxx---x-xx",
    snarePattern: "----x-------x---",
    hatPattern: "x-xxxxxxxxxxxxxx",
    bassline: [0, 7, 10, 7],
    leadline: [12, null, 15, 17, 19, null, 15, 12]
  },
  {
    id: "storm-rush",
    name: "Storm Rush",
    bpm: 152,
    mood: "中盘爆发",
    rootHz: 123.47,
    kickPattern: "x-x-x-xxx-x-x-xx",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 3, 5, 10],
    leadline: [12, 10, 12, null, 17, 15, 12, null]
  },
  {
    id: "overclock",
    name: "Overclock",
    bpm: 156,
    mood: "超频手感",
    rootHz: 130.81,
    kickPattern: "x---xx--x---xx--",
    snarePattern: "----x--x----x--x",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 0, 7, 12],
    leadline: [12, 15, 19, 15, 12, 17, 22, 19]
  },
  {
    id: "neon-clash",
    name: "Neon Clash",
    bpm: 158,
    mood: "灯墙压迫",
    rootHz: 98,
    kickPattern: "x-x-x-x-x-x-x-x-",
    snarePattern: "----x-------x---",
    hatPattern: "x-xx-xx-xx-xx-xx",
    bassline: [0, 5, 8, 7],
    leadline: [12, null, 15, 17, 12, null, 19, 20]
  },
  {
    id: "skybreaker",
    name: "Skybreaker",
    bpm: 160,
    mood: "冲榜专用",
    rootHz: 110,
    kickPattern: "x--xx-xxx--xx-xx",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 7, 10, 12],
    leadline: [12, 19, 17, 15, 12, 17, 15, 10]
  },
  {
    id: "thunder-lane",
    name: "Thunder Lane",
    bpm: 162,
    mood: "肌肉记忆",
    rootHz: 116.54,
    kickPattern: "x-xx-x-xx-xx-x-x",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 3, 7, 5],
    leadline: [12, null, 15, 12, 17, 15, 12, null]
  },
  {
    id: "ignite-grid",
    name: "Ignite Grid",
    bpm: 166,
    mood: "后程提神",
    rootHz: 123.47,
    kickPattern: "x-x-xx-xx-x-xx-x",
    snarePattern: "----x---x---x---",
    hatPattern: "x-xxxxxxxxxxxxxx",
    bassline: [0, 8, 7, 10],
    leadline: [12, 15, null, 19, 17, 15, null, 22]
  },
  {
    id: "final-burst",
    name: "Final Burst",
    bpm: 170,
    mood: "极限冲刺",
    rootHz: 130.81,
    kickPattern: "x-xx-xx-x-xx-xx-",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 7, 10, 14],
    leadline: [12, 17, 19, 22, 19, 17, 15, 12]
  },
  {
    id: "apex-rally",
    name: "Apex Rally",
    bpm: 174,
    mood: "冠军回合",
    rootHz: 98,
    kickPattern: "x-x-xx-x-x-xx-xx",
    snarePattern: "----x-------x---",
    hatPattern: "xxxxxxxxxxxxxxxx",
    bassline: [0, 5, 12, 10],
    leadline: [12, 15, 17, 20, 17, 15, 12, 10]
  }
];

export function getRhythmPresetById(id: string) {
  return RHYTHM_PRESETS.find((item) => item.id === id) ?? RHYTHM_PRESETS[0];
}
