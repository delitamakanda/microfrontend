export const CartItem = ({ product }) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <div className="fw-bold">{product.name}</div>
                <small className="text-muted">{product.price}</small>
            </div>
            <span className="badge bg-primary rounded-pill">1</span>
        </li>
    )
};