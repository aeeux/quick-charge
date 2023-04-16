import Image from "next/image";
import { PaymentButton } from "../components/payment/PaymentButton";
import { AddCardButton } from "../components/payment/AddCard";
import SavedCards from "../components/cards/SavedCards";

export default function Home() {
  return (
    <div>
      <h1>My Next.js App</h1>
      <p>Click the button below to make a payment:</p>
      <PaymentButton />
      <AddCardButton />
      <SavedCards />
    </div>
  );
}
