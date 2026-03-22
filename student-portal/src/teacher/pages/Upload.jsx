import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Upload() {

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [classes, setClasses] = useState([])
  const [streams, setStreams] = useState([])
  const [subjects, setSubjects] = useState([])

  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStream, setSelectedStream] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")

  const [title, setTitle] = useState("")
  const [materialType, setMaterialType] = useState("notes")
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [message, setMessage] = useState("")

  // load class structure
  useEffect(() => {
    fetch("https://student-portal-mlp.onrender.com/api/class/1/")
      .then(res => res.json())
      .then(data => {
        setClasses([data])
        setStreams(data.streams || [])
      })
  }, [])

  // update subjects when stream changes
  useEffect(() => {
    const stream = streams.find(s => s.id == selectedStream)
    setSubjects(stream ? stream.subjects : [])
  }, [selectedStream])


  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("material_type", materialType)
    formData.append("school_class", selectedClass)
    formData.append("stream", selectedStream)
    formData.append("subject", selectedSubject)

    if (materialType === "video") {
      formData.append("video_url", videoUrl)
    } else {
      formData.append("file", file)
    }

    const res = await fetch(
      "https://student-portal-mlp.onrender.com/api/materials/upload/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      }
    )

    if (res.ok) {
      setMessage("Material uploaded successfully")
      setTitle("")
      setVideoUrl("")
      setFile(null)
    } else {
      setMessage("Upload failed")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-white">

      {/* header */}
      <div className="flex justify-between items-center px-12 py-6 border-b border-white/10">

        <div>
          <h1 className="text-2xl font-semibold">
            Upload Study Material
          </h1>
          <p className="text-sm text-white/60">
            Add notes, sample papers, PYQs or videos for students
          </p>
        </div>

        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm transition"
        >
          Dashboard
        </button>

      </div>


      {/* content */}
      <div className="flex justify-center px-6 py-12">

        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10">

          {/* left info panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h2 className="text-lg font-semibold mb-4">
              Upload Guidelines
            </h2>

            <ul className="space-y-3 text-sm text-white/70">
              <li>• Upload notes in PDF format</li>
              <li>• Sample papers should be clear and readable</li>
              <li>• PYQs should include year details</li>
              <li>• Videos must use valid YouTube links</li>
              <li>• Select correct class, stream and subject</li>
            </ul>

          </div>


          {/* upload form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
          >

            <input
              className="w-full p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-indigo-500 outline-none"
              placeholder="Material Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <select
              className="w-full p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-indigo-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option className="bg-black">Select Class</option>
              {classes.map(cls => (
                <option className="bg-black" key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              className="w-full p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-indigo-500"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              required
            >
              <option className="bg-black">Select Stream</option>
              {streams.map(stream => (
                <option className="bg-black" key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>

            <select
              className="w-full p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-indigo-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option className="bg-black">Select Subject</option>
              {subjects.map(sub => (
                <option className="bg-black" key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <select
              className="w-full p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-indigo-500"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
            >
              <option className="bg-black" value="notes">📘 Notes</option>
              <option className="bg-black" value="sample">📄 Sample Paper</option>
              <option className="bg-black" value="pyq">📝 Previous Year Paper</option>
              <option className="bg-black" value="video">🎥 Video Lecture</option>
            </select>

            {materialType === "video" ? (
              <input
                className="w-full p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-indigo-500"
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            ) : (
              <input
                type="file"
                className="w-full p-3 rounded-lg bg-[#020617] border border-white/10"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition"
            >
              Upload Material
            </button>

            {message && (
              <p className="text-center text-sm text-green-400">
                {message}
              </p>
            )}

          </form>

        </div>

      </div>

    </div>
  )
}