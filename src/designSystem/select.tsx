"use client";

import * as SelectPrimitive from "@radix-ui/react-select";

import styled from "styled-components";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  ariaLabel: string;
  value: string;
  options: Array<SelectOption>;
  onValueChange: (value: string) => void;
};

export default function Select({
  ariaLabel,
  value,
  options,
  onValueChange,
}: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger asChild aria-label={ariaLabel}>
        <StyledSelect_Trigger>
          <SelectPrimitive.Value />
        </StyledSelect_Trigger>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          asChild
          position="popper"
          side="bottom"
          sideOffset={6}
          align="start"
          avoidCollisions={false}
        >
          <StyledSelect_Content>
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  asChild
                >
                  <StyledSelect_Item>
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </StyledSelect_Item>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </StyledSelect_Content>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

const StyledSelect_Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 145px;
  height: 40px;
  padding: 0 12px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-sm);
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: border-color 140ms ease;

  &::after {
    content: "";
    width: 6px;
    height: 6px;
    flex-shrink: 0;
    border-right: 1px solid currentColor;
    border-bottom: 1px solid currentColor;
    transform: rotate(45deg) translateY(-2px);
  }

  &:hover {
    border-color: var(--color-border-strong);
  }

  &:focus-visible,
  &[data-state="open"] {
    border-color: var(--color-text);
  }

  &[data-placeholder] {
    color: var(--color-text-muted);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledSelect_Content = styled.div`
  z-index: 1000;
  min-width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  overflow-y: auto;
  padding: 4px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  box-shadow: 0 8px 24px rgb(35 35 39 / 8%);
  animation: select-enter 120ms ease-out;

  @keyframes select-enter {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledSelect_Item = styled.div`
  display: flex;
  align-items: center;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: var(--text-sm);
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-highlighted] {
    background: var(--color-surface-muted);
    color: var(--color-text);
  }

  &[data-state="checked"] {
    color: var(--color-text);
    font-weight: 500;
  }

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
`;
