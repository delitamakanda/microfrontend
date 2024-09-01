import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Helmet } from "react-helmet-async";

export const CouponList = () => {
  const navigate = useNavigate();

  const goToCouponCreate = () => {
    navigate("/coupons/create", { replace: true });
  };

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex justify-content-between align-items-center">
          <span className="p-card-title">Coupons</span>
          <Button
            icon="pi pi-plus"
            label="Create"
            onClick={goToCouponCreate}
            className="ml-2"
          />
        </div>
      }
    >
      <Helmet>
        <title>Dearest. | Coupons</title>
      </Helmet>
    </Card>
  );
};
