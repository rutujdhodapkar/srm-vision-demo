import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Check, ChevronDown, Download, ImagePlus, Layers3, Menu, ScanSearch, Satellite, Sparkles, Upload, X } from 'lucide-react';
import './styles.css';

const demoImage = '/srm-source.png';

function Metric({ value, label, accent = false }) {
  return <div className={accent ? 'metric metric-accent' : 'metric'}><strong>{value}</strong><span>{label}</span></div>;
}

function App() {
  const [image, setImage] = useState(demoImage);
  const [fileName, setFileName] = useState('srm_close_detail_10m.png');
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(true);
  const [view, setView] = useState('result');
  const [split, setSplit] = useState(58);
  const [mobileMenu, setMobileMenu] = useState(false);

  const outputImage = useMemo(() => image + (image.includes('?') ? '&' : '?') + 'enhanced=1', [image]);

  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImage(URL.createObjectURL(file));
    setDone(false);
    setView('source');
  };

  const runModel = () => {
    setRunning(true);
    setDone(false);
    window.setTimeout(() => { setRunning(false); setDone(true); setView('result'); }, 1250);
  };

  const downloadResult = () => {
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}-srm-result.jpg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top"><span className="brand-mark"><Satellite size={18} strokeWidth={2.5} /></span><span>SRM<span className="brand-dot">.</span>LAB</span></a>
        <div className={mobileMenu ? 'nav-links open' : 'nav-links'}>
          <a href="#workspace">Workspace</a><a href="#how">How it works</a><a href="#about">About PS 142</a>
        </div>
        <div className="nav-actions"><span className="status"><i /> model online</span><button className="icon-button mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button><a className="nav-cta" href="#workspace">Try the model <ArrowUpRight size={16} /></a></div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy"><div className="eyebrow"><span>SIH 2026</span><b>PS 142</b><span>SPACE TECHNOLOGY</span></div><h1>See more<br /><em>from space.</em></h1><p className="hero-sub">A deep-learning demo for turning medium-resolution satellite imagery into sharper, more useful maps.</p><div className="hero-proof"><span className="proof-number">01</span><span>Input → SRM → decision-ready output</span></div><a className="hero-link" href="#workspace">Open the workspace <ArrowUpRight size={17} /></a></div>
        <div className="hero-art" aria-label="Satellite image detail visualization"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="satellite-shape"><div className="solar solar-left" /><div className="sat-body" /><div className="solar solar-right" /><div className="antenna" /></div><div className="coordinate coord-one">18°31′N<br />73°51′E</div><div className="coordinate coord-two">10×<br /><small>UPSCALE</small></div></div>
      </section>

      <section className="workspace shell" id="workspace">
        <div className="section-heading"><div><span className="kicker">01 / VISUAL INFERENCE</span><h2>Make the detail visible.</h2></div><div className="model-chip"><Sparkles size={16} /> SRM v0.1 <ChevronDown size={15} /></div></div>
        <div className="workspace-grid">
          <aside className="control-panel">
            <div className="panel-title"><span>INPUT IMAGE</span><span className="mono">{fileName}</span></div>
            <label className="dropzone"><input type="file" accept="image/*,.tif,.tiff" onChange={upload} /><ImagePlus size={24} /><strong>Drop an image here</strong><span>or click to browse · JPG, PNG, TIFF</span><u><Upload size={13} /> upload source</u></label>
            <div className="settings"><div className="panel-title"><span>MODEL SETTINGS</span><span className="mono">AUTO</span></div><div className="setting-row"><span>Upscale factor</span><strong>4×</strong></div><div className="setting-row"><span>Detail recovery</span><div className="range"><i /></div><strong>84%</strong></div><div className="setting-row"><span>Output format</span><strong>GeoTIFF</strong></div></div>
            <button className="run-button" onClick={runModel} disabled={running}>{running ? <><span className="spinner" /> processing image…</> : <><ScanSearch size={18} /> run SRM model <ArrowUpRight size={16} /></>}</button>
            <div className="trust"><Check size={15} /> <span>Demo inference · no data leaves your browser</span></div>
          </aside>
          <div className="visual-panel">
            <div className="visual-toolbar"><div className="tabs"><button className={view === 'source' ? 'active' : ''} onClick={() => setView('source')}>Source <span>10 m</span></button><button className={view === 'result' ? 'active' : ''} onClick={() => setView('result')}>SRM result <span>2.5 m</span></button></div><div className="visual-tools"><span className={done ? 'live' : ''}><i /> {done ? 'inference ready' : 'awaiting run'}</span><button title="Download result" onClick={downloadResult}><Download size={17} /></button></div></div>
            <div className={view === 'result' && done ? 'image-stage comparison' : 'image-stage'}><img className="source-layer" src={image} alt="Medium-resolution satellite imagery showing an urban area" />{view === 'result' && done && <div className="result-layer" style={{ clipPath: `polygon(0 0, ${split}% 0, ${split}% 100%, 0 100%)` }}><img src={outputImage} alt="SRM enhanced satellite imagery showing an urban area" /></div>}<div className="image-overlay top-left">{view === 'result' && done ? 'SRM OUTPUT' : 'SOURCE IMAGE'}<br /><b>{view === 'result' && done ? 'ENHANCED' : 'MEDIUM RES.'}</b></div><div className="image-overlay bottom-right">N 18°31′24.0″<br />E 73°51′12.8″</div><div className="crosshair" />{view === 'result' && done && <><input className="split-input" aria-label="Compare source and SRM result" type="range" min="10" max="90" value={split} onChange={(event) => setSplit(event.target.value)} /><div className="split-line" style={{ left: `${split}%` }} /><div className="split-control" style={{ left: `${split}%` }}><span>↔</span></div><div className="compare-label source-label">SOURCE</div><div className="compare-label result-label">SRM RESULT</div></>}</div>
            <div className="visual-caption"><div><strong>{view === 'result' && done ? 'Sharper roads. Cleaner edges. More signal.' : 'Original medium-resolution input'}</strong><span>{view === 'result' && done ? 'Drag the divider to compare the input with the reconstructed output.' : 'Run the SRM model to reveal structures hidden in the source pixels.'}</span></div><span className="resolution">{view === 'result' && done ? '2.5 m / px' : '10 m / px'}</span></div>
          </div>
        </div>
        <div className="metrics"><Metric value="4×" label="spatial upscale" accent /><Metric value="10 → 2.5 m" label="resolution gain" /><Metric value="RGB + NIR" label="input bands" /><Metric value="00:12" label="demo inference" /></div>
      </section>

      <section className="how shell" id="how"><div className="section-heading"><div><span className="kicker">02 / MODEL LOGIC</span><h2>From pixels to patterns.</h2></div><p>Designed for the details that matter in the field.</p></div><div className="steps"><div className="step"><span>01</span><Layers3 size={23} /><h3>Ingest</h3><p>Accept medium-resolution satellite tiles and validate the image footprint.</p></div><div className="step active-step"><span>02</span><Sparkles size={23} /><h3>Enhance</h3><p>Reconstruct sharper spatial features with a deep-learning SRM model.</p></div><div className="step"><span>03</span><ScanSearch size={23} /><h3>Inspect</h3><p>Export a clear map for roads, buildings, agriculture, and damage review.</p></div></div></section>

      <footer className="footer shell" id="about"><div className="footer-brand"><span className="brand-mark"><Satellite size={18} /></span><div><strong>SRM.LAB</strong><p>Super Resolution Mapping<br />for SIH 2026 · PS 142</p></div></div><div className="footer-note">A focused prototype for making<br />satellite imagery more actionable.</div><span className="footer-number">© 2026 / 142</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
