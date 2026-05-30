// Verity — Modal
// The only flat-UI element permitted a shadow (it is a true overlay).
// <Modal eyebrow title onClose footer={<>…</>}>body</Modal>
function Modal({ eyebrow, title, onClose, footer, children }) {
  function backdrop(e) { if (e.target === e.currentTarget && onClose) onClose(); }
  return (
    <div className="modal-overlay" onClick={backdrop}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            {eyebrow && <div className="modal-eyebrow">{eyebrow}</div>}
            <div className="modal-title">{title}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
