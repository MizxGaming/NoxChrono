import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function useTheme() {
  const [mode, setMode] = useState(() =>
    document.documentElement.classList.contains("light") ? "light" : "dark"
  );
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", mode === "light");
  }, [mode]);
  return { mode, setMode };
}

function Card({ title, children, className = "" }) {
  return (
    <section
      className={
        "rounded-xl bg-surface0/70 backdrop-blur border border-surface1/60 shadow-lg shadow-black/30 p-4 md:p-5 " +
        "hover:shadow-xl hover:-translate-y-[1px] transition-transform " +
        className
      }
    >
      {title && <h2 className="text-sm font-semibold text-subtext1 mb-2 tracking-wide">{title}</h2>}
      {children}
    </section>
  );
}

function Timer() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    const tick = (t) => {
      if (start.current == null) start.current = t;
      setMs((prev) => prev + (t - (start.current ?? t)));
      start.current = t;
      raf.current = requestAnimationFrame(tick);
    };
    if (running) raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); start.current = null; };
  }, [running]);

  const { h, m, s } = useMemo(() => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s };
  }, [ms]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-[10vw] leading-none font-black tracking-tight 
                      text-lavender drop-shadow-[0_6px_24px_color-mix(in_oklab,var(--color-lavender)_25%,transparent)]
                      select-none will-change-transform transform-gpu">
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setRunning((v) => !v)}
          className="px-5 py-2 rounded-lg bg-teal-20 text-teal border border-teal/40 hover:bg-teal-30 active:scale-[0.98] transition"
          style={{ color: "var(--color-teal)", borderColor: "color-mix(in oklab, var(--color-teal) 40%, transparent)" }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setMs(0); setRunning(false); }}
          className="px-5 py-2 rounded-lg bg-red-20 text-red border border-red/40 hover:bg-red-30 active:scale-[0.98] transition"
          style={{ color: "var(--color-red)", borderColor: "color-mix(in oklab, var(--color-red) 40%, transparent)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function App() {
  const { mode, setMode } = useTheme();

  return (
    <div className="min-h-dvh bg-base text-text grid grid-cols-1 md:grid-cols-12 grid-rows-[auto_auto_auto_auto] md:grid-rows-6 gap-4 p-4 md:p-6">
      {/* Top Left: concise past stats */}
      <div className="md:col-span-3 md:row-span-2">
        <Card title="Today at a glance">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Study</span><span className="text-subtext1">1h 20m</span></li>
            <li className="flex justify-between"><span>Workout</span><span className="text-subtext1">45m</span></li>
            <li className="flex justify-between"><span>Reading</span><span className="text-subtext1">30m</span></li>
          </ul>
        </Card>
      </div>

      {/* Center Left: action buttons */}
      <div className="md:col-span-3 md:row-span-2">
        <Card title="Quick actions">
          <div className="grid grid-cols-2 gap-3">
            {["Add Activity","Log Pomodoro","Start Focus","Add Note"].map((label) => (
              <button key={label}
                className="rounded-lg px-3 py-3 text-left bg-surface1/60 border border-overlay0/40
                           hover:bg-surface1 hover:translate-y-[-1px] active:translate-y-0 transition"
              >
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-subtext1 text-xs">Fast shortcut</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Left: weekly stats */}
      <div className="md:col-span-3 md:row-span-2">
        <Card title="This week">
          <div className="flex items-end gap-2 h-24">
            {[60,40,75,90,30,50,80].map((v,i)=>(
              <div key={i}
                   className="w-6 rounded-md border hover:opacity-90 transition"
                   style={{
                     height: `${Math.max(8, v)}%`,
                     backgroundColor: "color-mix(in oklab, var(--color-blue) 30%, transparent)",
                     borderColor: "color-mix(in oklab, var(--color-blue) 50%, transparent)"
                   }} />
            ))}
          </div>
          <p className="mt-2 text-xs text-subtext1">Minutes per day</p>
        </Card>
      </div>

      {/* Center: big timer */}
      <div className="md:col-span-6 md:row-span-4 flex items-center justify-center">
        <Card className="w-full h-full flex items-center justify-center">
          <Timer />
        </Card>
      </div>

      {/* Top Right: leaderboard */}
      <div className="md:col-span-3 md:row-span-2">
        <Card title="Leaderboard">
          <ol className="text-sm space-y-2">
            {[
              { name: "Aarav", mins: 320 },
              { name: "Meera", mins: 295 },
              { name: "Yash", mins: 260 },
            ].map((u,i)=>(
              <li key={u.name} className="flex justify-between">
                <span className="font-semibold">{i+1}. {u.name}</span>
                <span className="text-subtext1">{u.mins} min</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Center Right: friends */}
      <div className="md:col-span-3 md:row-span-2">
        <Card title="Friends">
          <div className="flex gap-2 mb-3">
            <input placeholder="Add friend by email" className="flex-1 px-3 py-2 rounded-md bg-surface1/60 border border-overlay0/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-teal)]/50" />
            <button className="px-3 py-2 rounded-md border transition"
                    style={{ backgroundColor: "color-mix(in oklab, var(--color-teal) 20%, transparent)",
                             color: "var(--color-teal)",
                             borderColor: "color-mix(in oklab, var(--color-teal) 40%, transparent)" }}>
              Add
            </button>
          </div>
          <div className="space-y-2">
            {["Priya","Kunal","Riya"].map(n=>(
              <div key={n} className="flex items-center justify-between rounded-md bg-surface1/50 border border-overlay0/40 px-3 py-2">
                <span>{n}</span>
                <div className="flex gap-2">
                  <button className="hover:underline" style={{ color: "var(--color-blue)" }}>Invite</button>
                  <button className="hover:underline" style={{ color: "var(--color-red)" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-subtext1">Suggestions: Arjun, Neha</p>
        </Card>
      </div>

      {/* Bottom Right: preferences */}
      <div className="md:col-span-3 md:row-span-2">
        <Card title="Preferences">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={()=>setMode(mode === "dark" ? "light" : "dark")}
              className="px-3 py-2 rounded-md border transition"
              style={{
                backgroundColor: "color-mix(in oklab, var(--color-mauve) 20%, transparent)",
                color: "var(--color-mauve)",
                borderColor: "color-mix(in oklab, var(--color-mauve) 40%, transparent)"
              }}
            >
              Toggle Theme
            </button>
            <button className="px-3 py-2 rounded-md border transition"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--color-yellow) 20%, transparent)",
                      color: "var(--color-yellow)",
                      borderColor: "color-mix(in oklab, var(--color-yellow) 40%, transparent)"
                    }}>
              Account
            </button>
            <a href="https://github.com/yourname/noxchrono" target="_blank" rel="noreferrer"
               className="px-3 py-2 rounded-md border transition"
               style={{
                 backgroundColor: "color-mix(in oklab, var(--color-lavender) 20%, transparent)",
                 color: "var(--color-lavender)",
                 borderColor: "color-mix(in oklab, var(--color-lavender) 40%, transparent)"
               }}>
              GitHub
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
