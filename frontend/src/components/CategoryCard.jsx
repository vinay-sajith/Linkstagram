function CategoryCard(props) {
    return (
        <div onClick={() => props.onClick(props.name)}>
            <h3>{props.name}</h3>
            <p>{props.count} resources</p>
            
        </div>
        
    );
    
}

export default CategoryCard;