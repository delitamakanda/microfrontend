import { Image } from 'primereact/image'
export const CartItem = ({ product, quantity, total }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };
    return (
        <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <Image src={product.image_url} alt={product.name} width="200" height="100%" className="h-10 w-10 rounded-full" />
                <div className="fw-bold">{product.name}</div>
                <div className="text-muted">{formatPrice(product.price)}</div>
            </div>
            <span className="badge bg-primary rounded-pill">{quantity}</span>
            <div className="text-muted">{formatPrice(total)}</div>
        </li>
    )
};