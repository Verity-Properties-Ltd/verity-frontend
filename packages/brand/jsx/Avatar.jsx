// Verity — Avatar + AvatarStack
function Avatar({ tone = 'navy', size = 'md', children }) {
  const cls = ['avatar', tone !== 'navy' && tone, size === 'sm' && 'sm', size === 'lg' && 'lg']
    .filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}

function AvatarStack({ children }) {
  return (
    <span style={{ display:'inline-flex' }}>
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          style: { ...(child.props.style||{}), marginLeft: i ? -8 : 0, border: '2px solid #F5F2ED' }
        })
      )}
    </span>
  );
}
