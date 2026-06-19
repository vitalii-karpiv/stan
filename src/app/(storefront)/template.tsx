// A template (unlike a layout) re-mounts on every navigation, so the
// `page-enter` animation replays on each route change for a smoother transition.
export default function StorefrontTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="page-enter">{children}</div>;
}
