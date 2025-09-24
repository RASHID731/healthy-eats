import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react'

/**
 * Helper: Always format money from integer cents.
 * This avoids floating point rounding issues.
 */
function centsToEUR(c: number) {
  return `€${(c / 100).toFixed(2)}`
}

/**
 * CartPage
 *
 * Renders the shopping cart with:
 * - Empty cart message
 * - List of items with quantity controls
 * - Server-synced updates for qty and removal
 * - Cart total + checkout link
 */
export default function CartPage() {
  const { cart, setQty, remove } = useCart();

  /* ---------------- EMPTY STATE ---------------- */
  if (!cart || cart.items.length === 0) {
    return (
      <div className='flex-grow my-25 mx-auto md:w-[800px] sm:w-118 w-88'>
        <div className="flex justify-start">
          <h1 className='text-2xl font-bold mb-4'>Your Cart</h1>
        </div>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  /* ---------------- FILLED CART ---------------- */
  return (
    <div className='flex-grow my-25'>
      <div className='flex md:flex-row flex-col md:justify-center md:items-start items-center md:gap-21'>
        {/* --- Cart Items List --- */}
        <div className='sm:w-118 w-88'>
          <h1 className='text-2xl font-bold mb-4'>Your Cart</h1>
          {cart.items.map(item => (
            <div key={item.productId} className='flex justify-between border-b border-gray-3 last:border-none items-center py-4'>
              {/* Product info */}
              <div className='flex flex-row gap-4'>
                {/* Thumbnail */}
                <div>
                  <img src={item.imageUrl} alt={item.name} className='w-24 h-24 object-cover rounded-lg' />
                </div>
                <div className='flex flex-col justify-between h-22'>
                  <div className='font-semibold'>{item.name}</div>
                  <div className='text-sm'>{centsToEUR(item.unitPriceCents)}</div>

                  {/* Quantity controls (server-authoritative) */}
                  <div className='flex items-center'>
                    <button 
                      className='flex items-center justify-center w-6 h-6 border border-gray-3 hover:border-gray-5 text-gray-2 cursor-pointer rounded-full'
                      onClick={() => setQty(item.productId, Math.max(0, item.quantity - 1))}
                      >
                        -
                      </button>

                    <input
                      className="w-7 text-center"
                      value={item.quantity}
                      onChange={(e) => {
                        const n = Math.max(0, parseInt(e.target.value || '0', 10));
                        void setQty(item.productId, n);
                      }}
                      />

                    <button
                      className="flex items-center justify-center w-6 h-6 border border-gray-3 hover:border-gray-5 text-gray-2 cursor-pointer rounded-full"
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                      >
                      <span>+</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center items-end gap-10 h-22'>
                {/* Line total */}
                <div className='text-right font-semibold'>{centsToEUR(item.lineTotalCents)}</div>

                {/* Remove line */}
                <button className='mb-2 text-gray-6 hover:scale-110 focus:scale-100 cursor-pointer' onClick={() => remove(item.productId)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary box */}
        <div className="flex flex-col justify-between md:mt-16 mt-8 max-w-md md:w-61 sm:w-full w-88 h-30">
          {/* Total row */}
          <div className="flex justity-between md:w-51 md:gap-26 sm:gap-89 gap-65 font-bold text-lg border-y border-gray-5 py-3"><span>Total</span><span>{centsToEUR(cart.totalCents)}</span></div>
          {/* Checkout CTA */}
          <div className="mt-4 flex gap-3">
            <a href="/checkout" className="bg-black text-white rounded hover:bg-gray-2 transition-colors px-16 py-2 md:m-0 mx-auto">Check out</a>
          </div>
        </div>
      </div>
    </div>
  );
}