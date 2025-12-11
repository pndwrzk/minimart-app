"use client";

import { useEffect, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { OrderResponseDTO, OrderItemDTO } from "@/types/order.type";
import { formatRupiah } from "@/lib/utils";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { formatDateTimeID } from "@/lib/date";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AxiosError } from "axios";

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
          const error = err as AxiosError<{ message: string }>;
          toast({
            title: "fetch order history failed",
            description: error.message,
          });
        }
  };

  return (
    <div className="max-w-5xl mx-auto mt-[140px] px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>


      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {["pending", "paid", "completed", "cancelled"].map((status) => (
          <Button
            key={status}
            className="cursor-pointer px-5 py-2"
            variant={activeStatus === status ? "default" : "outline"}
            onClick={() => setActiveStatus(status as Status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-500 py-10">Loading orders...</div>
      )}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {!loading && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Dialog key={order.id}>
              <div className="border rounded-xl p-4 bg-white shadow hover:shadow-lg transition flex justify-between items-center gap-4">
            
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-lg">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {formatDateTimeID(order.created_at)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="capitalize text-sm text-gray-600">
                      Status: {order.status}
                    </div>
                    <div className="font-bold text-base">{formatRupiah(order.total_price)}</div>
                  </div>
                </div>

              
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                    aria-label="View order details"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </Button>
                </DialogTrigger>
              </div>

         
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Order #{order.id} Items</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 max-h-96 overflow-y-auto mt-4">
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
                        <div className="font-bold">{formatRupiah(item.subtotal)}</div>
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
          <div className="text-center text-gray-500 py-10">
            No orders with status{" "}
            <span className="font-semibold">"{activeStatus}"</span>
          </div>
        )
      )}
    </div>
  );
};

export default OrderHistory;
