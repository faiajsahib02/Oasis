import { useEffect, useState } from 'react';
import { getInvoicePreview, InvoicePreview } from '../../services/api';
import { Loader2, Download, Receipt } from 'lucide-react';

const MyBill = () => {
  const [bill, setBill] = useState<InvoicePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const data = await getInvoicePreview();
        setBill(data);
      } catch (err) {
        setError('Failed to load bill details');
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!bill) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">My Folio</h1>
          <p className="text-slate-500">Current Bill Summary</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Receipt Card */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-200 print:shadow-none print:border-none">
        {/* Receipt Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <Receipt className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Ocean Paradise Resort</h2>
          <p className="text-slate-500 text-sm mt-1">Guest Folio</p>
        </div>

        {/* Bill Details */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-dashed border-slate-200">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Guest Name</p>
              <p className="text-lg font-medium text-slate-900">{bill.guest_name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Stay Duration</p>
              <p className="text-lg font-medium text-slate-900">{bill.stay_days} Nights</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Room Charges ({bill.stay_days} nights)</span>
              <span className="font-medium text-slate-900">{formatCurrency(bill.room_total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Dining & Room Service</span>
              <span className="font-medium text-slate-900">{formatCurrency(bill.restaurant_total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Laundry Service</span>
              <span className="font-medium text-slate-900">{formatCurrency(bill.laundry_total)}</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-slate-900">
            <div className="flex justify-between items-center">
              <span className="text-xl font-serif font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(bill.grand_total)}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">Includes all taxes and fees</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500">Thank you for staying with us!</p>
        </div>
      </div>
    </div>
  );
};

export default MyBill;
