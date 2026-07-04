/**
 * FITVA Design System – IconBadge Component
 * Single controlled component that renders an icon inside a colored circular container.
 * Replaces 46+ inline duplicates of the same pattern throughout App.jsx.
 *
 * Props:
 *   icon     – React node (Lucide icon element, e.g. <Flame size={14} />)
 *   size     – outer circle diameter in px (default 28)
 *   bg       – circle background color (default "rgba(0,229,168,0.1)")
 *   style    – optional additional styles
 */
export default function IconBadge({
  icon,
  size = 28,
  bg = "rgba(0,229,168,0.1)",
  style = {},
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {icon}
    </div>
  );
}
