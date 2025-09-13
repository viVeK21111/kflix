import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { chatStore } from "../store/chat";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import {
  ArrowUp,
  History,
  Loader,
  ChevronDown,
  Mic,
} from "lucide-react";
import { userAuthStore } from "../store/authUser";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Listbox } from "@headlessui/react";

export default function ChatPage() {
  const { user } = userAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const queryres = queryParams.get("query");

  const [query, setQuery] = useState(queryres || "");
  const [Loading, setLoading] = useState(false);
  const [pLoading, setpLoading] = useState(true);

  const [Data, setData] = useState(null);
  const [DataText, setDataText] = useState(null);
  const [ContentType, setContentType] = useState(null);

  let { getdata, data, datatext, contentType } = chatStore();

  const [query1, setQuery1] = useState(sessionStorage.getItem("query1") || null);
  const [submitloading, setsubmitloading] = useState(null);
  const [conversationHistory, setConversationHistory] = useState(
    JSON.parse(sessionStorage.getItem("conversationHistory")) || []
  );

  const [formEnd, setFormEnd] = useState(false);

  // Scroll refs
  const chatContainerRef = useRef(null);
  const latestQueryRef = useRef(null); // ref for new query
  const bottomRef = useRef(null);

  // Speech
  let { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript && transcript !== "") {
      if (!listening) setQuery((prev) => prev + " " + transcript);
    }
  }, [transcript, listening]);

  // keep local copies of store data
  useEffect(() => {
    if (data) setData(data);
    if (datatext) setDataText(datatext);
    if (contentType) setContentType(contentType);
  }, [data, datatext, contentType]);

  // Scroll helper
  const scrollToElement = (el) => {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // On new query → scroll that query to TOP
  useEffect(() => {
    if (query1 && latestQueryRef.current) {
      scrollToElement(latestQueryRef.current);
    }
  }, [query1]);

  // Initial page load
  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = "/batman.jpg";
    logoImage.onload = () => setpLoading(false);
    logoImage.onerror = () => setpLoading(false);
    const timeout = setTimeout(() => setpLoading(false), 3000);

    // After mount, if history exists scroll to bottom
    if (conversationHistory.length > 0) {
      setTimeout(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "auto" });
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, []);

  const [isShortScreen, setIsShortScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsShortScreen(window.innerHeight < 700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update conversation history when new data arrives
  useEffect(() => {
    if (query1 && (Data || DataText) && !Loading) {
      const newEntry = { query: query1, data: Data, datatext: DataText, contentType: ContentType };
      const isDuplicate = conversationHistory.some(
        (item) => item.datatext === DataText
      );
      if (!isDuplicate) {
        const updated = [...conversationHistory, newEntry];
        setConversationHistory(updated);
        sessionStorage.setItem("conversationHistory", JSON.stringify(updated));
      }
    }
  }, [Data, DataText, Loading, query1, ContentType]);

  const onSubmit = async (e) => {
    sessionStorage.setItem("ModelType", selectedModel.value);
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("query")) {
      searchParams.delete("query");
      navigate({ pathname: "/chat", search: searchParams.toString() }, { replace: true });
    }

    setFormEnd(true);
    e.preventDefault();
    if (!query.trim()) return;

    setQuery1(query); // triggers scroll to top
    setsubmitloading(true);
    sessionStorage.setItem("query1", query);
    setData(null);
    setDataText(null);
    setLoading(true);

    const currentQuery = query;
    setQuery("");
    resetTranscript();

    try {
      if (conversationHistory.length > 0) {
        await getdata({
          query: currentQuery,
          history: conversationHistory.slice(-6),
          aimodel: selectedModel.value,
        });
      } else {
        await getdata({ query: currentQuery, aimodel: selectedModel.value });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setsubmitloading(false);
    }
  };

  const models = [
    { name: "Gemini 2.0 Flash", value: "Gemini" },
    { name: "llama-3.1" , value:"llama-3.1"},
    { name: "deepseek-r1", value: "deepseek-r1" },
    { name: "openai/gpt-oss", value: "openai/gpt-oss" },
    { name: "groq/compound", value: "groq/compound" },
  ];

  const defaultModelValue = sessionStorage.getItem("ModelType") || "deepseek-r1";
  const [selectedModel, setSelectedModel] = useState(
    models.find((model) => model.value === defaultModelValue) || models[0]
  );

  if (pLoading) {
    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center bg-black">
        <Loader className="animate-spin text-red-600 w-10 h-10" />
        <p className="text-red-500  text-xl font-bold">I am Batman...!</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#1e1d1d" }} className="min-h-screen sm:h-screen w-full flex flex-col">
      <header className="flex justify-center xl:justify-start p-3 border-b border-gray-700 md:border-gray-800">
        <div className=" mr-auto  items-center rounded-lg  bg-white bg-opacity-0 hover:cursor-pointer hover:bg-opacity-5">
          <Listbox value={selectedModel} onChange={setSelectedModel}>
            <Listbox.Button className="w-48 flex justify-center items-center rounded-lg text-gray-300 px-4 py-3 text-left font-semibold">
              {selectedModel.name}
              <ChevronDown color="white " className="ml-1" size={22}></ChevronDown>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 font-semibold bg-[#1e1d1d] rounded-lg shadow-lg overflow-y-auto z-10">
              {models.map((model, idx) => (
                <Listbox.Option
                  key={idx}
                  value={model}
                  className={({ active }) =>
                    `cursor-pointer p-3 text-base border-b border-gray-700 px-8  ${
                      active ? "bg-white bg-opacity-20 text-white" : "text-white bg-white bg-opacity-10"
                    }`
                  }
                >
                  {model.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>

        <div className=" hidden md:flex items-center mr-40">
          <div className="flex items-center">
            <h1 className="text-3xl ml-2 font-bold text-gray-600">Flix Chat</h1>
          </div>
        </div>

        <div className="ml-auto flex items-center">
          <Link
            className="ml-auto flex bg-white bg-opacity-10 py-2  px-2 items-center  rounded-lg text-gray-400 hover:scale-105 transition-transform"
            to={"/profile/chatHistory"}
          >
            <History size={22} />
          </Link>
        </div>
      </header>

      {/* Chat content area */}
      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 sm:overflow-y-auto px-4 sm:px-6 md:px-10 lg:px-32 xl:px-56 2xl:px-60"
        style={{ scrollbarColor: "rgb(53, 52, 52) #1e1d1d" }}
      >
        {conversationHistory.map((item, index) => (
          <div key={index} className="mb-4">
            <p
              className="flex text-white font-semibold justify-end rounded-t-lg p-2 mt-5 mr-2 mb-5"
              ref={index === conversationHistory.length - 1 ? latestQueryRef : null}
            >
              <span className="bg-white bg-opacity-10 px-3 py-2 rounded-xl">{item.query}</span>
            </p>

            {item.datatext && (
              <div className="flex mx-auto p-4 pt-2 text-left items-center">
                <div className="text-white whitespace-pre-wrap max-w-5xl">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.datatext
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/^\s*\*\s*(.*)$/gm, "• $1<br/>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              </div>
            )}

            {item.data && item.contentType && (
              <div className="p-3 rounded-b-lg w-full">
                <h2 className="font-semibold mb-3 text-white text-lg border-b pb-2">
                  {item.contentType === "tv" ? "TV Shows" : "Movies"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-3">
                  {item.data.map((content, idx) =>
                    (content?.backdrop_path || content?.poster_path) ? (
                      <Link
                        key={`${content.id}-${idx}`}
                        to={`/${item.contentType === "movies" ? "movie" : "tv/details"}/?id=${content?.id}&name=${content?.name || content?.title}`}
                        onClick={() => window.scroll(0, 0)}
                      >
                        <div className="rounded-lg bg-[#28292a] shadow-md hover:scale-105 transition-transform">
                          <img
                            src={`${ORIGINAL_IMG_BASE_URL}${content?.backdrop_path || content?.poster_path}`}
                            className="w-full h-40 object-cover rounded-t-lg"
                            alt={content?.title || content?.name}
                          />
                          <h3 className="text-base text-white p-2">
                            {content.title || content.name}
                          </h3>
                          <p className="text-sm text-gray-400 pb-2 pl-2">
                            {content?.release_date?.split("-")[0] ||
                              content?.first_air_date?.split("-")[0]}{" "}
                            | Rating: <b>{content?.vote_average.toFixed(1)}</b> |{" "}
                            {content?.adult ? "18+" : "PG-13"}
                          </p>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New query bubble while submitting */}
        {query1 && submitloading && (
          <p
            className="flex text-white font-semibold justify-end rounded-t-lg p-2 mt-5 mr-2"
            ref={latestQueryRef}
          >
            <span className="bg-white bg-opacity-10 px-3 py-2 rounded-xl">{query1}</span>
          </p>
        )}

        {/* Loader below the latest query */}
        {Loading && (
          <div className="flex w-full justify-center mt-4 mb-48">
            <div className="flex items-center space-x-2 bg-white bg-opacity-10 rounded-lg p-3">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <div
        className={
          (formEnd || DataText || conversationHistory.length > 0)
            ? ` pt-2 bg-[#1e1d1d] sticky bottom-16 sm:bottom-0`
            : `pb-3 pt-2 bg-[#1e1d1d] sticky ${
                isShortScreen ? "sticky bottom-16 sm:bottom-0 md:bottom-52" : "sticky bottom-16 sm:bottom-0 md:bottom-80"
              } pb-12 sm:pb-3`
        }
      >
        <div className="max-w-2xl p-1 mx-auto ">
          {(!formEnd && !DataText && conversationHistory.length === 0) && (
            <div>
              <div className="flex justify-center md:hidden items-center mb-2">
                <div className="flex items-center">
                  <h1 className="text-xl ml-2 font-bold text-gray-600">Flix Chat</h1>
                </div>
              </div>
              <p className="text-white flex justify-center pb-4 text-lg sm:text-xl mb-60 md:mb-0 font-semibold">
                What's on your mind?
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} className="w-full">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                className="w-full p-3 pr-10 text-white bg-white bg-opacity-5 rounded-lg outline-none focus:ring-0 focus:bg-black"
                placeholder={listening ? "Listening..." : "Ask me anything...!"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={Loading}
              />

              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  className={`absolute right-10 m-5 ${listening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-gray-300"}`}
                  onClick={SpeechRecognition.startListening}
                >
                  <Mic />
                </button>
              )}

              <button
                type="submit"
                className={`ml-2 bg-white p-2 text-black rounded-full ${Loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-transform"}`}
                disabled={Loading}
              >
                <ArrowUp />
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="text-white mx-auto text-xs pb-1 hidden sm:block">
        AI can make mistakes and may not be up-to-date.
      </p>
    </div>
  );
}
