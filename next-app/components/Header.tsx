import Link from 'next/link';

const Header = () => {
  return (
    <header className='p-8 border-b-4 border-slate-200 flex justify-between gap-4 items-center'>
      <Link href="/">
        <img src="/supplysignal.svg" alt="Supplysignal logo" className='w-64' />
      </Link>
      <img src="/logo.png" alt="Outokumpu logo" className='h-14 w-14' />
    </header>
  );
};

export default Header;
