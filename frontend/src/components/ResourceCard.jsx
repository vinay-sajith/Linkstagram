function ResourceCard(props){
    return(
        <div>
            <p>{props.title}</p>
            <a href={props.url} target="_blank" rel="noopener noreferrer">
            <p>{props.url}</p>
            </a>
            <button onClick={props.onEdit}>Edit</button>
            <button onClick={props.onDelete}>Delete</button>
        </div>
    )
}
export default ResourceCard;