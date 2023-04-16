import { useSelector } from "react-redux";
import { SavedCardData } from "../../utils/paymentProcessor";
import { AppState } from "../../utils/reducers";

const SavedCards = () => {
  const cardData = useSelector(
    (state: AppState) => state.cardData?.savedCardData
  );

  console.log("cardData:", cardData);

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Saved Cards</h2>
      {cardData ? (
        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            You have {cardData.length} saved{" "}
            {cardData.length === 1 ? "card" : "cards"}.
          </p>
          <ul className="mt-2 space-y-2">
            {cardData.map((card: SavedCardData, index: number) => (
              <li key={index}>
                <div className="border rounded-md p-2">
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      <span className="text-gray-700 font-semibold mr-2">
                        **** **** **** {card.cardNumber.slice(-4)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {card.cardExpiry} - {card.cardCVV}
                      </span>
                    </div>
                    <button className="text-red-500 text-sm">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-gray-600">No saved cards.</p>
      )}
    </div>
  );
};

export default SavedCards;
