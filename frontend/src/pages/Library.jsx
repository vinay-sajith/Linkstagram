import CategoryCard from "../components/CategoryCard";
import ResourceCard from "../components/ResourceCard";
import { useState } from "react";
function Library(props) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categories = props.resources.map(
        (resource) => resource.category
    );

    const uniqueCategories = [...new Set(categories)];
    function handleCategoryClick(category) {
        setSelectedCategory(category)
    }
    const selectedResources = props.resources.filter(
        (resource)=> resource.category===selectedCategory
    );
 


return (
    <div>
        {!selectedCategory &&(
            <div>
                
        {uniqueCategories.map((category) => {
            const count = props.resources.filter(
                (resource) => resource.category === category
            ).length;

            return (
                <CategoryCard
                    key={category}
                    name={category}
                    count={count}
                    onClick={handleCategoryClick}
                />
            );
        })}

            </div>
        )

        }

        {selectedCategory &&(
            <div>
                <div onClick={()=>setSelectedCategory(null)}>Back to Library</div>
                <h2>{selectedCategory}</h2>
              {selectedResources.map((resource) => {
    return (
        <ResourceCard
            key={resource.id}
            title={resource.title}
            url={resource.url}

        />
    );
})}
            </div>
        )}
    </div>
);

}

export default Library;