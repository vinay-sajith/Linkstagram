import CategoryCard from "../components/CategoryCard";
import ResourceCard from "../components/ResourceCard";
function Library(props) {
    const categories = props.resources.map(
        (resource) => resource.category
    );

    const uniqueCategories = [...new Set(categories)];
    function handleCategoryClick(category) {
        props.setSelectedCategory(category)
    }
    const selectedResources = props.resources.filter(
        (resource)=> resource.category===props.selectedCategory
    );


return (
    <div>
        {!props.selectedCategory &&(
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

        {props.selectedCategory &&(
            <div>
                <div onClick={()=>props.setSelectedCategory(null)}>Back to Library</div>
                <h2>{props.selectedCategory}</h2>
              {selectedResources.map((resource) => {
    return (
        <ResourceCard
            key={resource.id}
            title={resource.title}
            url={resource.url}
            onEdit={() => props.onEdit(resource)}
            onDelete={()=>props.onDelete(resource.id)}
        />
    );
})}
            </div>
        )}
    </div>
);

}

export default Library;