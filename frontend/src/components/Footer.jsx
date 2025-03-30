import { Link } from "react-router-dom";
import { Github } from 'lucide-react';


const Footer = () => {
	return (
		<footer className='py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
				<div className='flex items-center gap-4'>
					<li className="list-none flex items-center gap-4">
						<Link to='/' className='text-balance' onClick={() => window.scrollTo(0, 0)}> Home </Link>
						{/* <Link to='/tv' className='text-balance'> TV Shows </Link> */}
						{/* <Link to='/movies' className='text-balance'> Movies </Link> */}
					</li>
					
					</div>
					
					<p>KFlix @2025</p>
					<p className="flex">
					<a
						href='https://github.com/viVeK21111/netflix_clone'
						target='_blank'
						rel='noreferrer'
						className='font-medium underline underline-offset-4'
					>
						<Github size={24} />
					</a>
					
				</p>
			</div>
		</footer>
	);
};
export default Footer;
