import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaymentData, PaymentProcessor } from "../../utils/paymentProcessor";
import { AppState } from "../../utils/reducers";

export const AddCardButton = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [password, setPassword] = useState("");

  const paymentData = useSelector((state: AppState) => state.paymentData);

  const handleSaveCard = () => {
    const paymentDataWithCardMethod: PaymentData = {
      ...paymentData,
      method: "card",
      customerName: "John Doe",
      customerEmail: "JohnDoe@test.com",
    };

    const paymentProcessor = new PaymentProcessor(paymentDataWithCardMethod);

    paymentProcessor.validatePayment();
    paymentProcessor.saveCard(cardNumber, cardExpiry, cardCVV, password);

    dispatch({
      type: "SAVE_CARD_DATA",
      payload: paymentProcessor.savedCardData,
    });

    // Wait for the store to update and then close the modal
    setTimeout(() => {
      setShowModal(false);
    }, 100);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Card</button>

      {showModal && (
        <div>
          <h2>Add Card Details</h2>
          <label>
            Card Number:
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </label>
          <label>
            Expiry Date:
            <input
              type="text"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
            />
          </label>
          <label>
            CVV:
            <input
              type="text"
              value={cardCVV}
              onChange={(e) => setCardCVV(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button onClick={handleSaveCard}>Save Card</button>
        </div>
      )}
    </>
  );
};
