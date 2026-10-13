/**
 * The site's colour identity, in one place.
 *
 * The scene and the stylesheet must agree, so both read from here: the CSS
 * custom properties below are written to mirror the active preset exactly.
 * Switching palette is changing `ACTIVE`, not recolouring the project.
 *
 * `smoke` is deliberately a desaturated, darkened relative of the primary. The
 * reference does the same — its nebula sits several steps duller than the
 * constellation, which is what keeps the atmosphere behind the subject instead
 * of competing with it.
 */

export const PRESETS = {
  /**
   * The reference's own scene colours and transition order, extracted from its
   * bundle. Kept as a comparison preset.
   *
   * Note the base colours are near-black. They are the *line* colour, and under
   * additive blending a near-black line contributes almost nothing — which is
   * precisely why the reference's threads read as a whisper. Expect the web to
   * all but vanish under this preset; that is faithful, not broken.
   */
  'reference-scene': {
    ink: '#08090b',
    paper: '#e8eef0',
    primary: '#22363e',
    accent: '#ffffff',
    smoke: '#5a8aa2',
    pale: '#ffffff',
    muted: '#6d7c85',
    dim: '#9aa39f',
    raised: '#0e1114',
    tints: [
      { primary: '#22363e', accent: '#ffffff', smoke: '#5a8aa2', scrim: '34, 54, 62' },
      { primary: '#1c2f52', accent: '#a8c3f0', smoke: '#5a8aa2', scrim: '28, 47, 82' },
      { primary: '#141416', accent: '#ffffff', smoke: '#5a8aa2', scrim: '20, 20, 22' },
      { primary: '#402d18', accent: '#ecc78e', smoke: '#5a8aa2', scrim: '64, 45, 24' },
      { primary: '#163a28', accent: '#93d9ac', smoke: '#5a8aa2', scrim: '22, 58, 40' },
    ],
  },
  /**
   * Tonal: one hue family throughout. The accent is not a contrasting colour
   * but a lighter step of the same blue, which is why nothing in the scene can
   * clash — there is only one hue to clash with.
   */
  'tonal-night': {
    ink: '#060a14',
    paper: '#dfe6f2',
    primary: '#6b8ab8', // the constellation and its threads
    accent: '#9dbbe8', // links and highlights: lighter, same family
    smoke: '#2a3d5c',
    pale: '#dfe6f2',
    // Secondary text. Measured against the ink at 3.65:1 before, which fails
    // WCAG AA for the small uppercase it is used for; 6.6:1 now.
    muted: '#8496b4',
    dim: '#93a2bc',
    raised: '#0c1222',
    /**
     * One pair per section, in scroll order: threads and points shift as the
     * document moves, the way the reference retints its object per chapter.
     * All stay inside the one hue family, so the shift reads as a change of
     * light rather than as a change of subject.
     */
    /**
     * A full set per section: threads and points, the smoke behind them, and
     * the page scrim. Tinting only the constellation left the background
     * unchanged and the shift read as a glitch rather than as a change of light.
     */
    tints: [
      { primary: '#6b8ab8', accent: '#9dbbe8', smoke: '#2a3d5c', scrim: '6, 10, 20' },
      { primary: '#8f83c8', accent: '#b6aef0', smoke: '#383457', scrim: '10, 8, 22' },
      { primary: '#4f9fc4', accent: '#8ad0ea', smoke: '#23485c', scrim: '4, 13, 22' },
      { primary: '#5a6fbe', accent: '#8f9fe8', smoke: '#2a3358', scrim: '7, 8, 24' },
      { primary: '#56a99b', accent: '#8fd8c6', smoke: '#204f49', scrim: '4, 15, 16' },
      // Selected work and selected publications, held across both bands.
      { primary: '#7b8fd0', accent: '#a9b8f2', smoke: '#2b3560', scrim: '8, 10, 26' },
      // The academic path.
      { primary: '#4c93b0', accent: '#86c6dc', smoke: '#1f4351', scrim: '4, 12, 18' },
      // News and contact, held across both bands.
      { primary: '#8a86c4', accent: '#b3aeea', smoke: '#332f52', scrim: '9, 8, 21' },
    ],
  },
  /** No chromatic accent at all; warmth lives only in the whites. */
  'mono-ivory': {
    ink: '#07070a',
    paper: '#efeae0',
    primary: '#b6b3ab',
    accent: '#efeae0',
    smoke: '#3a3a3d',
    pale: '#efeae0',
    muted: '#6f6d68',
    dim: '#9d9a93',
    raised: '#101014',
  },
  'ink-copper': {
    ink: '#060910',
    paper: '#ece7df',
    primary: '#7f9c92', // sage — the constellation and its wiring
    accent: '#c9704f', // copper — hubs, highlights, links
    smoke: '#4f6b63',
    pale: '#ece7df',
    muted: '#6d7c85',
    dim: '#9aa39f',
    raised: '#0b1019',
  },
  'graphite-prussian': {
    ink: '#0b0d10',
    paper: '#eef2f7',
    primary: '#7f9bc0',
    accent: '#3d6fb4',
    smoke: '#3c5170',
    pale: '#dce6f2',
    muted: '#6b7a8c',
    dim: '#9aa8ba',
    raised: '#11161d',
  },
  'night-amber': {
    ink: '#040a0a',
    paper: '#efe8da',
    primary: '#6f9481',
    accent: '#e0a458',
    smoke: '#40615a',
    pale: '#efe8da',
    muted: '#75837c',
    dim: '#9ba79c',
    raised: '#0a1211',
  },
  'emerald-forest': {
    ink: '#071512',
    paper: '#eaf5f0',
    primary: '#329577',
    accent: '#2dd4bf',
    smoke: '#14382e',
    pale: '#eaf5f0',
    muted: '#749e90',
    dim: '#92b7aa',
    raised: '#0e241e',
    tints: [
      { primary: '#329577', accent: '#2dd4bf', smoke: '#14382e', scrim: '7, 21, 18' },
      { primary: '#288469', accent: '#34d399', smoke: '#123229', scrim: '6, 20, 16' },
      { primary: '#21785f', accent: '#2dd4bf', smoke: '#102c24', scrim: '5, 18, 15' },
      { primary: '#2b866c', accent: '#4ade80', smoke: '#13352b', scrim: '6, 19, 16' },
      { primary: '#329577', accent: '#2dd4bf', smoke: '#14382e', scrim: '7, 21, 18' },
      { primary: '#2a8267', accent: '#38bdf8', smoke: '#123027', scrim: '6, 19, 16' },
      { primary: '#1f6e57', accent: '#2dd4bf', smoke: '#0e2820', scrim: '5, 17, 14' },
      { primary: '#329577', accent: '#34d399', smoke: '#14382e', scrim: '7, 21, 18' },
    ],
  },
  'mediterranean-azure': {
    ink: '#06121e',
    paper: '#eaf2fb',
    primary: '#3b86cb',
    accent: '#38bdf8',
    smoke: '#122c44',
    pale: '#eaf2fb',
    muted: '#7497b7',
    dim: '#93b4d2',
    raised: '#0c2035',
    tints: [
      { primary: '#3b86cb', accent: '#38bdf8', smoke: '#122c44', scrim: '6, 18, 30' },
      { primary: '#3076b6', accent: '#60a5fa', smoke: '#10273d', scrim: '5, 16, 28' },
      { primary: '#2768a3', accent: '#38bdf8', smoke: '#0e2236', scrim: '5, 15, 26' },
      { primary: '#337cb9', accent: '#22d3ee', smoke: '#112940', scrim: '5, 17, 29' },
      { primary: '#3b86cb', accent: '#38bdf8', smoke: '#122c44', scrim: '6, 18, 30' },
      { primary: '#3173af', accent: '#818cf8', smoke: '#10263b', scrim: '5, 16, 27' },
      { primary: '#235e94', accent: '#38bdf8', smoke: '#0d1f30', scrim: '4, 14, 24' },
      { primary: '#3b86cb', accent: '#22d3ee', smoke: '#122c44', scrim: '6, 18, 30' },
    ],
  },
  'verdigris-terracotta': {
    ink: '#091314',
    paper: '#f4ede2',
    primary: '#429686',
    accent: '#e5a158',
    smoke: '#1b3532',
    pale: '#f4ede2',
    muted: '#7e9a93',
    dim: '#9bb4ad',
    raised: '#122221',
    tints: [
      { primary: '#429686', accent: '#e5a158', smoke: '#1b3532', scrim: '9, 19, 20' },
      { primary: '#368475', accent: '#f59e0b', smoke: '#172f2d', scrim: '8, 17, 18' },
      { primary: '#2f7466', accent: '#d97706', smoke: '#142a28', scrim: '7, 16, 17' },
      { primary: '#3b8c7d', accent: '#e5a158', smoke: '#193230', scrim: '8, 18, 19' },
      { primary: '#429686', accent: '#e5a158', smoke: '#1b3532', scrim: '9, 19, 20' },
      { primary: '#378677', accent: '#fbbf24', smoke: '#172f2d', scrim: '8, 17, 18' },
      { primary: '#296b5e', accent: '#d97706', smoke: '#122523', scrim: '6, 15, 16' },
      { primary: '#429686', accent: '#e5a158', smoke: '#1b3532', scrim: '9, 19, 20' },
    ],
  },
  'celadon-azure': {
    ink: '#080c0d',
    paper: '#edf1f0',
    primary: '#5b857d',
    accent: '#3ea8a2',
    smoke: '#1b2926',
    pale: '#edf1f0',
    muted: '#7a9692',
    dim: '#8ba3a0',
    raised: '#101618',
    tints: [
      { primary: '#5b857d', accent: '#3ea8a2', smoke: '#1b2926', scrim: '8, 12, 13' },
      { primary: '#4a7c76', accent: '#3bb5ad', smoke: '#172725', scrim: '7, 12, 12' },
      { primary: '#428a86', accent: '#38b2ac', smoke: '#152b2b', scrim: '6, 13, 14' },
      { primary: '#3d9492', accent: '#45bfb9', smoke: '#142f30', scrim: '6, 14, 15' },
      { primary: '#528277', accent: '#3ea8a2', smoke: '#192825', scrim: '8, 12, 13' },
      { primary: '#468682', accent: '#3db8b0', smoke: '#162b2a', scrim: '7, 13, 14' },
      { primary: '#3f7f7b', accent: '#39ada7', smoke: '#152827', scrim: '6, 12, 13' },
      { primary: '#568b82', accent: '#42b0a9', smoke: '#1a2a27', scrim: '8, 13, 13' },
    ],
  },
  'prussian-verdigris': {
    ink: '#070b0e',
    paper: '#eef2f5',
    primary: '#628c98',
    accent: '#48a98c',
    smoke: '#1b2c34',
    pale: '#eef2f5',
    muted: '#7b959f',
    dim: '#8fa5ad',
    raised: '#0f151b',
    tints: [
      { primary: '#628c98', accent: '#48a98c', smoke: '#1b2c34', scrim: '7, 11, 14' },
      { primary: '#568492', accent: '#40a283', smoke: '#182931', scrim: '7, 11, 14' },
      { primary: '#4d8091', accent: '#42a88a', smoke: '#162831', scrim: '6, 11, 15' },
      { primary: '#508b8b', accent: '#4db093', smoke: '#172a2e', scrim: '6, 12, 14' },
      { primary: '#5c8d93', accent: '#47a88b', smoke: '#1a2c31', scrim: '7, 11, 14' },
      { primary: '#54878e', accent: '#43a587', smoke: '#182a2f', scrim: '7, 11, 14' },
      { primary: '#4f7f8d', accent: '#3fa082', smoke: '#172830', scrim: '6, 11, 15' },
      { primary: '#5e9198', accent: '#4cb295', smoke: '#1b2d33', scrim: '7, 12, 15' },
    ],
  },
  'alpine-azure': {
    ink: '#070a08',
    paper: '#eaf0eb',
    primary: '#5e917d',
    accent: '#459bb2',
    smoke: '#192620',
    pale: '#eaf0eb',
    muted: '#789587',
    dim: '#8ca398',
    raised: '#0e1411',
    tints: [
      { primary: '#5e917d', accent: '#459bb2', smoke: '#192620', scrim: '7, 10, 8' },
      { primary: '#538a75', accent: '#3f96ae', smoke: '#16241e', scrim: '6, 10, 8' },
      { primary: '#4a8578', accent: '#3b9bb8', smoke: '#152420', scrim: '6, 10, 9' },
      { primary: '#488c88', accent: '#42a5c2', smoke: '#152726', scrim: '6, 11, 10' },
      { primary: '#558d7a', accent: '#439ab1', smoke: '#17251f', scrim: '7, 10, 8' },
      { primary: '#4c867c', accent: '#3d9db9', smoke: '#152522', scrim: '6, 10, 9' },
      { primary: '#508474', accent: '#4094ab', smoke: '#16231d', scrim: '6, 10, 8' },
      { primary: '#599380', accent: '#47a3bb', smoke: '#182721', scrim: '7, 11, 9' },
    ],
  },
};

