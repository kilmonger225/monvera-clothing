import prisma from "@/lib/prisma";
import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

export default async function PackingSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    }
  });

  if (!order) {
    return <div className="p-8 font-bold text-center mt-20">Order not found.</div>;
  }

  // Cast shippingDetails for cleaner access
const shipping = (order as any).shippingDetails;
  return (
    <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0 flex flex-col items-center">
      
      {/* --- THE MAGIC PRINT CSS INJECTION --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: 4in 6in; margin: 0; }
          body * { visibility: hidden; }
          #packing-slip, #packing-slip * { visibility: visible; }
          #packing-slip {
            position: absolute; left: 0; top: 0;
            width: 4in; height: 6in; padding: 0.25in;
            background: white; border: none; box-shadow: none; margin: 0;
          }
        }
      `}} />

      {/* Screen-Only Navigation */}
      <div className="w-full max-w-[4in] flex justify-between items-center print:hidden mb-4">
        <Link href="/admin/orders" className="text-sm font-bold uppercase tracking-widest hover:underline">
          &larr; Back to Orders
        </Link>
        <PrintButton />
      </div>

      {/* --- THE LABEL CONTENT --- */}
      <div id="packing-slip" className="bg-white text-black w-[4in] min-h-[6in] border border-gray-300 p-4 font-sans shadow-lg print:shadow-none print:border-none flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-4">
          {/* Changed h-10 to h-16 for a larger logo */}
          <img src="/monvera-logo-bw.png" alt="Monvera Logo" className="h-15 w-auto" />
          <div className="text-right">
            <h2 className="font-bold text-lg uppercase">Monvera Wears</h2>
            <p className="text-sm">Bauchi,</p>
            <p className="text-sm">Nigeria</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex justify-between gap-4 mb-4">
          <div className="flex-1">
            <h2 className="font-extrabold uppercase text-[10px] bg-black text-white px-2 py-1 mb-2 inline-block">Ship To:</h2>
            <p className="font-extrabold text-sm uppercase">{order.name || "Customer Name"}</p>
            <p className="text-[10px]">{order.email}</p>
            {order.phone && <p className="text-[10px] font-bold mt-1">Tel: {order.phone}</p>}
            <p className="text-[10px] font-bold mt-1">Ref: {order.reference}</p>
          </div>
          
          <div className="text-[10px] text-right">
            <p><span className="font-bold">Order Date:</span><br/> {new Date(order.createdAt).toLocaleDateString()}</p>
            
            <div className="mt-2">
              <span className="font-bold">Shipping:</span><br/> 
              <p>{order.shippingMethod.replace('_', ' ')}</p>
              {/* Full Address displayed here */}
              {shipping && (
                <div className="mt-1 capitalize text-[10px]">
                  <p>{shipping.address}</p>
                  {shipping.apartment && <p>{shipping.apartment}</p>}
                  <p>{shipping.lga}, {shipping.state}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- ORDER SUMMARY (ITEMS) --- */}
        <div className="w-full flex-grow">
          <h3 className="font-extrabold uppercase text-[10px] mb-1">Order Summary</h3>
          <div className="border-t-2 border-b-2 border-black flex justify-between py-1 text-[10px] font-bold uppercase">
            <span className="flex-1">Product</span>
            <span className="w-8 text-center">Qty</span>
          </div>
          
          <div className="flex flex-col">
            {order.items && order.items.length > 0 ? (
             (order.items as any).map((item: any, index: number) => (
                <div key={index} className="flex justify-between border-b border-gray-300 py-2 text-xs">
                  <div className="flex-1 pr-2 leading-tight">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-[10px] text-gray-500">₦{item.price.toLocaleString()}</p>
                  </div>
                  <p className="w-8 text-center font-bold">{item.quantity}</p>
                </div>
              ))
            ) : (
              <div className="py-4 text-[10px] text-center text-gray-500 italic">
                No items recorded for this order.
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="w-full mt-4">
          <div className="border-t-2 border-b-2 border-black py-2 mb-2 flex justify-between font-bold text-xs uppercase">
            <span>Total Amount Paid</span>
            <span>₦{order.amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest">
          Thank you for wearing Monvera.
        </div>
      </div>
    </div>
  );
}