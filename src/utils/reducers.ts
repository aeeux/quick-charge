import { combineReducers } from "redux";
import { PaymentData, SavedCardData } from "../utils/paymentProcessor";

interface PaymentDataState extends PaymentData {}

interface CardDataState {
  savedCardData: SavedCardData | null;
}

const initialPaymentDataState: PaymentDataState = {
  amount: 0,
  method: "card",
  customerName: "",
  customerEmail: "",
};

const initialCardDataState: CardDataState = {
  savedCardData: null,
};

export const paymentDataReducer = (
  state = initialPaymentDataState,
  action: any
) => {
  switch (action.type) {
    case "UPDATE_PAYMENT_DATA":
      console.log(action.payload); // Log the paymentData state to the console
      return action.payload;
    default:
      return state;
  }
};

export const cardDataReducer = (
  state = initialCardDataState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SAVE_CARD_DATA":
      console.log(action.payload); // Log the saved card data to the console
      return {
        savedCardData: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  paymentData: paymentDataReducer,
  cardData: cardDataReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
