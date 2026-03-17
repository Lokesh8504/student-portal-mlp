import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AddLecture() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [classes, setClasses] = useState([])
  const [streams, setStreams] = useState([])
  const [subjects, setSubjects] = useState([])

  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStream, setSelectedStream] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")

  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  const [message, setMessage] = useState("")

  // load class structure
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/class/1/")
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

    const body = {
      title: title,
      video_url: videoUrl,
      subject: Number(selectedSubject),
    }

    const res = await fetch(
      "http://127.0.0.1:8000/api/lecture/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      }
    )

    if (res.ok) {
      setMessage("Lecture added")
      setTitle("")
      setVideoUrl("")
    } else {
      setMessage("Error adding lecture")
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">

      {/* top bar */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-white/10">

        <h1 className="text-2xl font-semibold">
          Add Chapter / Lecture
        </h1>

        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm"
        >
          Back to Dashboard
        </button>

      </div>


      {/* form container */}
      <div className="flex justify-center mt-10">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-xl p-8 space-y-5"
        >

          {/* title */}
          <input
            placeholder="Chapter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-[#020617] border border-white/10 rounded"
            required
          />


          {/* class */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-3 bg-[#020617] border border-white/10 rounded text-white"
            required
          >
            <option value="" className="bg-[#020617] text-white">
              Select Class
            </option>

            {classes.map(c => (
              <option
                key={c.id}
                value={c.id}
                className="bg-[#020617] text-white"
              >
                {c.name}
              </option>
            ))}

          </select>


          {/* stream */}
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="w-full p-3 bg-[#020617] border border-white/10 rounded text-white"
          >
            <option value="" className="bg-[#020617] text-white">
              Select Stream
            </option>

            {streams.map(s => (
              <option
                key={s.id}
                value={s.id}
                className="bg-[#020617] text-white"
              >
                {s.name}
              </option>
            ))}
          </select>


          {/* subject */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-3 bg-[#020617] border border-white/10 rounded text-white"
          >
            <option value="" className="bg-[#020617] text-white">
              Select Subject
            </option>

            {subjects.map(s => (
              <option
                key={s.id}
                value={s.id}
                className="bg-[#020617] text-white"
              >
                {s.name}
              </option>
            ))}
          </select>


          {/* video url */}
          <input
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded"
          />


          {/* submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded"
          >
            Add Lecture
          </button>


          {message && (
            <p className="text-sm text-indigo-400">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>
  )
}