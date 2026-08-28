import { CoinsIcon} from 'lucide-react';
import React from 'react';

const pointPackages = [
  { points: 5000, bonus: 250, price: 4.99 },
  { points: 10000, bonus: 1000, price: 9.99 },
  { points: 20000, bonus: 4000, price: 19.99 },
  { points: 50000, bonus: 25000, price: 49.99 },
  { points: 80000, bonus: 64000, price: 79.99 },
  { points: 100000, bonus: 100000, price: 99.99 },
];

const wallet = [
  { time: '5/15/2025, 08:45 PM', points: 100, balance: 100 },
  { time: '5/15/2025, 08:45 PM', points: 100, balance: 100 },
  { time: '5/15/2025, 08:46 PM', points: 100, balance: 100 },
  { time: '5/15/2025, 08:46 PM', points: 100, balance: 100 },
  { time: '5/15/2025, 08:46 PM', points: 100, balance: 100 },
];

const history = [
  { id: '7WE3EQIA7D4Z', type: 'Points recharge', cost: '$ 86.26', method: 'Apple Pay', date: '2/1/2025, 06:35 PM' },
  { id: '5YYNKEM41VSK', type: 'Points recharge', cost: '﷼ 393.64', method: 'Bank card', date: '1/23/2025, 02:28 AM' },
  { id: 'OJBDQT84X2OB', type: 'Points recharge', cost: '﷼ 393.64', method: 'STC Pay', date: '1/3/2025, 10:38 PM' },
  { id: 'OJBDQT84X2OB', type: 'Points recharge', cost: '﷼ 393.64', method: 'STC Pay', date: '1/3/2025, 10:38 PM' },
  { id: 'OJBDQT84X2OB', type: 'Points recharge', cost: '﷼ 393.64', method: 'STC Pay', date: '1/3/2025, 10:38 PM' },
  { id: 'OJBDQT84X2OB', type: 'Points recharge', cost: '﷼ 393.64', method: 'STC Pay', date: '1/3/2025, 10:38 PM' },
  { id: 'OJBDQT84X2OB', type: 'Points recharge', cost: '﷼ 393.64', method: 'STC Pay', date: '1/3/2025, 10:38 PM' },
];

const Recharge = () => {
  return (
    <div className="min-h-full py-40 px-4 text-white ">
      <h1 className="text-2xl font-bold mb-8 text-left">Buy Points</h1>

      {/* Points Packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {pointPackages.map((pkg, i) => (
          <div
            key={i}
            className="bg-black/60 rounded-2xl border border-gray-600 shadow-md p-6 text-center h-60 flex flex-col items-center justify-between transition hover:scale-105 duration-300"
          >
            {/* Icon with background */}
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-2">
              <CoinsIcon className="w-6 h-6 text-white" />
            </div>

            {/* Points Text */}
            <div className="text-2xl font-bold text-white">{pkg.points + pkg.bonus} Points</div>

            {/* Description */}
            <p className="text-sm mt-1 text-gray-300">
              Increases your balance by {pkg.points}
              {pkg.bonus > 0 && (
                <>
                  {' '}
                  ( <span className="text-green-500"> + {pkg.bonus}</span>)
                </>
              )}
            </p>

            {/* Price */}
            <div className="text-xl font-semibold my-2 text-emerald-400">${pkg.price.toFixed(2)}</div>

            {/* Buy Button */}
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium">
              BUY
            </button>
          </div>
        ))}
      </div>

      {/* Wallet and Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Section */}
        <div className="bg-black/60 border border-gray-600 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Wallet</h2>
          {/* {wallet.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b py-3 border-gray-300">
              <div>
                <div className="font-medium text-blue-500">Recharge: {item.points} points</div>
                <div className="text-sm text-gray-300">{item.time}</div>
              </div>
              <div className="font-semibold text-green-500"> + {item.balance}pts</div>
            </div>
          ))} */}
        </div>

        {/* Payment History */}
        <div className="bg-black/60 border border-gray-600 rounded-xl p-6 shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-300 border-b border-gray-300">
                <th className="py-2">ID</th>
                <th className="py-2">Type</th>
                <th className="py-2">Cost</th>
                <th className="py-2">Payment Method</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* {history.map((h, i) => (
                <tr key={i} className="border-b border-gray-300 ">
                  <td className="py-2">{h.id}</td>
                  <td className="py-2">{h.type}</td>
                  <td className="py-2">{h.cost}</td>
                  <td className="py-2">{h.method}</td>
                  <td className="py-2">{h.date}</td>
                  <td className="py-2 text-green-500 font-bold">✔</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
