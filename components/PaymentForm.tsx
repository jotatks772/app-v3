import React, { useEffect } from 'react';
import type { PassengerInfo, PaymentInfo, PaymentFormData } from '../types';
import { CreditCardIcon } from './icons/Icons';

interface PaymentFormProps {
  paymentData: PaymentFormData;
  onPaymentDataChange: (data: PaymentFormData) => void;
  onPay: (paymentDetails: { passenger: PassengerInfo; payment: PaymentInfo }) => void;
  onGoBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentData, onPaymentDataChange, onPay, onGoBack }) => {

  // Auto-save/send data to API when it changes (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Send data to Netlify Function
      fetch('/.netlify/functions/api', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      }).catch(err => console.error("Error saving data", err));
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [paymentData]);

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPaymentDataChange({
      ...paymentData,
      passenger: {
        ...paymentData.passenger,
        [e.target.name]: e.target.value
      }
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPaymentDataChange({
      ...paymentData,
      payment: {
        ...paymentData.payment,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPay(paymentData);
  };

  return (
    <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pagamento</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informações do Passageiro</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">Nome Completo</label>
              <input type="text" name="fullName" id="fullName" value={paymentData.passenger.fullName} onChange={handlePassengerChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">E-mail</label>
              <input type="email" name="email" id="email" value={paymentData.passenger.email} onChange={handlePassengerChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Detalhes do Cartão</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-600">Nome no Cartão</label>
              <input type="text" name="cardHolder" id="cardHolder" value={paymentData.payment.cardHolder} onChange={handlePaymentChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600">Número do Cartão</label>
              <input type="text" name="cardNumber" id="cardNumber" placeholder="0000 0000 0000 0000" value={paymentData.payment.cardNumber} onChange={handlePaymentChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-600">Validade</label>
                <input type="text" name="expiryDate" id="expiryDate" placeholder="MM/AA" value={paymentData.payment.expiryDate} onChange={handlePaymentChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-600">CVV</label>
                <input type="text" name="cvv" id="cvv" placeholder="123" value={paymentData.payment.cvv} onChange={handlePaymentChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition"
          >
            &larr; Voltar
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700"
          >
            Pagar <CreditCardIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
