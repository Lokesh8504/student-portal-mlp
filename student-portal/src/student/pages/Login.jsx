import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [stream, setStream] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const url = isRegister
      ? "http://localhost:8000/api/register/"
      : "http://localhost:8000/api/login/"

    const payload = isRegister
      ? { username, email, password, phone, stream }
      : { username, password }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      const firstError =
        data.error ||
        Object.values(data)[0]?.[0] ||
        "Something went wrong"

      setError(firstError)
      return
    }

    localStorage.setItem("token", data.token)

    // save role for routing later
    localStorage.setItem("is_staff", data.is_staff)

    // redirect based on role
    if (data.is_staff) {
      navigate("/teacher/dashboard")
    } else {
      navigate("/")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <form className="w-full max-w-sm p-6 rounded-lg border border-white/10 bg-white/5" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          {isRegister ? "Create account" : "Student Login"}
        </h2>

        <div className="space-y-4">
          <input
            className="w-full p-2 rounded bg-transparent border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {isRegister && (
            <input
              className="w-full p-2 rounded bg-transparent border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <input
            className="w-full p-2 rounded bg-transparent border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <>
              <input
                className="w-full p-2 rounded bg-transparent border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <select
                className="w-full p-2 rounded bg-transparent border border-white/20 text-white focus:outline-none focus:border-indigo-500"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
              >
                <option value="" className="bg-[#0f172a]">
                  Select stream (optional)
                </option>
                <option value="science-maths" className="bg-[#0f172a]">
                  Science (Maths)
                </option>
                <option value="science-bio" className="bg-[#0f172a]">
                  Science (Biology)
                </option>
                <option value="commerce" className="bg-[#0f172a]">
                  Commerce
                </option>
                <option value="arts" className="bg-[#0f172a]">
                  Arts
                </option>
              </select>
            </>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-white/70">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError("")
              setPassword("")
              setPhone("")
              setStream("")
            }}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
