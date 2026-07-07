import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Check, TrendingUp } from "lucide-react";

/**
 * FITVA Design System – StreakProgressCarousel
 * Slide 1: Current Streak tracker (Mon–Sun chips)
 * Slide 2: Your Progress capsule bar chart (Week / Month toggle)
 */
export default function StreakProgressCarousel({ user, C, progressChartMode, setProgressChartMode }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const weekData = [
    { label: "Mon", value: 56 },
    { label: "Tue", value: 32 },
    { label: "Wed", value: 68, highlight: true },
    { label: "Thu", value: 44 },
    { label: "Fri", value: 52 },
    { label: "Sat", value: 20 },
    { label: "Sun", value: 0 },
  ];
  const monthData = [
    { label: "W1", value: 58 },
    { label: "W2", value: 72, highlight: true },
    { label: "W3", value: 45 },
    { label: "W4", value: 63 },
  ];
  const data = progressChartMode === "week" ? weekData : monthData;
  const maxVal = Math.max(...data.map(d => d.value));
  const avgVal = Math.round(
    data.filter(d => d.value > 0).reduce((a, b) => a + b.value, 0) /
    data.filter(d => d.value > 0).length
  );
  const chartH = 110;

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    isDragging.current = true;
  };
  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const diff = dragStartX.current - endX;
    if (diff > 40) setSlideIdx(1);
    else if (diff < -40) setSlideIdx(0);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {/* ── Viewport (clips the sliding track) ── */}
      <div
        style={{ overflow: "hidden", borderRadius: 20, userSelect: "none" }}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
      >
        {/* ── Sliding track (200% wide, two 50% slides) ── */}
        <motion.div
          animate={{ x: slideIdx === 0 ? "0%" : "-50%" }}
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
          style={{ display: "flex", width: "200%" }}
        >

          {/* ─── SLIDE 1: Current Streak ─── */}
          <div style={{
            width: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg, rgba(0,229,168,0.10) 0%, rgba(91,140,255,0.07) 100%)",
            border: "1.5px solid rgba(0,229,168,0.20)",
            borderRadius: 20,
            padding: "16px",
            boxSizing: "border-box"
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 3 }}>Current Streak</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.text1, lineHeight: 1 }}>{user.streak} Days</div>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,229,168,0.25) 0%, rgba(0,229,168,0.04) 100%)",
                border: "1.5px solid rgba(0,229,168,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Flame size={18} color="var(--color-primary)" />
              </div>
            </div>

            {/* Day chips */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => {
                const isActive = i < 5;
                const isToday = i === 4;
                return (
                  <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? "var(--color-primary)" : C.text3 }}>{day}</div>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 20 }}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        backgroundColor: isActive ? "var(--color-primary)" : "rgba(255,255,255,0.04)",
                        border: isActive ? "none" : `1.5px solid ${C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: isActive && isToday ? "0 0 12px rgba(0,229,168,0.55)" : "none"
                      }}
                    >
                      {isActive
                        ? <Check size={13} strokeWidth={3} color="#0B1020" />
                        : <span style={{ fontSize: 9, color: C.text3, fontWeight: 700 }}>{day[0]}</span>
                      }
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Swipe hint */}
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 9, color: C.text3, fontWeight: 600, letterSpacing: "0.3px" }}>
              Swipe left → progress chart
            </div>
          </div>

          {/* ─── SLIDE 2: Your Progress Chart ─── */}
          <div style={{
            width: "50%",
            flexShrink: 0,
            backgroundColor: C.surface,
            border: `1.5px solid ${C.border}`,
            borderRadius: 20,
            padding: "16px",
            boxSizing: "border-box"
          }}>
            {/* Header + toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: C.text1 }}>Your progress</div>
                <div style={{ fontSize: 9, color: C.text2, marginTop: 2, lineHeight: 1.4 }}>Focus minutes this week</div>
              </div>
              <div style={{ display: "flex", gap: 2, backgroundColor: C.bg, borderRadius: 999, padding: 3, border: `1px solid ${C.border}` }}>
                {["week","month"].map(mode => (
                  <motion.button
                    key={mode}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); setProgressChartMode(mode); }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      padding: "4px 10px", borderRadius: 999, border: "none",
                      fontSize: 10, fontWeight: 700, cursor: "pointer",
                      backgroundColor: progressChartMode === mode ? "var(--color-primary)" : "transparent",
                      color: progressChartMode === mode ? "#0B1020" : C.text2,
                      transition: "all 0.2s"
                    }}
                  >
                    {mode === "week" ? "Week" : "Month"}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bars */}
            <div style={{ display: "flex", alignItems: "flex-end", height: chartH, gap: 5 }}>
              {data.map((d, i) => {
                const barH = d.value > 0 ? Math.max((d.value / maxVal) * chartH, 16) : 16;
                return (
                  <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {d.value > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: d.highlight ? "var(--color-primary)" : C.text2 }}>{d.value}</span>
                        {d.highlight && (
                          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TrendingUp size={7} color="#0B1020" />
                          </div>
                        )}
                      </div>
                    )}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: slideIdx === 1 ? 1 : 0 }}
                      transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                      style={{
                        width: "100%", height: barH, borderRadius: 999,
                        background: d.highlight
                          ? "linear-gradient(to top, rgba(0,229,168,0.35) 0%, rgba(0,229,168,0.95) 100%)"
                          : d.value > 0
                            ? "linear-gradient(to top, rgba(0,229,168,0.07) 0%, rgba(0,229,168,0.35) 100%)"
                            : "rgba(255,255,255,0.04)",
                        border: d.highlight ? "1.5px solid rgba(0,229,168,0.55)" : `1px solid ${C.border}`,
                        transformOrigin: "bottom",
                        position: "relative", overflow: "hidden"
                      }}
                    >
                      {d.value > 0 && (
                        <div style={{
                          position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)",
                          width: "50%", height: "25%", borderRadius: 999,
                          backgroundColor: d.highlight ? "rgba(0,229,168,0.5)" : "rgba(0,229,168,0.18)"
                        }} />
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Day labels */}
            <div style={{ display: "flex", marginTop: 6 }}>
              {data.map(d => (
                <div key={d.label} style={{ flex: 1, textAlign: "center", fontSize: 8, fontWeight: 700, color: d.highlight ? "var(--color-primary)" : C.text3 }}>{d.label}</div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "rgba(0,229,168,0.5)", border: "1.5px solid var(--color-primary)" }} />
                <span style={{ fontSize: 8, color: C.text2 }}>Minutes of focused study</span>
              </div>
              <span style={{ fontSize: 8, fontWeight: 800, color: C.text1 }}>
                Avg: <span style={{ color: "var(--color-primary)" }}>{avgVal} min/day</span>
              </span>
            </div>
          </div>

        </motion.div>
      </div>

      {/* ── Dot indicators ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {[0, 1].map(idx => (
          <motion.div
            key={idx}
            onClick={() => setSlideIdx(idx)}
            animate={{
              width: slideIdx === idx ? 22 : 7,
              backgroundColor: slideIdx === idx ? "var(--color-primary)" : C.border
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ height: 7, borderRadius: 999, cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}
