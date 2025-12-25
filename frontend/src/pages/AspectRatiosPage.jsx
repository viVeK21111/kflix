import React, { useState } from 'react';

/**
 * CINEMA-ACCURATE ASPECT RATIO VISUALIZER
 * -------------------------------------
 * ✔ Real theater logic (fixed screen width)
 * ✔ Diagram ↔ Legend bi-directional hover highlight
 * ✔ Historical + modern usage explanations
 * ✔ Individual format preview boxes
 * ✔ IMAX 70mm explanation (user-provided)
 * ✔ Fully responsive for all screen sizes
 */

const aspectRatios = [
  { id: '276', label: '2.76:1 – Ultra Panavision 70', ratio: 2.76, color: 'bg-red-500', border: 'border-red-500', era: '1950s–60s, revived 2015', why: 'Extreme horizontal spectacle to compete with television.', details: 'Widest theatrical format ever. Appears wide due to massive vertical reduction.', movies: 'Ben-Hur (1959), Sinners (2025), The Hateful Eight (2015), It\'s a Mad, Mad, Mad, Mad World (1963)' },
  { id: '255', label: '2.55:1 – Original CinemaScope', ratio: 2.55, color: 'bg-rose-500', border: 'border-rose-500', era: 'Early 1950s', why: 'First anamorphic widescreen system.', details: 'No optical soundtrack initially, allowing extra width.', movies: 'The Robe (1953), La La Land (2016), Lightyear (2022)' },
  { id: '239', label: '2.39:1 – CinemaScope / Scope', ratio: 2.39, color: 'bg-orange-500', border: 'border-orange-500', era: '1960s–present', why: 'Balanced widescreen standard.', details: 'Dominant modern theatrical format.', movies: 'All modern day movies' },
  { id: '220', label: '2.20:1 – 70mm Todd-AO', ratio: 2.20, color: 'bg-amber-500', border: 'border-amber-500', era: '1950s–70s', why: 'High-resolution 70mm without anamorphic lenses.', details: 'Praised for clarity and smooth motion.', movies: '2001: A Space Odyssey (1968), The Sound of Music (1965), Lawrence of Arabia (1962)' },
  { id: '190', label: '1.90:1 – IMAX Digital', ratio: 1.90, color: 'bg-yellow-500', border: 'border-yellow-500', era: '2000s–present', why: 'Taller immersive IMAX digital screens.', details: 'Slightly wider than standard 1.85.', movies: 'Top Gun: Maverick (2022), Dune Part Two (2024), Avatar: The Way of Water (2022), Avengers: Endgame (2019)' },
  { id: '185', label: '1.85:1 – Theatrical Flat', ratio: 1.85, color: 'bg-green-500', border: 'border-green-500', era: '1950s–present', why: 'Efficient framing for dialogue films.', details: 'Standard american movie/tv aspect ratio. Slightly taller than IMAX 1.90.', movies: 'The Godfather (1972), Pulp Fiction (1994), Forrest Gump (1994), Goodfellas (1990)' },
  { id: '143', label: '1.43:1 – IMAX 70mm', ratio: 1.43, color: 'bg-indigo-500', border: 'border-indigo-500', era: '1970s–present', why: 'Maximum immersion & film area.', details: 'Largest physical film format ever.', movies: 'Oppenheimer (2023), Interstellar (2014), Dunkirk (2017), The Dark Knight (2008), Tenet (2020), Sinners (2025)' },
  { id: '137', label: '1.37:1 – Academy', ratio: 1.37, color: 'bg-purple-500', border: 'border-purple-500', era: '1930s–50s', why: 'Standardized for optical sound.', details: 'Nearly square classic Hollywood frame.', movies: 'Casablanca (1942), Citizen Kane (1941), The Wizard of Oz (1939), Singin\' in the Rain (1952)' },
  { id: '133', label: '1.33:1 – 4:3', ratio: 1.33, color: 'bg-pink-500', border: 'border-pink-500', era: '1890s–1950s', why: 'Early film & TV standard.', details: 'Very tall compared to modern cinema.', movies: 'Nosferatu (1922), The Cabinet of Dr. Caligari (1920), Battleship Potemkin (1925)' }
];

