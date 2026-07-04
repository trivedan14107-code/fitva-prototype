import { motion, AnimatePresence, useDragControls } from "framer-motion";

/**
 * FITVA Design System – Sheet Component
 * Bottom-sheet modal wrapper with spring entrance/exit and swipe-to-dismiss.
 *
 * Props:
 *   open      – boolean controlling visibility
 *   onClose   – callback to close the sheet
 *   children  – sheet body content
 *   zIndex    – overlay z-index (default 1200)
 */
export default function Sheet({
  open,
  onClose,
  children,
  zIndex = 1200,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            key="sheet-content"
            initial={{ y: 400, opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 300) {
                onClose();
              }
            }}
            style={{
              width: "100%",
              backgroundColor: "var(--fitva-surface, #FFFFFF)",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: "0 20px 36px",
              boxSizing: "border-box",
              borderTop: "1.5px solid var(--fitva-border, #E5E5EA)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grabber handle */}
            <div
              style={{
                width: 40,
                height: 4,
                backgroundColor: "var(--fitva-border, #ccc)",
                borderRadius: 2,
                margin: "12px auto 18px",
                cursor: "grab",
              }}
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
