import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { PaymentData, PaymentProcessor } from "../utils/paymentProcessor";
import { Inter } from "next/font/google";

import { paymentDataReducer } from "../utils/reducers"; // import the paymentDataReducer specifically

const inter = Inter({ subsets: ["latin"] });

const initialState = {
  paymentData: {
    amount: 0,
    method: "card",
    customerName: "",
    customerEmail: "",
  },
};

const paymentMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === "MAKE_PAYMENT") {
    const paymentProcessor = new PaymentProcessor(store.getState().paymentData);
    paymentProcessor.validatePayment();
    paymentProcessor.processPayment();
  }

  return next(action);
};

const rootReducer = combineReducers({
  paymentData: paymentDataReducer,
});

const store = createStore(rootReducer, initialState);
store.dispatch = paymentMiddleware(store)(store.dispatch);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
