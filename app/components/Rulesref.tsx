export default function RulesRef() {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg w-96">
      <h5 className="text-xl font-bold text-white">Start</h5>
      <p className="text-white">Each player receives 3 chips.</p>

      <h5 className="text-xl font-bold text-white mt-4">Rolling</h5>
      <ul className="list-disc pl-5 text-white">
        <li>3+ chips → Roll 3 dice</li>
        <li>2 chips → Roll 2 dice</li>
        <li>1 chip → Roll 1 die</li>
        <li>0 chips → Skip rolling (still in the game).</li>
      </ul>
      <p className="mt-2 text-white">
        After rolling the dice, the player takes action depending on the dice
        rolled.
      </p>

      <h5 className="text-xl font-bold text-white mt-4">Dice Results</h5>
      <ul className="list-disc pl-5 text-white">
        <li>Rolling an L: Pass a chip to the player on your left.</li>
        <li>Rolling an R: Pass a chip to the player on your right.</li>
        <li>Rolling a C: Put a chip in the center pot.</li>
        <li>Rolling a D: Do nothing.</li>
      </ul>

      <h5 className="text-xl font-bold text-white mt-4">Win</h5>
      <ul className="list-disc pl-5 text-white">
        <li>Last player with chips wins the pot!</li>
      </ul>
    </div>
  );
}
