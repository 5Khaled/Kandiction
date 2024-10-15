import PropTypes from "prop-types";
function KanjiMeanings({ Meanings }) {
  return (
    <div className="flex flex-col overflow-hidden rounded text-white max-sm:text-sm">
      <header className="bg-white bg-opacity-100 px-10 py-2 font-bold text-black flex justify-center">
        Meanings
      </header>
      <div className="flex flex-wrap items-center justify-center gap-0.5 bg-black bg-opacity-25 p-1">
        {Meanings &&
          [...Meanings.split(", ")].map((m, i) => (
            <div
              className="flex-grow rounded bg-black bg-opacity-10 px-3 py-2"
              key={i}
            >
              <div className="flex items-center justify-center text-center">
                {m}
              </div>
            </div>
          ))}
        {!Meanings && <div className="flex-grow text-center">-</div>}
      </div>
    </div>
  );
}
KanjiMeanings.propTypes = {
  Meanings: PropTypes.string,
};

export default KanjiMeanings;
