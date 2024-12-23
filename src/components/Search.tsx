import { useNavigate } from "react-router-dom";
import { FormEvent, useRef } from "react";

const Search = () => {
  const navigate = useNavigate();

  const searchRef = useRef<HTMLInputElement>(null);

  function searchValid(searchInput: string) {
    if (searchInput.length <= 0) {
      searchRef.current?.focus();
      return false;
    }
    return true;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (searchRef.current) {
      const isValid = searchValid(searchRef.current.value);
      if (isValid) {
        navigate(`/kanji/${searchRef.current.value}`);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex justify-center select-none"
    >
      <input
        ref={searchRef}
        className="w-4/6 max-w-96 py-2 px-4 max-2xs:text-sm bg-transparent backdrop-blur-lg text-white placeholder:text-white placeholder:text-opacity-40 dark:placeholder:text-opacity-20 caret-white rounded-none rounded-s-2xl border border-white border-opacity-40 dark:border-opacity-20 focus:border-opacity-70 dark:focus:border-opacity-35 outline-none"
        type="text"
        placeholder="Search Kanji"
      />
      <button
        type="submit"
        className="dark:opacity-50 group bg-white bg-opacity-25 hover:bg-opacity-30 backdrop-blur-3xl text-white rounded-e-2xl flex items-center transition-transform"
      >
        <div className="group-hover:scale-95 transition-transform px-5 ">
          <span className="max-sm:hidden">Search</span>
          <img
            className="size-5 sm:hidden max-w-none pointer-events-none"
            src="/search_icon.svg"
          />
        </div>
      </button>
    </form>
  );
};

export default Search;
