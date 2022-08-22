import Link from 'next/link';

const header = ({ currentUser }) => {

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser  && { label: 'Sign Out', href: '/auth/signout' },
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return (
                <li className='nav-item' key={href}>
                    <Link href={href}>
                        <a className='nav-link'>{label}</a>
                    </Link>
                </li>
            );
        });

    return (
        <nav className='navbar navbar-expand-lg bg-light'>
            <div className='container-fluid'>

                <Link href='/'>
                    <a className='navbar-brand'>GitTix</a>
                </Link>

                <div className='collapse navbar-collapse justify-content-end'>
                    <ul className='navbar-nav'>
                        {links}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default header;