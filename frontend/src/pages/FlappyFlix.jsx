import React, { useEffect, useRef, useState } from "react";
import { userAuthStore } from "../store/authUser";
import axios from "axios";
import { Volume2,VolumeOff } from "lucide-react";

 const FlappyFlix = () => {
  const { user } = userAuthStore();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const audioRef = useRef(null); // Add audio ref
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("flappyflix_best")) || 0);
  const bestRef = useRef(Number(localStorage.getItem("flappyflix_best")) || 0);
  const [ready, setReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [session, setSession] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameOverRef = useRef(false);
  const [serverBest, setServerBest] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // Add music state

  const birdImageSrc = user?.picture || user?.image || "/avatar1.png";
  const birdImgRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio("/Carefree.mp3");
    audio.loop = true;
    audio.volume = 0.5; // Set volume to 50%
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = birdImageSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      birdImgRef.current = img;
      setReady(true);
    };
  }, [birdImageSrc]);

  // fetch server best on mount
  useEffect(() => {
    const load = async () => {
      try {
        const r = user?.flappy?.score || 0;
        const sb = Number(r) || 0;
        setServerBest(sb);
        bestRef.current = sb;
        setBest(sb);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let animationId = 0;
    let gameOver = false;
    let width = (containerRef.current?.clientWidth) || canvas.clientWidth;
    let height = (containerRef.current?.clientHeight) || canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const gravity = 0.5;
    const flapStrength = -8.5;
    const pipeGap = 150;
    const pipeWidth = 70;
    const pipeSpeed = 2.5;
    const pipeInterval = 1600; // ms
    const cloudSpeed = 0.4;

    const oceanH = Math.max(60, Math.floor(height * 0.18));

    const bird = {
      x: Math.floor(width * 0.2),
      y: Math.floor(height * 0.4),
      vy: 0,
      w: 36,
      h: 36,
      radius: 16,
    };

    let lastPipeTime = performance.now();
    let pipes = [];
    let clouds = [
      { x: width * 0.1, y: 50, r: 22 },
      { x: width * 0.45, y: 80, r: 28 },
      { x: width * 0.8, y: 40, r: 20 },
    ];
    let passedPipeIds = new Set();
    let pipeIdCounter = 0;

    

    const onPointer = () => {
      if (!runningRef.current) {
        // ignore clicks; only the button starts/restarts
        return;
      }
      bird.vy = flapStrength;
    };

    const onResize = () => {
      width = (containerRef.current?.clientWidth) || canvas.clientWidth;
      height = (containerRef.current?.clientHeight) || canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    canvas.addEventListener("pointerdown", onPointer);
    const keydownHandler = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (runningRef.current) {
          onPointer();
        }
      } else if (e.code === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };
    window.addEventListener("keydown", keydownHandler);
    const resizeObs = new ResizeObserver(onResize);
    if (containerRef.current) resizeObs.observe(containerRef.current);

    const spawnPipe = () => {
      const minTop = 40;
      const maxTop = height - oceanH - pipeGap - 40;
      const topHeight = Math.max(minTop, Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop);
      const id = pipeIdCounter++;
      pipes.push({ id, x: width + 10, top: topHeight, gap: pipeGap });
    };

    const drawBackground = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#87ceeb");
      grad.addColorStop(1, "#bde0fe");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      clouds.forEach((c) => {
        c.x -= cloudSpeed;
        if (c.x < -80) c.x = width + Math.random() * 120;
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        drawCloud(ctx, c.x, c.y, c.r);
      });

      const oceanGrad = ctx.createLinearGradient(0, height - oceanH, 0, height);
      oceanGrad.addColorStop(0, "#2e8dd4");
      oceanGrad.addColorStop(1, "#1565c0");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, height - oceanH, width, oceanH);
    };

    const drawCloud = (ctx2, x, y, r) => {
      ctx2.beginPath();
      ctx2.arc(x, y, r, 0, Math.PI * 2);
      ctx2.arc(x + r, y + 10, r * 0.9, 0, Math.PI * 2);
      ctx2.arc(x - r, y + 10, r * 0.9, 0, Math.PI * 2);
      ctx2.arc(x + r * 0.5, y - 8, r * 0.8, 0, Math.PI * 2);
      ctx2.closePath();
      ctx2.fill();
    };

    const drawPipes = () => {
      ctx.fillStyle = "#2ecc71"; // green pipes
      ctx.strokeStyle = "#27ae60";
      ctx.lineWidth = 3;
      pipes.forEach((p) => {
        p.x -= pipeSpeed;
        const topH = p.top;
        const bottomY = p.top + p.gap;
        // top pipe
        ctx.fillRect(p.x, 0, pipeWidth, topH);
        ctx.strokeRect(p.x, 0, pipeWidth, topH);
        // bottom pipe
        ctx.fillRect(p.x, bottomY, pipeWidth, height - oceanH - bottomY);
        ctx.strokeRect(p.x, bottomY, pipeWidth, height - oceanH - bottomY);

        // scoring: when bird has fully passed pipe center once
        const pipeCenter = p.x + pipeWidth / 2;
        if (!passedPipeIds.has(p.id) && pipeCenter < bird.x) {
          passedPipeIds.add(p.id);
          const newScore = scoreRef.current + 1;
          scoreRef.current = newScore;
          setScore(newScore);
          if (newScore > bestRef.current) {
            bestRef.current = newScore;
            setBest(newScore);
            // fire-and-forget; don't block render loop
            axios.post('/api/v1/user/flappy/score', { score: newScore }).catch(() => {});
          }
        }
      });

      // remove offscreen
      pipes = pipes.filter((p) => p.x + pipeWidth > -10);
    };

    const drawBird = () => {
      bird.vy += gravity;
      bird.y += bird.vy;

      const img = birdImgRef.current;
      if (img) {
        ctx.save();
        const angle = Math.max(-0.5, Math.min(0.6, bird.vy / 10));
        ctx.translate(bird.x, bird.y);
        ctx.rotate(angle);
        ctx.drawImage(img, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
        ctx.restore();
      } else {
        ctx.fillStyle = "#ffd166";
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const checkCollision = () => {
      // floor and sky
      if (bird.y + bird.radius > height - oceanH || bird.y - bird.radius < 0) {
        return true;
      }
      // pipes
      for (let i = 0; i < pipes.length; i++) {
        const p = pipes[i];
        const inX = bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + pipeWidth;
        if (!inX) continue;
        const topH = p.top;
        const bottomY = p.top + p.gap;
        const hitTop = bird.y - bird.radius < topH;
        const hitBottom = bird.y + bird.radius > bottomY;
        if (hitTop || hitBottom) return true;
      }
      return false;
    };

    const drawHUD = () => {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(12, 12, 115, 58);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Inter, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText("Flappy Flix", 20, 34);
      ctx.font = "bold 14px Inter, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 54);
      const bestTxt = `Best: ${bestRef.current}`;
      const tw = ctx.measureText(bestTxt).width;
      ctx.fillText(bestTxt, 12 + 115 - tw - 6, 54);
    };

    const loop = (now) => {
      ctx.clearRect(0, 0, width, height);
      drawBackground();

      if (runningRef.current) {
        if (now - lastPipeTime > pipeInterval) {
          spawnPipe();
          lastPipeTime = now;
        }
        drawPipes();
        drawBird();
        if (checkCollision()) {
          gameOver = true;
        }
        drawHUD();
        if (gameOver) {
          runningRef.current = false;
          setIsRunning(false);
          gameOverRef.current = true;
          setIsGameOver(true);
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 28px Inter, system-ui, -apple-system, Segoe UI, Roboto";
          ctx.textAlign = "center";
          ctx.fillText("Game Over", width / 2, height / 2 - 20);
          ctx.font = "16px Inter, system-ui, -apple-system, Segoe UI, Roboto";
      
        }
      } else {
        // idle screen with title
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(width/2 - 160, height/2 - 70, 320, 140);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold 28px Inter, system-ui, -apple-system, Segoe UI, Roboto";
        
        ctx.font = "16px Inter, system-ui, -apple-system, Segoe UI, Roboto";
        
        ctx.textAlign = "start";
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    requestRef.current = animationId;

    return () => {
      cancelAnimationFrame(animationId);
      resizeObs.disconnect();
      canvas.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [ready, session]);

  // keep refs in sync with state
  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  // fullscreen handlers
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      // ignore
    }
  };
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Music toggle handler
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (e) {
      console.log("Error playing audio:", e);
    }
  };

  const handleStart = () => {
    scoreRef.current = 0;
    setScore(0);
    runningRef.current = true;
    setIsRunning(true);
    setSession((s) => s + 1);
    gameOverRef.current = false;
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 pt-6">
        <h1 className="text-2xl font-bold mb-3 flex "><p className="text-blue-500">FLAPPY</p>Flix</h1>
        <div className="text-sm text-gray-300 mb-4">Tap/click or press Space to flap. Pass green pipes to score.</div>
      </div>
      <div className="w-full max-w-4xl px-4">
        <div ref={containerRef} className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <canvas ref={canvasRef} className="w-full h-full rounded-lg shadow-lg bg-sky-300" style={{ touchAction: "manipulation" }} />
          {!isRunning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              {isGameOver ? (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">Game Over</div>
                  <p>Your Score: {score}</p>
                </div>
                
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">Flappy Flix</div>
                </div>
              )}
              <button
                onClick={handleStart}
                className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
              >
                {session === 0 ? "Start Game" : "Restart"}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-200">
          <div>
            <span className="font-semibold">Score:</span> {score}
          </div>
          <div>
            <span className="font-semibold">Best:</span> {best}
          </div>
          <Leaderboard />
          <button 
            onClick={toggleMusic} 
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded"
          >
            {isMusicPlaying ? <Volume2 size={20}/> : <VolumeOff size={20}/>}
          </button>
          <button onClick={toggleFullscreen} className="ml-auto bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded">
            {isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const toggle = async () => {
    if (!open) {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/auth/admin/users');
        const list = Array.isArray(response?.data?.users) ? response.data.users : response.data;
        const withScores = (list || [])
          .map(u => ({
            id: u._id,
            name: u.username || u.email || 'User',
            pic: u.picture || u.image || '',
            score: (u.flappy && typeof u.flappy.score === 'number') ? u.flappy.score : 0,
          }))
          .filter(u => u.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 50);
        setRows(withScores);
      } catch (e) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    setOpen(v => !v);
  };

  return (
    <>
      <button onClick={toggle} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded">
        {open ? 'Close Leaderboard' : 'Leaderboard'}
      </button>
      {open && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-zinc-900 text-white w-full max-w-2xl rounded-lg p-4 shadow-xl max-h-[90vh] overflow-y-auto">    
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Flappy Flix Leaderboard</h2>
              <button onClick={toggle} className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded">Close</button>
            </div>
            {loading ? (
              <div className="py-10 text-center text-gray-300">Loading...</div>
            ) : rows.length === 0 ? (
              <div className="py-10 text-center text-gray-300">No scores yet.</div>
            ) : (
              <ul className="divide-y divide-zinc-800 max-h-[60vh] overflow-auto">
                {rows.map((u, idx) => (
                  <li key={u.id} className="flex items-center gap-3 py-2">
                    <div className="w-8 text-gray-400">{idx + 1}</div>
                    <img src={u.pic || '/avatar1.png'} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{u.name}</div>
                    </div>
                    <div className="text-sm font-semibold">{u.score}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FlappyFlix;