import { Badge } from "@/components/ui/badge";
import { Product } from "../types/product";
import useUser from "../../hooks/use-user";
import { TriangleAlert } from "lucide-react";

interface NameAndQuantityProps {
  product: Product;
}
const NameAndQuantity = ({ product }: NameAndQuantityProps) => {
  const { userQuery } = useUser();
  const user = userQuery.data;
  const isProductAdmin = product.adminId === user?.id;

  return (
    <div className="flex flex-col">
      <span className="font-medium text-base max-w-lg truncate">
        {product.name}
      </span>
      <span className="text-muted-foreground">
        Qty:{product.quantity}
        {isProductAdmin && product.quantity < 8 && (
          <Badge variant="destructive" className="ms-2">
            <TriangleAlert />
            Low inventory
          </Badge>
        )}
      </span>
    </div>
  );
};

export default NameAndQuantity;
