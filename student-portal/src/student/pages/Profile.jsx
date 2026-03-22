import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch("https://student-portal-mlp.onrender.com/api/profile/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        console.log("Profile status:", res.status);
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then((data) => setProfile(data))
      .catch(() => {
        localStorage.removeItem("token")
        navigate("/login")
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white/60">
        Loading profile...
      </div>
    )
  }

  const initials = profile.username?.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-400">
            Learner
          </p>
          <h1 className="text-3xl font-semibold text-white mt-1">
            {profile.username}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Learning */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-medium text-indigo-300">
              Learning
            </h2>

            {/* Course Card */}
            <div className="relative bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4">

              {/* Accent strip */}
              <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-l" />

              <div className="w-32 h-20 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-300 text-sm">
                Course
              </div>

              <div className="flex-1">
                <h3 className="text-white font-medium">
                  Your enrolled courses will appear here
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  This section will connect with subjects & lectures later.
                </p>

                <div className="mt-3 text-xs text-indigo-400">
                  Coming soon
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Profile Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-fit">
            <div className="flex flex-col items-center text-center space-y-4">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center text-3xl text-indigo-400 ring-2 ring-indigo-500/40">
                {initials}
              </div>

              {/* Info */}
              <div className="space-y-1">
                <p className="text-white font-medium">
                  {profile.username}
                </p>
                <p className="text-sm text-white/60">
                  {profile.email}
                </p>
              </div>

              {/* Details */}
              <div className="w-full pt-4 space-y-3 text-sm">
                <Detail label="Phone" value={profile.phone || "Not provided"} />
                <Detail label="Stream" value={profile.stream || "Not selected"} />
              </div>

              {/* Actions */}
              <div className="w-full space-y-3 mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="w-full border border-indigo-500 text-indigo-400
                             hover:bg-indigo-500 hover:text-white py-2 rounded transition"
                >
                  Go to Dashboard
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-indigo-600/90 hover:bg-indigo-600
                             text-white py-2 rounded transition"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const Detail = ({ label, value }) => (
  <div className="flex justify-between text-white/70">
    <span>{label}</span>
    <span className="text-white">{value}</span>
  </div>
)

export default Profile
