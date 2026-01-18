export default function CrashTest() {
  // Dev-only route. In production, do not crash the app.
  if (!import.meta.env.DEV) {
    return null;
  }

  throw new Error("Crash test route triggered");
}
