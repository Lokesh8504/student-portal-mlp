import { BrowserRouter } from "react-router-dom";
import StudentRoutes from "./student/routes";

export default function App() {
  return (
    <BrowserRouter>
      <StudentRoutes />
    </BrowserRouter>
  );
}
