import Link from "next/link";

export default function NotFound() {
  return (
    <div id="ContainerNotFound">
      <h1>404 Not Found</h1>
      <Link href="/login">Zurück zum Login</Link>
    </div>
  );
}
