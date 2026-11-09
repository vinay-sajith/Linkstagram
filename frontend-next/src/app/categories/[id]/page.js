import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import ResourceCard from "../../components/ResourceCard";

export default async function CategoryPage({ params }) {

  // 1. Get the category ID from the URL
  const { id } = await params;

  // 2. Read the browser cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access")?.value;


  // 3. Check authentication
  if (!accessToken) {
    redirect("/login");
  }

  // 4. Prepare the authentication header
  const headers = {
    Cookie: `access=${accessToken}`,
  };

  // 5. Fetch categories and resources from Django
  const [categoryResponse, resourceResponse] = await Promise.all([
    fetch(`${process.env.DJANGO_API_URL}/categories/`, {
      headers,
      cache: "no-store",
    }),

    fetch(`${process.env.DJANGO_API_URL}/resources/?category_id=${id}`, {
      headers,
      cache: "no-store",
    }),
  ]);

  // 6. Handle authentication errors
  if (
    categoryResponse.status === 401 ||
    resourceResponse.status === 401
  ) {
    redirect("/login");
  }

  if (!categoryResponse.ok || !resourceResponse.ok) {
    throw new Error("Failed to fetch category data");
  }

  // 7. Convert responses into JavaScript data
  const categories = await categoryResponse.json();
  const resources = await resourceResponse.json();

  // 8. Find the selected category
  const category = categories.find(
    (item) => String(item.id) === id
  );

  if (!category) {
    notFound();
  }

  // 9. Display the category and its resources
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
            />
          ))
        )}
      </section>
    </main>
  );
}