import React, { useState } from 'react';
import { getInvoicePreview, processCheckout, InvoicePreview } from '../../services/api';
import { Loader2, Search, CreditCard, CheckCircle, Printer, AlertCircle } from 'lucide-react';

const CheckoutManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bill, setBill] = useState<InvoicePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a room number');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    setBill(null);

    try {
      const data = await getInvoicePreview(searchTerm.trim());
      setBill(data);
    } catch (err) {
      setError('Could not find guest or generate invoice. Ensure guest is checked in.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (!window.confirm(`Charge credit card ${formatCurrency(bill?.grand_total || 0)} and finalize checkout?`)) {
      return;
    }

    setProcessing(true);
    try {
      await processCheckout(searchTerm.trim());
      setSuccess(true);
      setBill(null);
      setSearchTerm('');
    } catch (err) {
      setError('Checkout transaction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Checkout Manager</h1>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter Room Number or Guest Name..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Guest'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-xl text-center mb-8 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">Checkout Successful</h2>
          <p className="text-emerald-600 mb-6">Guest has been checked out and room marked as dirty.</p>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Printer className="w-5 h-5" />
            Print Final Invoice
          </button>
        </div>
      )}

      {/* Invoice Preview */}
      {bill && !success && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bill Details */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Invoice Preview</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">DRAFT</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Guest Name</span>
                <span className="font-medium text-slate-900">{bill.guest_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Stay Duration</span>
                <span className="font-medium text-slate-900">{bill.stay_days} Nights</span>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Room Charges</span>
                  <span className="font-medium text-slate-900">{formatCurrency(bill.room_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Restaurant & Bar</span>
                  <span className="font-medium text-slate-900">{formatCurrency(bill.restaurant_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Laundry</span>
                  <span className="font-medium text-slate-900">{formatCurrency(bill.laundry_total)}</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(bill.grand_total)}</span>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h3 className="font-bold text-slate-800 mb-4">Payment Actions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Credit Card</span>
                </div>
                <p className="text-sm text-slate-500">Visa ending in 4242</p>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process Payment
                    <span className="bg-blue-500 px-2 py-0.5 rounded text-sm">
                      {formatCurrency(bill.grand_total)}
                    </span>
                  </>
                )}
              </button>
              <p className="text-xs text-center text-slate-400">
                This will charge the card on file and close the folio.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutManager;
