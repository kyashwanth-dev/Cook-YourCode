function NavItem({ href, children, currentPath }) {
  const active = currentPath === href;

  return (
    <a
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium ${active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
    >
      {children}
    </a>
  );
}

function Layout({ children, currentPath }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-semibold">
            Cook YourCode
          </a>
          <nav className="flex gap-2">
            <NavItem href="/" currentPath={currentPath}>
              Problems
            </NavItem>
            <NavItem href="/admin" currentPath={currentPath}>
              Admin
            </NavItem>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

export default Layout;
