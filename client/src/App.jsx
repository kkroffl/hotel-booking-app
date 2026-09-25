import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    // BrowserRouter allows our React app to understand different URLs.
    <BrowserRouter>
      <Routes>
        {/* Home page → / */}
        <Route path="/" element={<Home />} />

        {/* Hotel listing/search page → /hotels */}
        <Route path="/hotels" element={<Hotels />} />

        {/* Individual hotel page → /hotels/123 */}
        <Route path="/hotels/:id" element={<HotelDetails />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
