'uce client'

import { ShoppingBag, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import IconBadge from "../ui/IconBadge";

const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-10 px-4">
        <IconBadge className="mb-5" color="red" size="2xl" shape="circle" icon={<ShoppingCart />} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-base text-center mb-8 max-w-md">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Button
            href='/products'
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
        >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
        </Button>
    </div>
);
export default EmptyCart