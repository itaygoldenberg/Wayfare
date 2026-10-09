import "./pagination.css";

// What the page switcher needs to know.
class PaginationProps {
  public page: number;
  public pageCount: number;
  public onChange: (page: number) => void;
}

// Previous / page numbers / next; hidden when everything fits on one page.
export function Pagination(props: PaginationProps) {
  const { page, pageCount, onChange } = props;
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}>
        ‹ Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "current" : ""}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button onClick={() => onChange(page + 1)} disabled={page === pageCount}>
        Next ›
      </button>
    </div>
  );
}
