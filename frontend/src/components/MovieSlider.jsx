import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight,Loader } from "lucide-react";

const MovieSlider = ({ category }) => {
	useEffect( () => {
		sessionStorage.setItem("navigating_from_tv_page","false");
		
	  },[])
	  useEffect( () => {
		  sessionStorage.setItem("openseason",null);
		},[])
		
	
	const { contentType } = useContentStore();
	const [content, setContent] = useState([]);
	const [showArrows, setShowArrows] = useState(false);
	const [contentLoading, setContentLoading] = useState(true);

	const sliderRef = useRef(null);

	const formattedCategoryName =
		category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
	const formattedContentType = contentType === "movies" ? "Movies" : "TV Shows";

	useEffect(() => {
		setContentLoading(true);
		const getContent = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/category/${category}`);
				setContent(res.data.content);
			}
			catch (error) {
				console.error("Error fetching content:", error);
			}
			finally {
				setContentLoading(false);
			}
			
		};

		getContent();
	}, [contentType, category]);
	
	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};
	const scrollRight = () => {
		sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	return (
		<div
			className='bg-black text-white relative px-4'
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className='mb-4 text-2xl font-bold'>
				{formattedCategoryName} {formattedContentType}
			</h2>

			{contentLoading && (
				<div className='flex justify-center items-center bg-black h-full'>	
					<Loader className='animate-spin text-white w-8 h-8' />
				</div>
			)}
			<div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}>
				{content?.map((item) => (
					<Link to={contentType==='movies' ? `/movie?id=${item?.id}&name=${item?.title || item?.name}` : `tv/details?id=${item.id}&name=${item.name}`} className='min-w-[250px] relative group' key={item.id}>
						<div className='rounded-lg overflow-hidden'>
							<img
								src={SMALL_IMG_BASE_URL + (item.backdrop_path || item.profile_path || item.poster_path)}
								alt='Movie image'
								className='h-36 w-full transition-transform duration-300 rounded-xl border border-white border-opacity-60 ease-in-out group-hover:scale-125'
							/>
						</div>
						<p className='mt-2 text-center'>{item.title || item.name}</p>
					</Link>
				))}
			</div>

			{showArrows && (
				<>
					<button
						className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollLeft}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollRight}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
	);
};
export default MovieSlider;
