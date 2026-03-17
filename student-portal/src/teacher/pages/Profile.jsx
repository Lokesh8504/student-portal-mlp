import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function TeacherProfile() {

  const [profile, setProfile] = useState(null)
  const [materials, setMaterials] = useState([])

  //to change password
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passMsg, setPassMsg] = useState("")


  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  // load teacher profile
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/profile/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setProfile(data))
  }, [])

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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading profile...
      </div>
    )
  }

  const totalUploads = materials.length
  const lastUpload =
    materials.length > 0
      ? new Date(materials[0].created_at).toLocaleDateString()
      : "No uploads yet"

  //password change

  const handleChangePassword = async () => {

  const res = await fetch(
    "http://127.0.0.1:8000/api/change-password/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    }
  )

  const data = await res.json()

  if (res.ok) {
    setPassMsg("Password changed")
  } else {
    setPassMsg(data.error)
  }
}


  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* top bar */}
      <div className="border-b border-white/10 px-10 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Teacher Profile</h1>
          <p className="text-white/60 text-sm">
            Manage your teaching profile and uploads
          </p>
        </div>

        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm"
        >
          Back to Dashboard
        </button>
      </div>


      <div className="p-10 space-y-10">

        {/* profile header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center gap-8">

          {/* avatar */}
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-semibold">
            {profile.username?.charAt(0).toUpperCase()}
          </div>

          {/* teacher info */}
          <div>
            <h2 className="text-2xl font-semibold">
              {profile.username}
            </h2>

            <p className="text-white/60">
              {profile.email}
            </p>

            <div className="flex gap-6 mt-3 text-sm text-white/70">
              <span>Role: Teacher</span>
              <span>Phone: {profile.phone || "Not provided"}</span>
            </div>
          </div>

        </div>


        {/* stats section */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500/40 transition">
            <p className="text-sm text-white/60">
              Total Uploads
            </p>

            <h3 className="text-3xl font-semibold mt-2">
              {totalUploads}
            </h3>
          </div>


          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500/40 transition">
            <p className="text-sm text-white/60">
              Last Upload
            </p>

            <h3 className="text-xl font-semibold mt-2">
              {lastUpload}
            </h3>
          </div>


          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500/40 transition">
            <p className="text-sm text-white/60">
              Subjects Handling
            </p>

            <h3 className="text-3xl font-semibold mt-2">
              --
            </h3>
          </div>

        </div>


        {/* uploads preview */}
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

              {materials.slice(0, 3).map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
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

        {/* change password */}
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-10">

        <h2 className="text-lg font-semibold mb-4">
            Change Password
        </h2>

        <div className="space-y-4 max-w-md">

            <input
            type="password"
            placeholder="Old password"
            className="w-full p-3 rounded-lg bg-[#020617] border border-white/10"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
            type="password"
            placeholder="New password"
            className="w-full p-3 rounded-lg bg-[#020617] border border-white/10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md"
            >
            Change Password
            </button>

            {passMsg && (
            <p className="text-sm text-indigo-400">
                {passMsg}
            </p>
            )}

        </div>

        </div>


      </div>

    </div>
  )
}