import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [selectedStreamId, setSelectedStreamId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState("video");

  const [classId, setClassId] = useState(1)


  /* ------------------------------------------------------------------
     🔹 LOGOUT HANDLER
  ------------------------------------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ------------------------------------------------------------------
     ✅ FETCH DATA FROM BACKEND
  ------------------------------------------------------------------- */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/class/${classId}/`)
      .then((res) => res.json())
      .then((data) => {
        setClassData(data);

        const firstStream = data.streams?.[0];
        if (firstStream) {
          setSelectedStreamId(firstStream.id);

          const firstSubject = firstStream.subjects?.[0];
          if (firstSubject) {
            setSelectedSubjectId(firstSubject.id);
          }
        }
      })
      .catch((err) => {
        console.error("Backend not reachable", err);
      });
  }, [classId]);

  useEffect(() => {
  if (!selectedStreamId || !selectedSubjectId) return;

  const token = localStorage.getItem("token");

// load materials for selected class / stream / subject
  fetch(
    `http://127.0.0.1:8000/api/materials/?class=${classId}&stream=${selectedStreamId}&subject=${selectedSubjectId}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      setMaterials(data);
    })
    .catch((err) => console.error("Error fetching materials", err));
//     console.log("Stream:", selectedStreamId);
// console.log("Subject:", selectedSubjectId);

}, [classId, selectedStreamId, selectedSubjectId]);


  const selectedStream = classData?.streams.find(
    (stream) => stream.id === selectedStreamId
  );

  const selectedSubject = selectedStream?.subjects.find(
    (subject) => subject.id === selectedSubjectId
  );

  /* ------------------------------------------------------------------
   🔹 GROUP MATERIALS BY TYPE
   This helps us render tabs cleanly
------------------------------------------------------------------- */
const notes = materials.filter((m) => m.material_type === "notes");
const samples = materials.filter((m) => m.material_type === "sample");
const pyqs = materials.filter((m) => m.material_type === "pyq");


  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* ================= TOP NAVBAR ================= */}
      <header className="h-14 border-b border-white/10 px-6 flex items-center justify-between sticky top-0 bg-[#0f172a] z-50">
        {/* Left */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">
            Student Portal
          </h1>
          <span className="text-sm text-white/50">
            Class {classId === 1 ? "12" : "11"}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-sm">

          {/* Notifications (placeholder) */}
          <button
            title="Notifications"
            className="relative text-white/70 hover:text-white transition"
          >
            🔔
            {/* future badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full hidden"></span>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-3 py-1 rounded-md
                       bg-white/5 hover:bg-white/10 transition"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-indigo-600/30
                            flex items-center justify-center text-sm text-indigo-300">
              L 
            </div>
            <span className="text-white/80">Profile</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Logout
          </button>
        </div>
      </header>


      {/* ================= MAIN LAYOUT ================= */}
      <div className="flex flex-1">
        {/* ================= LEFT PANEL ================= */}
        <aside className="w-72 border-r border-white/10 p-6 sticky top-14 h-[calc(100vh-56px)]">
          {/* ---- Class Info ---- */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Class {classId === 1 ? "12" : "11"}</h2>
            <p className="text-sm text-white/60">NCERT Curriculum</p>
          </div>

          {/* class selector (11 / 12) */}
          <div className="mb-6">

            <h2 className="text-sm text-white/70 mb-2">
              Class
            </h2>

            <select
              value={classId}
              onChange={(e) => setClassId(Number(e.target.value))}
              className="w-full p-2 bg-[#020617] border border-white/10 rounded"
            >
              <option value={1}>Class 12</option>
              <option value={2}>Class 11</option>
            </select>

          </div>

          {/* ---- Streams ---- */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-white/70">
              Stream
            </h3>

            <div className="flex flex-col gap-2">
              {classData?.streams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => {
                    setSelectedStreamId(stream.id);
                    const firstSubject = stream.subjects?.[0];
                    setSelectedSubjectId(firstSubject?.id || null);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-sm transition
                    ${
                      selectedStreamId === stream.id
                        ? "bg-indigo-600"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                >
                  {stream.name}
                </button>
              ))}
            </div>
          </div>

          {/* ---- Subjects ---- */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-white/70">
              Subjects
            </h3>

            <div className="flex flex-col gap-2">
              {selectedStream?.subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition
                    ${
                      selectedSubjectId === subject.id
                        ? "bg-white/15"
                        : "hover:bg-white/10"
                    }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= RIGHT CONTENT ================= */}
        <main className="flex-1 p-8 overflow-y-auto">
                    
          {/* ---------------------------------------------------------
             🔹 Subject Heading
          ---------------------------------------------------------- */}
          <h2 className="text-xl font-semibold mb-6">
            {selectedSubject?.name || "Select a subject"}
          </h2>
          
          {/* ---------------------------------------------------------
             🔹 Tabs Section
             Controls which content type is visible
          ---------------------------------------------------------- */}
          <div className="flex gap-4 mb-6 border-b border-white/10 pb-3">
            {["video", "notes", "sample", "pyq"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm rounded-md transition
                  ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
              >
                {tab === "video" && "Video Lectures"}
                {tab === "notes" && "Notes"}
                {tab === "sample" && "Sample Papers"}
                {tab === "pyq" && "Previous Year Papers"}
              </button>
            ))}
          </div>
          
          {/* ---------------------------------------------------------
             🔹 TAB CONTENT AREA
          ---------------------------------------------------------- */}
          <div className="space-y-4">
          
            {/* ================= VIDEO TAB ================= */}
            {activeTab === "video" &&
              (selectedSubject && selectedSubject.lectures.length > 0 ? (
                selectedSubject.lectures.map((lecture, index) => (
                  <div
                    key={lecture.id}
                    className="flex justify-between items-center
                               bg-white/5 p-4 rounded-lg
                               hover:bg-white/10 transition"
                  >
                    <div>
                      <p className="text-sm text-white/60">
                        Chapter {index + 1}
                      </p>
                      <p className="font-medium">{lecture.title}</p>
                    </div>
                
                    <button
                      onClick={() =>
                        navigate(
                          `/watch/${selectedSubject.id}/${lecture.id}`,
                          {
                            state: {
                              lectureTitle: lecture.title,
                              subjectName: selectedSubject.name,
                              videoUrl: lecture.video_url, // pass url
                            },
                          }
                        )
                      }
                      className="px-4 py-2 text-sm rounded-md
                                 bg-indigo-600 hover:bg-indigo-500"
                    >
                      Watch
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 p-6 rounded-lg text-sm text-white/60">
                  Video lectures will be added soon.
                </div>
              ))}
        
            {/* ================= NOTES TAB ================= */}
            {activeTab === "notes" &&
              (notes.length > 0 ? (
                notes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                  >
                    <p className="font-medium">{item.title}</p>
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 p-6 rounded-lg text-sm text-white/60">
                  Notes not uploaded yet.
                </div>
              ))}
        
            {/* ================= SAMPLE PAPERS TAB ================= */}
            {activeTab === "sample" &&
              (samples.length > 0 ? (
                samples.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                  >
                    <p className="font-medium">{item.title}</p>
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 p-6 rounded-lg text-sm text-white/60">
                  Sample papers not uploaded yet.
                </div>
              ))}
        
            {/* ================= PYQ TAB ================= */}
            {activeTab === "pyq" &&
              (pyqs.length > 0 ? (
                pyqs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                  >
                    <p className="font-medium">{item.title}</p>
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 p-6 rounded-lg text-sm text-white/60">
                  Previous year papers not uploaded yet.
                </div>
              ))}
        
          </div>
        </main>

      </div>
    </div>
  );
}
