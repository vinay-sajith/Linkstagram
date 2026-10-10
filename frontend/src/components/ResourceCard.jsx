function ResourceCard(props){
    return(
        <div>
            <p>{props.title}</p>
            <a href={props.url} target="_blank" rel="noopener noreferrer">
            <p>{props.url}</p>
            </a>
        </div>
    )
}
export default ResourceCard;