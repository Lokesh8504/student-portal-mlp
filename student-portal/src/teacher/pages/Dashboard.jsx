import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function TeacherDashboard() {

  const navigate = useNavigate()

  const [materials, setMaterials] = useState([])

  const token = localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("is_staff")
    navigate("/login")
  }

  // load teacher uploads
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/materials/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setMaterials(data))
  }, [])

  const totalUploads = materials.length

  const lastUpload =
    materials.length > 0
      ? new Date(materials[0].created_at).toLocaleDateString()
      : "No uploads"

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-white">

      {/* header */}
      <header className="border-b border-white/10 px-12 py-6 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-semibold">
            Teacher Dashboard
          </h1>

          <p className="text-sm text-white/60">
            Manage study materials and teaching content
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm transition"
        >
          Logout
        </button>

      </header>



      <main className="px-12 py-10 space-y-10">


        {/* stats */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition">

            <p className="text-sm text-white/60">
              Total Uploads
            </p>

            <h3 className="text-3xl font-semibold mt-2">
              {totalUploads}
            </h3>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition">

            <p className="text-sm text-white/60">
              Last Upload
            </p>

            <h3 className="text-xl font-semibold mt-2">
              {lastUpload}
            </h3>

          </div>


          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition">

            <p className="text-sm text-white/60">
              Subjects Managed
            </p>

            <h3 className="text-3xl font-semibold mt-2">
              --
            </h3>

          </div>

        </div>



        {/* quick actions */}
        <div className="grid md:grid-cols-4 gap-8">

          <div
            onClick={() => navigate("/teacher/upload")}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-indigo-500/50 transition"
          >

            <div className="text-4xl mb-4 text-indigo-400">
              📤
            </div>

            <h3 className="text-lg font-semibold">
              Upload Material
            </h3>

            <p className="text-sm text-white/60 mt-2">
              Add notes, PYQs, sample papers or lecture videos.
            </p>

          </div>



          <div
            onClick={() => navigate("/teacher/uploads")}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-indigo-500/50 transition"
          >

            <div className="text-4xl mb-4 text-indigo-400">
              📚
            </div>

            <h3 className="text-lg font-semibold">
              My Uploads
            </h3>

            <p className="text-sm text-white/60 mt-2">
              View, manage and delete uploaded materials.
            </p>

          </div>



          <div
            onClick={() => navigate("/teacher/profile")}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-indigo-500/50 transition"
          >

            <div className="text-4xl mb-4 text-indigo-400">
              👤
            </div>

            <h3 className="text-lg font-semibold">
              Profile
            </h3>

            <p className="text-sm text-white/60 mt-2">
              Manage teacher account information.
            </p>

          </div>

          <div
            onClick={() => navigate("/teacher/add-lecture")}
            className="group cursor-pointer bg-white/5 border border-white/10 
                      hover:border-indigo-500/60 hover:bg-white/10
                      rounded-2xl p-8 transition-all duration-300
                      hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-900/20"
          >
            <div className="text-indigo-400 text-4xl mb-4">
              🎬
            </div>

            <h3 className="text-lg font-medium mb-2">
              Add Chapter
            </h3>

            <p className="text-sm text-white/60">
              Add video lecture to subject
            </p>
          </div>


        </div>



        {/* recent uploads */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-lg font-semibold">
              Recent Uploads
            </h2>

            <button
              onClick={() => navigate("/teacher/uploads")}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View All
            </button>

          </div>


          {materials.length === 0 ? (

            <p className="text-white/60 text-sm">
              No materials uploaded yet.
            </p>

          ) : (

            <div className="space-y-4">

              {materials.slice(0,4).map(item => (

                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-lg hover:bg-white/10"
                >

                  <div>
                    <p className="font-medium">
                      {item.title}
                    </p>

                    <p className="text-xs text-white/50">
                      {item.material_type}
                    </p>
                  </div>

                  <a
                    href={item.file}
                    target="_blank"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Open
                  </a>

                </div>

              ))}

            </div>

          )}

        </div>


      </main>

    </div>
  )
}