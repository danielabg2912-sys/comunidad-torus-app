import fs from 'fs';

const BRAIN = 'C:\\\\Users\\\\ALIEN\\\\.gemini\\\\antigravity\\\\brain\\\\73534c14-8177-47e8-818e-34b0685a0ef2';
const DEST = '.\\\\public\\\\products\\\\salud';

const copies = [
    { src: `${BRAIN}\\\\salud_breath_pro_1772311468773.png`, dest: `${DEST}\\\\breath.jpeg` },
    { src: `${BRAIN}\\\\salud_calmandfocus_pro_1772311482096.png`, dest: `${DEST}\\\\calm_and_focus.jpeg` },
    { src: `${BRAIN}\\\\salud_cannasex_pro_1772311496882.png`, dest: `${DEST}\\\\cannasex_lub.jpeg` },
    { src: `${BRAIN}\\\\salud_cbdesential_pro_1772311513285.png`, dest: `${DEST}\\\\cbd_essential.jpeg` },
    { src: `${BRAIN}\\\\salud_cremaagua_pro_1772311526589.png`, dest: `${DEST}\\\\crema_agua.jpg` },
    { src: `${BRAIN}\\\\salud_digestwell_pro_1772311538961.png`, dest: `${DEST}\\\\digest_well.jpeg` },
    { src: `${BRAIN}\\\\salud_energy_pro_1772311558358.png`, dest: `${DEST}\\\\energy_slim.jpeg` },
    { src: `${BRAIN}\\\\salud_focus_pro_1772311579365.png`, dest: `${DEST}\\\\focus_gomitas.jpg` },
    { src: `${BRAIN}\\\\salud_miel_pro_1772311591866.png`, dest: `${DEST}\\\\miel.jpeg` },
    { src: `${BRAIN}\\\\salud_phytobalance_pro_1772311604160.png`, dest: `${DEST}\\\\phytobalance.jpeg` },
    { src: `${BRAIN}\\\\salud_sensation_pro_1772311623375.png`, dest: `${DEST}\\\\sensation_gomitas.jpeg` },
    { src: `${BRAIN}\\\\salud_somnia_pro_1772311638653.png`, dest: `${DEST}\\\\somnia_gomitas.jpeg` },
];

for (const { src, dest } of copies) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`✅ ${dest}`);
    } catch (e) {
        console.log(`❌ ${src}: ${e.message}`);
    }
}

console.log('\\n¡Listo!');
process.exit(0);
