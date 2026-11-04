import Link from "next/link";
export default function CategoryCard({category}){
    return(
        <div>
      <Link href={`/categories/${category.id}`}>
              <h3>{category.name}</h3>
      </Link>

      <p>{category.count} resources</p>
        </div>
    )

}