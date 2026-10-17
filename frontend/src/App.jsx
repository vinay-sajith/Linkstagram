import Navbar from "./components/Navbar";
import Library from "./pages/Library";
import { useEffect, useState } from "react";

function App() {

  const[resources,setResources]=useState([])
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingResource,seteditingResource]=useState(null)

 
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
   
    const response=await fetch(editingResource
    ? `http://127.0.0.1:8000/resources/${editingResource.id}/`
    : "http://127.0.0.1:8000/resources/",{
         method: editingResource ? "PATCH" : "POST",
        
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

if (editingResource) {
    // PATCH: replace the existing resource
    setResources(previousResources =>
        previousResources.map((resource) =>
            resource.id === editingResource.id
                ? data
                : resource
                
                
        )
    );
} else {
    // POST: append the new resource
    setResources(previousResources => [
        ...previousResources,
        data
    ]);

}
seteditingResource(null);

 const settlers={
        title:setTitle,
        url:setUrl,
        category:setCategory

    }

   Object.keys(settlers).forEach((key) => {
  settlers[key]("");
});
  }
  function handleEdit(resource) {
    seteditingResource(resource);
        setTitle(resource.title)
        setUrl(resource.url)
        setCategory(resource.category)
        console.log("Editing:", resource)
}

console.log(editingResource)
    return (
        <>
            <Navbar />
            {(!selectedCategory || editingResource!==null)&&(<form onSubmit={handleSubmit}>
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
                {(editingResource === null
    ? <button type="submit">ADD</button>
    : <button type="submit">UPDATE</button>)}
            </form>)}
            <Library
             resources={resources}
             selectedCategory={selectedCategory}
             setSelectedCategory={setSelectedCategory}
             seteditingResource={seteditingResource}
             onEdit={handleEdit}

             />            
            


            

        </>
    );
    
}
export default App;