import { Link } from "react-router-dom";



const Footer = () => {
	return (
		<footer className='hidden  py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
				<div className='hidden md:flex  items-center gap-4'>
					<li className="list-none flex items-center gap-4">
						<Link to='/' className=' text-gray-500 text-balance ' onClick={() => window.scrollTo(0, 0)}> Home </Link>
						{/* <Link to='/tv' className='text-balance'> TV Shows </Link> */}
						{/* <Link to='/movies' className='text-balance'> Movies </Link> */}
					</li>
					
					</div>
					<div>
						<p className="text-gray-400">@KFlix 2025</p>
					</div>
					
					<p className="flex">
					<Link to={'/contactus'} className="flex  py-2 w-full items-center text-gray-500 hover:underline"><p className="ml-2">Contact Us</p></Link>
					
				</p>
			</div>
		</footer>
	);
};
export default Footer;
