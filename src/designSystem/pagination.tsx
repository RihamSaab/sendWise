"use client";

import styled from "styled-components";

export type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const pageSizeOptions: Array<number> = [10, 25, 50];

export default function Pagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <StyledPagination_Container>
      <StyledPagination_Summary>
        Showing {startItem}–{endItem} of {totalItems}
      </StyledPagination_Summary>

      <StyledPagination_Controls>
        <StyledPagination_PageSize>
          <label htmlFor="transactions-page-size">Rows per page</label>

          <select
            id="transactions-page-size"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </StyledPagination_PageSize>

        <StyledPagination_Button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          aria-label="Go to previous page"
        >
          Previous
        </StyledPagination_Button>

        <StyledPagination_PageInfo aria-live="polite">
          Page {page} of {Math.max(totalPages, 1)}
        </StyledPagination_PageInfo>

        <StyledPagination_Button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Go to next page"
        >
          Next
        </StyledPagination_Button>
      </StyledPagination_Controls>
    </StyledPagination_Container>
  );
}

const StyledPagination_Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-top: var(--stroke) solid var(--color-border);
  background: transparent;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const StyledPagination_Summary = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
`;

const StyledPagination_Controls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const StyledPagination_PageSize = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  select {
    min-height: 32px;
    padding: 0 8px;
    border: var(--stroke) solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
    font: inherit;
    font-size: var(--text-sm);
  }
`;

const StyledPagination_Button = styled.button`
  min-height: 32px;
  padding: 0 14px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-sm);
  cursor: pointer;
  transition:
    border-color 140ms ease,
    color 140ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-text);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:focus-visible {
    outline: 1px solid var(--color-text);
    outline-offset: 2px;
  }
`;

const StyledPagination_PageInfo = styled.span`
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
  white-space: nowrap;
`;
