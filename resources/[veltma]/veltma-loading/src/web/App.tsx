import { useEffect, useMemo, useState } from 'react';
import { loadingConfig } from '../shared/config';
import { initialLoadingState, reduceLoadingEvent } from '../shared/loading/state';
import { getHandoverServerName } from './runtime/handover';
import { subscribeToLoadingEvents } from './runtime/loading-events';

function getHandoverData(): unknown {
  if (typeof window === 'undefined') return undefined;
  return window.nuiHandoverData;
}

export function App() {
  const [loadingState, setLoadingState] = useState(initialLoadingState);
  const handoverServerName = useMemo(() => getHandoverServerName(getHandoverData()), []);
  const serverName = handoverServerName ?? loadingConfig.serverName;
  const messageIndex = Math.min(
    loadingConfig.messages.length - 1,
    Math.floor(loadingState.progress * loadingConfig.messages.length),
  );

  useEffect(
    () =>
      subscribeToLoadingEvents((event) => {
        setLoadingState((state) => reduceLoadingEvent(state, event));
      }),
    [],
  );

  return (
    <main className="loading-screen">
      <Background />
      <div className="scrim" />
      <section className="content" aria-live="polite">
        <header className="brand">
          {loadingConfig.logoUrl ? (
            <img className="logo-image" src={loadingConfig.logoUrl} alt={`${serverName} logo`} />
          ) : (
            <div className="logo-mark" aria-hidden="true">
              V
            </div>
          )}
          <div>
            <p className="eyebrow">WELCOME TO</p>
            <h1>{serverName}</h1>
            <p className="tagline">{loadingConfig.tagline}</p>
          </div>
        </header>

        <div className="status-card">
          <div className="status-row">
            <span>{loadingState.statusText}</span>
            <span>{Math.round(loadingState.progress * 100)}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(loadingState.progress * 100)}
          >
            <span className="progress-fill" style={{ width: `${loadingState.progress * 100}%` }} />
          </div>
          <p className="message">{loadingConfig.messages[messageIndex]}</p>
        </div>

        <div className="lower-grid">
          <InfoPanel title="SERVER RULES" items={loadingConfig.rules} />
          {loadingConfig.links.length > 0 ? (
            <LinksPanel />
          ) : (
            <InfoPanel
              title="STATUS"
              items={[
                'Your connection is secure.',
                'The loading screen will close when the game is ready.',
              ]}
            />
          )}
        </div>
      </section>
      <footer className="footer">{loadingState.phase.toUpperCase()} · VELTMA</footer>
    </main>
  );
}

function Background() {
  if (loadingConfig.backgroundVideoUrl) {
    return (
      <video
        className="background-media"
        src={loadingConfig.backgroundVideoUrl}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    );
  }

  if (loadingConfig.backgroundImageUrl) {
    return (
      <img
        className="background-media"
        src={loadingConfig.backgroundImageUrl}
        alt=""
        aria-hidden="true"
      />
    );
  }

  return <div className="background-fallback" aria-hidden="true" />;
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="info-panel">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function LinksPanel() {
  return (
    <div className="info-panel">
      <h2>COMMUNITY</h2>
      <div className="links">
        {loadingConfig.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
