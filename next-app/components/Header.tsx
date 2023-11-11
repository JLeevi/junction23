import Link from "next/link"

const Header = () => {
  return (
    <header className="flex h-32 items-center justify-between gap-4 border-b-4 border-slate-200 p-8">
      <Link href="/">
        <img src="/supplysignal.svg" alt="Supplysignal logo" className="w-64" />
      </Link>
      <img src="/logo.png" alt="Outokumpu logo" className="h-14 w-14" />
    </header>
  )
}

export default Header
