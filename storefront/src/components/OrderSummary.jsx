import { ProductCart } from "./ProductCart";

export const OrderSummary = () => {
    const products = [
        {
            id: 1,
            name: "Product 1",
            price: "$100"
        },
        {
            id: 2,
            name: "Product 2",
            price: "$200"
        },
        {
            id: 3,
            name: "Product 3",
            price: "$300"
        }
    ]
    return (
        <>
            <h1>Order Summary</h1>
            <ul className="list-group">
                {products.map((product) => (
                    <ProductCart key={product.id} product={product} />
                ))}
            </ul>
        </>
    )
};