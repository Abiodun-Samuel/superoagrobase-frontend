
const SubcategoryProductsPage = async ({ params }) => {
    const { subcategory } = await params
    return (
        <div>Subcategory Page: {subcategory}</div>
    )
}

export default SubcategoryProductsPage