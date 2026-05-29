// Tweaks panel for the CHICKS pitch deck.
// Controls the CHICKS logo prominence (topbar mark on every slide + cover hero)
// and the brand accent color, writing CSS custom properties onto the document
// root. deck-stage.js listens for the 'tweakchange' event useTweaks dispatches
// and re-renders its thumbnail rail to match.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lockupScale": 1.45,
  "coverScale": 1.0,
  "accent": "#D4A02A"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty('--lockup-scale', String(t.lockupScale));
    s.setProperty('--cover-mark-scale', String(t.coverScale));
    s.setProperty('--audience', t.accent);
  }, [t.lockupScale, t.coverScale, t.accent]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand presence" />
      <TweakSlider
        label="Brand mark size"
        value={t.lockupScale} min={1} max={2.2} step={0.05} unit="×"
        onChange={(v) => setTweak('lockupScale', v)} />
      <TweakSlider
        label="Cover logo size"
        value={t.coverScale} min={0.7} max={1.5} step={0.05} unit="×"
        onChange={(v) => setTweak('coverScale', v)} />
      <TweakSection label="Color" />
      <TweakColor
        label="Brand accent"
        value={t.accent}
        options={['#D4A02A', '#D9521A', '#1A52A8', '#F2BD2C']}
        onChange={(v) => setTweak('accent', v)} />
    </TweaksPanel>
  );
}

const mount = document.getElementById('tweaks-root');
ReactDOM.createRoot(mount).render(<App />);
