import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function MyUploads() {

  const token = localStorage.getItem("token")

  const [materials, setMaterials] = useState([])
  const [lectures, setLectures] = useState([])

  const navigate = useNavigate()


  // fetch materials
  useEffect(() => {

    fetch("https://student-portal-mlp.onrender.com/api/materials/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .catch((err) => console.error(err))


    // fetch lectures
    fetch("https://student-portal-mlp.onrender.com/api/lecture/list/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLectures(data))
      .catch((err) => console.error(err))

  }, [])



  // delete material
  const handleDeleteMaterial = async (id) => {

    const confirmDelete = window.confirm("Delete this material?")
    if (!confirmDelete) return

    await fetch(
      `https://student-portal-mlp.onrender.com/api/materials/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )

    setMaterials(materials.filter(m => m.id !== id))

  }



  // delete lecture
  const handleDeleteLecture = async (id) => {

    const confirmDelete = window.confirm("Delete this lecture?")
    if (!confirmDelete) return

    await fetch(
      `https://student-portal-mlp.onrender.com/api/lecture/delete/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )

    setLectures(lectures.filter(l => l.id !== id))

  }



  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">

      <div className="flex justify-between items-center px-10 py-6 border-b border-white/10">

        <h1 className="text-2xl font-semibold">
          My Uploads
        </h1>

        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm"
        >
          Back to Dashboard
        </button>

      </div>



      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mt-6">

        <table className="w-full text-sm">

          <thead className="bg-white/5 text-white/70">

            <tr>
              <th className="text-left px-6 py-4">Title</th>
              <th className="text-left px-6 py-4">Type</th>
              <th className="text-left px-6 py-4">Class</th>
              <th className="text-left px-6 py-4">Subject</th>
              <th className="text-left px-6 py-4">Uploaded</th>
              <th className="text-right px-6 py-4">Action</th>
            </tr>

          </thead>



          <tbody>

            {/* materials */}

            {materials.map(m => (

              <tr
                key={m.id}
                className="border-t border-white/5 hover:bg-white/5"
              >

                <td className="px-6 py-4 font-medium">
                  {m.title}
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded bg-indigo-600/30">
                    {m.material_type}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {m.school_class}
                </td>

                <td className="px-6 py-4">
                  {m.subject}
                </td>

                <td className="px-6 py-4 text-white/60">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">

                  <button
                    onClick={() => handleDeleteMaterial(m.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}



            {/* lectures */}

            {lectures.map(l => (

              <tr
                key={l.id}
                className="border-t border-white/5 hover:bg-white/5"
              >

                <td className="px-6 py-4 font-medium">
                  {l.title}
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded bg-green-600/30">
                    lecture
                  </span>
                </td>

                <td className="px-6 py-4">--</td>

                <td className="px-6 py-4">
                  {l.subject}
                </td>

                <td className="px-6 py-4 text-white/60">
                  --
                </td>

                <td className="px-6 py-4 text-right">

                  <button
                    onClick={() => handleDeleteLecture(l.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}



            {materials.length === 0 && lectures.length === 0 && (

              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-white/50"
                >
                  Nothing uploaded yet.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )

}