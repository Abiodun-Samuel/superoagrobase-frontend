
const ProductsPage = async ({ searchParams }) => {
    const query = await searchParams
    return (
        <div>all products: {query?.page}</div>
    )
}

export default ProductsPage