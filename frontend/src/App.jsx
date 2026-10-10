import Navbar from "./components/Navbar";
import Library from "./pages/Library";
import { useEffect, useState } from "react";

function App() {
  const[resources,setResources]=useState([])
  useEffect(()=>{
    async function getResource() {
            const response=await fetch("http://127.0.0.1:8000/resources/",{
                headers:{
                     Authorization: "Token 6d995bb1456f7e80b454514040be52b477adf5f6",

                }
            }
            )
                if (!response.ok) {
                console.log("Failed to fetch resources");
                return;
            }

            const data = await response.json();
            console.log(data);

            setResources(data);

        
    }
    getResource()




  },[])


    return (
        <>
            <Navbar />
            <Library resources={resources} />
            

        </>
    );

}
export default App;