export const ACTIVE = 'mediterranean-azure';

export function getActivePresetKey() {
  if (
    typeof document !== 'undefined' &&
    document.documentElement?.dataset?.palette &&
    PRESETS[document.documentElement.dataset.palette]
  ) {
    return document.documentElement.dataset.palette;
  }
  return ACTIVE;
}

export const palette = new Proxy(PRESETS[ACTIVE], {
  get(target, prop) {
    const activeKey = getActivePresetKey();
    const preset = PRESETS[activeKey] || PRESETS[ACTIVE];
    return preset[prop];
  },
});

/**
 * A light theme, measured but **not wired up**. Nothing emits it today; it is
 * kept because the measurement is the expensive part and throwing it away
 * would mean redoing it.
 *
 * It was built, shipped behind a toggle, and removed the same day — and the
 * reason is worth keeping, because the numbers say it should have worked.
 * Every value below clears 4.5:1 against the background and the two that carry
 * small uppercase clear 5.8:1, so the *text* was never the problem. The
 * pictures were. Every project and post cover is dark artwork on black; on
 * paper they read as black slabs punched through the page, and a detail page
 * became a white article wrapped around a black rectangle. The co-author graph
 * has the same trouble: dark pills and faint emissive threads, drawn for a
 * dark field. The homepage could not follow at all — additive blending, bloom
 * and additive trails add light to the background, and on white there is none
 * to add.
 *
 * **So a light theme here is a second art direction, not a second palette.**
 * Turning it back on means new cover images and a recoloured graph first; the
 * CSS below is the smallest part of that job.
 */
export const LIGHT = {
  ink: '#f2f4f8',
  paper: '#101a2c',
  primary: '#3d5c8a',
  accent: '#1f4f96',
  smoke: '#cbd6e8',
  muted: '#4d6079',
  dim: '#41546f',
  raised: '#ffffff',
};
