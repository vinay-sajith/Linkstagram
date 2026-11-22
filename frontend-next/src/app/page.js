import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CategoryCard from "./components/CategoryCard";
import AddResourcePage from "./add/page";

export default async function Home() {


  // 1. Read browser cookies
  const cookieStore = await cookies();

const resourceResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/`,
    {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    })

  // 5. Handle errors
if (resourceResponse.status === 401) {
    redirect("/login");
}

if (!resourceResponse.ok) {
    throw new Error("Failed to fetch categories");
}

const categories = await resourceResponse.json();

  if (!Array.isArray(categories)) {
    throw new Error("Invalid categories response");
  }


  return (
    <main>
      <header>
        <h2>linkstagram.</h2>
      </header>

      <section>
        <p>YOUR PERSONAL LIBRARY</p>

        <h1>
          Your knowledge,
          <br />
          beautifully organized.
        </h1>

        <p>
          Keep your favorite links organized in one place.
          Find what you need, when you need it.
        </p>

        <div><AddResourcePage/></div>
      </section>

      <section>
        <h2>Your Categories</h2>

        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))
        )}
      </section>
    </main>
  );
}