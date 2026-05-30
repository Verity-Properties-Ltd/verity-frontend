/**
 * Verity — Modal. The only flat-UI element permitted a shadow (it is a
 * true overlay per PRD §11.3 banned-pattern exception).
 *
 * Canonical CSS: .modal-overlay, .modal, .modal-head, .modal-eyebrow,
 * .modal-title, .modal-close, .modal-body, .modal-foot.
 */
export type ModalProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function Modal({ eyebrow, title, onClose, footer, children }: ModalProps) {
  function backdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && onClose) onClose();
  }
  return (
    <div className="modal-overlay" onClick={backdrop}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            {eyebrow && <div className="modal-eyebrow">{eyebrow}</div>}
            <div className="modal-title">{title}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
