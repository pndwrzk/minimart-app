"use client";

import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { isLoggedIn } from "@/lib/auth";
import { useOrder } from "@/hooks/useOrder";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartCount } from "@/context/CartCountContext";
import { image_host } from "@/lib/constants";


const CartPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { cart, loading, error, refreshCart } = useCart();
  const { checkout } = useOrder();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [openCheckout, setOpenCheckout] = useState<boolean>(false);
    const { fetchCartCount } = useCartCount();

  useEffect(() => {
    if (!isLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access your cart.",
      });
      router.replace("/");
      return;
    }

    refreshCart();
  }, [refreshCart, router, toast]);

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (cart) {
      setSelectedItems(cart.items.map((item) => item.id));
    }
  };

  const deselectAllItems = async () => {
    setSelectedItems([]);
  };

  const handleDialogCheckout = () => {
    if (!selectedItems.length) {
      toast({
        title: "No item selected",
        description: "Please select at least one item to checkout.",
      });
      return;
    }
    setOpenCheckout(true);
  };

  const handleCheckout = async () => {
    const res = await checkout({ cart_ids: selectedItems });

    toast({
      title: "Checkout success",
      description: res?.message,
    });
     setSelectedItems([]);
    refreshCart();
    fetchCartCount();
  };

  const selectedSubtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.total_price, 0);
  }, [cart, selectedItems]);

  if (loading) return <div className="text-center py-20">Loading cart...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-[180px] sm:my-[120px] py-5 border-gray-300 rounded-lg bg-gray-100 px-6 border">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>

      {cart?.items.length ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={selectAllItems}
              className="px-4 py-2 bg-black text-white rounded cursor-pointer"
            >
              Select All
            </button>

            {selectedItems.length > 0 && (
              <button
                onClick={deselectAllItems}
                className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Deselect All
              </button>
            )}
          </div>

          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-6 w-6 mr-2 cursor-pointer"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                  <img
                    src={
                      item.image_path
                        ? `${image_host}/${item.image_path}`
                        : "/placeholder.png"
                    }
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded border border-gray-300 p-1"
                  />
                  <div className="flex flex-col ml-3">
                    <p className="font-semibold text-gray-800">
                      {item.product_name}
                    </p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">
                      Price: {formatRupiah(item.price)}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-gray-900">
                  Total: {formatRupiah(item.total_price)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col items-end space-y-1">
            <p className="text-gray-400">
              Subtotal Selected: {formatRupiah(selectedSubtotal)}
            </p>
            <p className="font-semibold text-black">
              Cart Total : {formatRupiah(cart.sub_total)}
            </p>
          </div>

          <button
            onClick={handleDialogCheckout}
            className="px-6 py-3 bg-black text-white font-semibold rounded cursor-pointer"
          >
            Checkout ({selectedItems.length})
          </button>
          <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Checkout</DialogTitle>
                <DialogDescription>
                  You are about to checkout {selectedItems.length} item(s) with
                  total <b>{formatRupiah(selectedSubtotal)}</b>. Continue?
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpenCheckout(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    setOpenCheckout(false);
                    await handleCheckout();
                  }}
                  className="px-4 py-2 bg-black text-white rounded cursor-pointer"
                >
                  Yes, Checkout
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
