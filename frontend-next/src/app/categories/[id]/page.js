import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResourceCard from "../../components/ResourceCard";

export default async function CategoryPage({ params }) {

  const { id } = await params;
const cookieStore = await cookies();

const resourceResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`,
    {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    }
);  if (
    resourceResponse.status === 401
  ) {
    redirect("/login");
  }

  if (!resourceResponse.ok) {
    throw new Error("Failed to fetch category data");
  }

  const data = await resourceResponse.json();
  const category=data.category;
  const resources = data.resources;
  const categories = data.categories;



  return (
    <main>
      <Link href="/">Back to Categories</Link>

      <h1>{category.name}</h1>

      <p>{category.count} resources</p>

      <section>
        {resources.length === 0 ? (
          <p>No resources found in this category.</p>
        ) : (
          resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              categories={categories}
              isLastResource={resources.length === 1}
            />
          ))
        )}
      </section>
    </main>
  );
}