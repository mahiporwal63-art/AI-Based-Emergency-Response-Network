export default function Navbar({ page, navigate, auth, onLogout }) {
  const links = [
    ['home', 'Overview'],
    ...(auth?.user?.role === 'Citizen'
      ? [['report', 'Report emergency']]
      : auth?.user?.role === 'Control Officer'
        ? [['dashboard', 'Control room']]
        : [
          ['report', 'Report emergency'],
          ['dashboard', 'Control room'],
        ]),
  ];

  return (
    <header className="navbar">
      <button
        className="brand"
        type="button"
        onClick={() => navigate('home')}
        aria-label="Go to overview"
      >
        <span className="brand-icon" aria-hidden="true">+</span>
        <span>Response<span className="brand-light"> Network</span></span>
      </button>
      <nav className="nav-links" aria-label="Main navigation">
        {links.map(([id, label]) => (
          <button
            className={page === id || (id === 'dashboard' && page === 'details') ? 'active' : ''}
            type="button"
            onClick={() => navigate(id)}
            key={id}
            aria-current={page === id ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>
      {auth?.user ? (
        <div className="nav-user">
          <span className="nav-user-label">{auth.user.role}</span>
          <button className="nav-login" type="button" onClick={onLogout}>Sign out</button>
        </div>
      ) : (
        <button className="nav-login" type="button" onClick={() => navigate('login', 'Control Officer')}>
          Sign in <span aria-hidden="true">↗</span>
        </button>
      )}
    </header>
  );
}
