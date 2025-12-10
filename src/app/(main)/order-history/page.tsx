"use client";

import { useEffect, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { OrderResponseDTO, OrderItemDTO } from "@/types/order.type";
import { formatRupiah } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { formatDateTimeID } from "@/lib/date";


type Status = "pending" | "paid" | "completed" | "cancelled";

const OrderHistory = () => {
  const { fetchOrders, loading, error } = useOrder();
  const toast = useToast();
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<Status>("pending");
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);




  useEffect(() => {
    if (!isLoggedIn()) {
      toast({
        title: "Authentication required",
        description: "Please log in to access your history order.",
      });
      router.replace("/");
      return;
    }
    fetch();
  }, [activeStatus]);

  const fetch = async () => {
    try {
      const res = await fetchOrders(activeStatus);
      if (res?.data) setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-[140px] px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {["pending", "paid", "completed", "cancelled"].map((status) => (
          <Button
            key={status}
            className="cursor-pointer"
            variant={activeStatus === status ? "default" : "outline"}
            onClick={() => setActiveStatus(status as Status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-500">Loading orders...</div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Dialog key={order.id}>
              <DialogTrigger asChild>
                <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {formatDateTimeID(order.created_at)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="capitalize text-sm text-gray-600">
                      Status: {order.status}
                    </div>
                    <div className="font-bold">
                      {formatRupiah(order.total_price)}
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Order #{order.id} Items</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-96 overflow-y-auto mt-4">
                  {order.items.map((item: OrderItemDTO) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-semibold">{item.product_name}</div>
                        <div className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{formatRupiah(item.price)}</div>
                        <div className="font-bold">
                          {formatRupiah(item.subtotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center text-gray-500">
            No orders with status{" "}
            <span className="font-semibold">"{activeStatus}"</span>
          </div>
        )
      )}
    </div>
  );
};

export default OrderHistory;
