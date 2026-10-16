import Navbar from "./components/Navbar";
import Library from "./pages/Library";
import { useEffect, useState } from "react";

function App() {

  const[resources,setResources]=useState([])
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

 
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
   async function handleSubmit(event) {
    event.preventDefault()
    const resourceData = {
        title:title,
        url:url,
        category:category

    }
   
    const response=await fetch("http://127.0.0.1:8000/resources/",{
         method :'POST',
        
            headers:{
            "Content-Type": "application/json",
            "Authorization": "Token 6d995bb1456f7e80b454514040be52b477adf5f6",
            },
           body: JSON.stringify(resourceData)
        }
    )
    if (!response.ok){
        console.log("Failed to create resources");
        const errorData = await response.json();
        console.log(errorData)

        return;


    }
    const data = await response.json();

    setResources(previousResources => [
        ...previousResources,
        data
]);
 const settlers={
        title:setTitle,
        url:setUrl,
        category:setCategory

    }

   Object.keys(settlers).forEach((key) => {
  settlers[key]("");
});
  }



    return (
        <>
            <Navbar />
            {!selectedCategory &&(<form onSubmit={handleSubmit}>
                url :<input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                /><br/>
                title :<input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                /><br/>
                category :<input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                />
                <button type="submit">ADD</button>
            </form>)}
            <Library
             resources={resources}
             selectedCategory={selectedCategory}
             setSelectedCategory={setSelectedCategory}
             />            
            


            

        </>
    );
    

}
export default App;