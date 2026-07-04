import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { color, space, motion, typography } from "../design/tokens";

/**
 * FITVA Design System – Sheet Component
 * Replaces inline overlay sheets. Features a drag handle, backdrop click close, spring animations, and drag-down-to-dismiss.
 */
export default function Sheet({
  isOpen,
  onClose,
  title,
  children,
  zIndex = 1200,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <m.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(11, 16, 32, 0.75)",
              backdropFilter: "blur(8px)",
              zIndex: zIndex,
            }}
          />

          {/* Drawer Content */}
          <m.div
            key="sheet-container"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={motion.spring.sheet}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              // Dismiss if dragged down by > 120px or with sufficient velocity
              if (info.offset.y > 120 || info.velocity.y > 400) {
                onClose();
              }
            }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: color.surface,
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              borderTop: `1.5px solid ${color.border}`,
              padding: `0 ${space.xl} ${space.xl}`,
              boxSizing: "border-box",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              zIndex: zIndex + 1,
            }}
          >
            {/* Grabber handle */}
            <div
              style={{
                width: "48px",
                height: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "2px",
                margin: `${space.md} auto ${space.lg}`,
                cursor: "grab",
              }}
            />

            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: space.lg,
              }}
            >
              <h2
                style={{
                  fontFamily: typography.body,
                  fontSize: "18px",
                  fontWeight: "800",
                  color: color.text1,
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: color.text2,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {children}
            </div>
          </m.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
