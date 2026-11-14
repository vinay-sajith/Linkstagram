"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResourceCard({ resource, categories , isLastResource }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(resource.title);
    const [category, setCategory] = useState(resource.category);    
    const router = useRouter();
    async function handleDelete(){
            const response=await fetch(`/api/resource/${resource.id}`,
              {  
                method:"DELETE"
                
              });
              if (response.ok) {
    if (isLastResource) {
        router.replace("/");
        return;
    }

    router.refresh();
}
            

  }
  async function handleSave() {
      const updatedData = {
    title: title,
    category: category,
  };
    const response=await fetch((`/api/resource/${resource.id}`),
    
    {
        method:"PATCH",
    headers:{
      "Content-Type": "application/json"

    },
      body: JSON.stringify(updatedData),

  })
  if (response.ok) {
  setIsEditing(false);
  router.refresh();
} else {
  console.error("Failed to update resource");
}

  


  }
      function handleCancel() {
  setTitle(resource.title);
  setCategory(resource.category);

  setIsEditing(false);
}


    
  return (
  <article>
    {isEditing ? (
      // Edit mode
      <div>
        <h3>Edit Resource</h3>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Category</label>
        <select value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  {categories.map((item) => (
    <option key={item.id} value={item.name}>
      {item.name}
    </option>
  ))}
</select>

        <button type="button" onClick={handleSave}>
          Save
        </button>

        <button
          type="button"
          onClick={handleCancel}>
          Cancel
        </button>
      </div>
    ) : (
      // Normal display mode
      <div>
        <h3>{resource.title}</h3>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Resource
        </a>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    )}
  </article>
);
}