import { useState } from "react";
import { Link } from "react-router-dom";

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const onSubmit = () => fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

  return (
    <div className='h-screen w-full chat-bg'>
       <header className='max-w-6xl flex items-left justify-left p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/klogo.png'} alt='logo' className='w-24' />
        <h1 className='text-red-700 font-bold text-7xl'>Flix</h1>
        </Link>
      </header>
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-2xl max-h-screen bg-slate-900/55 shadow-md p-8 rounded-lg">
      <div className="flex items-center">
      <h1 className="text-3xl ml-52 font-bold mb-4 text-red-700">Flix Chat</h1>
      <img src={'/chat.png'} alt="chat" className="w-10 ml-3" />
      </div>
      

    <form onSubmit={onsubmit} className="space-y-4 mt-3">
      <div>
      <label className="text-white font-semibold text-lg items-center">Ask Me anything</label>
      <input
      type="text" className="my-5 p-2 bg-black text-white border rounded-lg w-full" placeholder="Whats on your mind...!"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      />
      </div>
     
      <button
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
      Search
      </button>
    </form>
    
          </div>

      
    </div>
    </div>
  );
}
