import { useDispatch, useSelector } from "react-redux";
import { PaymentData, PaymentProcessor } from "../../utils/paymentProcessor";
import { AppState } from "../../utils/reducers";

export const PaymentButton = () => {
  const dispatch = useDispatch();
  const paymentData = useSelector((state: AppState) => state.paymentData);
  const cardData = useSelector((state: AppState) => state.cardData);

  const handlePayment = () => {
    if (!cardData || !cardData.savedCardData) {
      return;
    }

    const savedCardData = cardData.savedCardData;

    const paymentProcessor = new PaymentProcessor({
      amount: paymentData.amount,
      method: "card",
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      cardNumber: savedCardData.cardNumber,
      cardExpiry: savedCardData.cardExpiry,
      cardCVV: savedCardData.cardCVV,
    });

    paymentProcessor.validatePayment(); // <-- error is thrown here

    paymentProcessor.processPayment();
    dispatch({ type: "MAKE_PAYMENT" });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!cardData || !cardData.savedCardData}
    >
      Pay ${paymentData.amount.toFixed(2)}
    </button>
  );
};
