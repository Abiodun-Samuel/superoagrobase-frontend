
const CategoryProductsPage = async ({ params }) => {
    const { category } = await params
    return (
        <div>category product: {category}</div>
    )
}

export default CategoryProductsPage