import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function Video() {
  const navigate = useNavigate();
  const location = useLocation();

  // ids from url → /watch/:subjectId/:lectureId
  const { subjectId, lectureId } = useParams();

  // data passed from dashboard
  const lectureTitle =
    location.state?.lectureTitle || "Lecture";

  // raw url from dashboard
  let rawUrl =
    location.state?.videoUrl ||
    "https://www.youtube.com/watch?v=2GfKZlTRNjA";

  // function to convert youtube url → embed
  function getEmbedUrl(url) {
    try {
      if (!url) return "";

      // watch?v=
      if (url.includes("watch?v=")) {
        return url.replace("watch?v=", "embed/");
      }

      // youtu.be/
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1];
        return `https://www.youtube.com/embed/${id}`;
      }

      // shorts/
      if (url.includes("shorts/")) {
        const id = url.split("shorts/")[1];
        return `https://www.youtube.com/embed/${id}`;
      }

      // already embed
      if (url.includes("embed/")) {
        return url;
      }

      return url;
    } catch {
      return url;
    }
  }

  const videoUrl = getEmbedUrl(rawUrl);

  // convert watch url → embed url
  if (videoUrl.includes("watch?v=")) {
    videoUrl = videoUrl.replace(
      "watch?v=",
      "embed/"
    );
  }

  // local lecture state
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);


  // set lecture data (temporary, later will fetch from API)
  useEffect(() => {
    setLecture({
      id: lectureId,
      title: lectureTitle,
      video_url: videoUrl,
    });

    setLoading(false);
  }, [lectureId, lectureTitle, videoUrl]);


  // loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading lecture...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">

      {/* top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">

        {/* back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          ← Back to Chapters
        </button>

        {/* context info */}
        <div className="text-sm text-white/60">
          Class • Subject • Lecture
        </div>

      </header>


      {/* main */}
      <main className="flex-1 flex flex-col items-center px-6 py-8">

        {/* title */}
        <h1 className="text-2xl font-semibold mb-6 text-center max-w-3xl">
          {lecture.title}
        </h1>


        {/* video */}
        <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-xl">

          <iframe
            src={lecture.video_url}
            title={lecture.title}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />

        </div>


        {/* helper text */}
        <div className="mt-8 max-w-3xl text-center">

          <p className="text-sm text-white/70">
            💡 Study Tip: pause the video, write notes, and replay difficult parts.
          </p>

        </div>

      </main>

    </div>
  );
}