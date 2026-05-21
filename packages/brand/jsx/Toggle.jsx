// Verity — Toggle + Segmented
function Toggle({ on, onChange }) {
  return (
    <span
      className={`toggle ${on ? 'on' : ''}`}
      onClick={() => onChange && onChange(!on)}
      role="switch"
      aria-checked={on}
    />
  );
}

function Segmented({ value, options = [], onChange }) {
  return (
    <div className="segmented">
      {options.map(opt => (
        <span
          key={opt}
          className={`seg ${value === opt ? 'active' : ''}`}
          onClick={() => onChange && onChange(opt)}
        >{opt}</span>
      ))}
    </div>
  );
}
