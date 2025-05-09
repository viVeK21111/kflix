import React from 'react';
import {House, List} from 'lucide-react';
import {Link} from 'react-router-dom';

export default function Terms() {
       return (
        <div className='min-h-screen bg-[#202229]'>
            <header className="flex w-full items-center py-1  bg-black bg-opacity-10 pl-1">
        <Link to={'/'} className='mr-auto' >
          <img src={'/kflix2.png'} alt='Kflix Logo' className='w-32 h-14' />
        </Link>
              <div className='flex ml-auto items-center p-2 '>
                <Link className='hover:bg-white hover:bg-opacity-5 p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House size={20}  className='mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
              </div>

      </header>
            <div className="pt-7 p-2 text-white">
      <div className="flex"><p className="font-semibold mr-2">*Note: </p> <p className="font-thin">No movies or tv shows are being stored in KFlix server. All are streamed from third party streamers.</p></div>

      </div>
     <ul className='list-none text-white pl-4'>
      <li>
        <div>
      <p className='text-white pt-7 font-semibold'>Security Concerns</p>
      <p className='font-thin text-white  pt-2'>And there is no way for third party streamers to collect your data. But still be cautious and usage of brave browser or adblocker is recommended and we don't encourage the users to put any sensitive information in any unknown or suspicious website.</p>
      </div>
      </li>
      <li>
      <div>
      <p className='text-white pt-7 font-semibold'>Suggestions</p>
      <p className='font-thin text-white  pt-2'>All the suggestions and recommendations are always welcomed. And if you have any queries please feel comfortable to reach us through <Link className='text-gray-400 hover:underline' to={'/contactus'}>Contact Us.</Link></p>
      </div>
      </li>
     </ul>
     </div>
     
)
}