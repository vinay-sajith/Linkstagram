import Navbar from "./components/Navbar";
import Library from "./pages/Library";
import { useState } from "react";

function App() {
  const[resources,setresource]=useState([])
    return (
        <>
            <Navbar />
            <Library resources={resources} />

        </>
    );
}

export default App;