export default function AspectRatiosPage() {
  const [activeId, setActiveId] = useState(null);
  const [screenWidth, setScreenWidth] = useState(800);

  // Update screen width on mount and resize
  React.useEffect(() => {
    const updateWidth = () => {
      const vw = Math.min(window.innerWidth - 48, 800);
      setScreenWidth(Math.max(vw * 0.9, 320));
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getBoxDimensions = (ratio) => ({
    width: screenWidth,
    height: screenWidth / ratio
  });

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
            Cinema Aspect Ratios — Theater Accurate
          </h1>
        </header>

        {/* Diagram + Legend */}
        <section className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-5 mb-6 md:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 md:mb-6">
            Theater Screen Comparison
          </h2>

          <div
            className="relative flex items-center justify-center mb-4 md:mb-6 overflow-x-auto"
            style={{ minHeight: `${screenWidth / 1.43 + 40}px` }}
          >
            {/* IMAX 70mm Screen Outline */}
            <div
              className="absolute border-1 border-white/30"
              style={{
                width: screenWidth,
                height: screenWidth / 1.43
              }}
            />

            {[...aspectRatios]
              .sort((a, b) => a.ratio - b.ratio)
              .map((f) => {
                const { width, height } = getBoxDimensions(f.ratio);
                const active = activeId === f.id;

                return (
                  <div
                    key={f.id}
                    className="absolute"
                    style={{ width, height }}
                    onMouseEnter={() => setActiveId(f.id)}
                    onMouseLeave={() => setActiveId(null)}
                  >
                    <div
                      className={`w-full h-full ${f.color} ${f.border} border ${
                        active
                          ? 'bg-opacity-30 border-4'
                          : 'bg-opacity-0 border-1'
                      } rounded transition-all`}
                    />
                  </div>
                );
              })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {aspectRatios.map((f) => (
              <div
                key={f.id}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded cursor-pointer transition ${
                  activeId === f.id
                    ? 'bg-gray-700'
                    : 'bg-gray-800/60 hover:bg-gray-800'
                }`}
                onMouseEnter={() => setActiveId(f.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                <div
                  className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${f.color} ${f.border} border rounded`}
                />
                <span className="text-xs sm:text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* IMAX 70mm Explanation */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-4 sm:p-5 md:p-6 mb-8 md:mb-12 border-2 border-indigo-500">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
            <span className="text-indigo-400">🎬</span>
            Why 1.43:1 IMAX 70mm is the "Largest Format"
          </h2>

          <div className="space-y-3 md:space-y-4 text-gray-300 text-sm sm:text-base">
            <p className="sm:text-lg">
              1.43:1 IMAX 70mm is the largest film format, but not because of
              aspect ratio alone.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
              <div className="bg-black/30 p-3 md:p-4 rounded-lg">
                <p className="font-bold text-indigo-400 mb-2 text-sm sm:text-base">
                  1.43:1 IMAX 70mm
                </p>
                <ul className="space-y-1 text-xs sm:text-sm">
                  <li>• Film: 70mm running <strong>horizontally</strong></li>
                  <li>• Frame: ~70mm × 48.5mm</li>
                  <li>
                    • Area: <strong>~3,395 sq mm per frame</strong>
                  </li>
                  <li>• Resolution: Equivalent to ~18K digital</li>
                  <li>• 15 perforations per frame</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 md:p-4 rounded-lg">
                <p className="font-bold text-purple-400 mb-2 text-sm sm:text-base">
                  1.33:1 / 1.37:1 Academy
                </p>
                <ul className="space-y-1 text-xs sm:text-sm">
                  <li>• Film: 35mm running <strong>vertically</strong></li>
                  <li>• Frame: ~22mm × 16mm</li>
                  <li>
                    • Area: <strong>~352 sq mm per frame</strong>
                  </li>
                  <li>• Resolution: ~4K equivalent</li>
                  <li>• 4 perforations per frame</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-500/20 border-l-4 border-indigo-500 p-3 md:p-4 mt-3 md:mt-4">
              <p className="font-bold text-white mb-2 text-sm sm:text-base">The Key Difference:</p>
              <p className="text-sm sm:text-base">
                While 1.33:1 and 1.37:1 are <em>taller</em> in aspect ratio, IMAX
                70mm has <strong>nearly 10× more physical film area</strong> per
                frame.
              </p>
            </div>

            <p className="text-xs sm:text-sm italic mt-3 md:mt-4">
              Films shot in IMAX 70mm — 
              <a 
                href="https://drive.google.com/file/d/1KQAPzmHe7ejXF9msttZl31HzYnNCEnNV/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline ml-1"
              >
                View the list
              </a>
            </p>
          </div>
        </div>

        {/* Format-by-Format Deep Dive */}
        <section className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 md:mb-8 text-center">
            Format-by-Format Deep Dive
          </h2>

          <div className="space-y-6 md:space-y-8">
            {aspectRatios.map((f) => {
              const { width, height } = getBoxDimensions(f.ratio);

              return (
                <div key={f.id} className="bg-gray-800 rounded-lg p-4 sm:p-5 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                    <div className="flex-shrink-0 w-full md:w-auto">
                      <div
                        className={`border-2 md:border-4 ${f.border} ${f.color} bg-opacity-30 rounded mx-auto`}
                        style={{
                          width: Math.min(width / 3, 300),
                          height: Math.min(height / 3, 200)
                        }}
                      />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{f.label}</h3>
                      <p className="text-sm sm:text-base text-gray-300">
                        <strong>Era:</strong> {f.era}
                      </p>
                      <p className="text-sm sm:text-base text-gray-300">
                        <strong>Why it was used:</strong> {f.why}
                      </p>
                      <p className="text-sm sm:text-base text-gray-300 mt-1">{f.details}</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-2">
                        <strong>Famous titles:</strong> {f.movies}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
         {/* Real-World Examples */}
         <section className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 mt-8 mb-6 md:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 md:mb-8 text-center">
            Cinema References
          </h2>

          

          {/* Other Examples */}
          <div className="grid sm:grid-cols-1 gap-4 md:gap-6">
            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
              <img 
                src="/ratios/oppenheimer-the-imax-comparison.webp" 
                alt="Oppenheimer IMAX comparison"
                className="w-54 mx-auto rounded mb-3"
              />
              <p className="text-center font-semibold text-indigo-400">Oppenheimer (2023)</p>
              <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                1.43:1 IMAX 70mm vs 1.9 digital IMAX vs standard 2.39:1 Scope
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
              <img 
                src="/ratios/Dunkirk_aspect_ratios.jpg" 
                alt="Dunkirk aspect ratios"
                className="w-[700px] mx-auto rounded mb-3"
              />
              <p className="text-center font-semibold text-indigo-400">Dunkirk (2017)</p>
              <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                Different digital and film aspect ratios
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
              <img 
                src="/ratios/avatar2_ratios.png" 
                alt="Avatar 2 aspect ratios"
                className="w-[800px] mx-auto rounded mb-3"
              />
              <p className="text-center font-semibold text-yellow-400">Avatar: The Way of Water (2022)</p>
              <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                1.90:1 IMAX Digital vs standard 2.39:1 scope vs 1.85:1
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
              <img 
                src="/ratios/bvs_ratios.png" 
                alt="Batman v Superman aspect ratios"
                className="w-[800px] mx-auto rounded mb-3"
              />
              <p className="text-center font-semibold text-yellow-400">Batman v Superman: Dawn of justice (2016)</p>
              <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                Different aspect ratio presentation
              </p>
            </div>
            {/* The Shining Comparison */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
              The Shining (1980) — Format Comparison
            </h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
             
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
                <img 
                  src="/ratios/the_shining35mm.jpeg" 
                  alt="The Shining in 1.37:1"
                  className="w-full h-auto rounded mb-3"
                />
                <p className="text-center font-semibold text-purple-400">1.37:1 Academy (35mm)</p>
                <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                  Original 35mm composition — more vertical headroom
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
                <img 
                  src="/ratios/shining1.85.png" 
                  alt="The Shining in 1.85:1"
                  className="w-full h-auto rounded mb-3"
                />
                <p className="text-center font-semibold text-green-400">1.85:1 Theatrical Flat</p>
                <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                  Standard theatrical presentation
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
              <img 
                src="/ratios/oban.jpeg" 
                alt="One Battle After Another"
                className="w-[700px] mx-auto rounded mb-3"
              />
              <p className="text-center font-semibold text-yellow-400">One Battle After Another (2025)</p>
              <p className="text-xs sm:text-sm text-gray-400 text-center mt-1">
                Different aspect ratio presentation
              </p>
              <p className='mt-2'><b>Note</b>: Both 1.50:1 and 1.43:1 aspect ratios have the same height but 1.50 is slightly wider, balanced between IMAX height and theatrical width. 
                1.43 IMAX feels taller and more overwhelming — it fills your vertical field of view. Whereas 1.50 giving a more balanced panoramic look.</p>
            </div>

          </div>
        </section>
    </div>
  );
}