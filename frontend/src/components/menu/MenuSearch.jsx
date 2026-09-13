const MenuSearch = ({ value, onChange }) => {
  return (
    <div className="container-midway">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search dishes..."
          className="w-full rounded-xl border border-brand-green/10 bg-brand-white py-4 pl-12 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
      </div>
    </div>
  );
};

export default MenuSearch;