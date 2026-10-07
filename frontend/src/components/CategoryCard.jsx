function CategoryCard(props) {
    return (
        <div>
            <h3>{props.name}</h3>
            <p>{props.count} resources</p>
        </div>
    );
}

export default CategoryCard;