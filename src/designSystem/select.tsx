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
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  outline: none;

  &::after {
    content: "";
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg) translateY(-2px);
  }

  &:hover {
    border-color: var(--color-primary);
  }

  &:focus-visible,
  &[data-state="open"] {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(34 100 70 / 10%);
  }

  &[data-placeholder] {
    color: var(--color-text);
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
  padding: 5px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: 0 10px 30px rgb(0 0 0 / 12%);
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
  min-height: 38px;
  padding: 8px 10px;
  border-radius: 7px;
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-highlighted] {
    background: var(--color-background);
    color: var(--color-primary);
  }

  &[data-state="checked"] {
    color: var(--color-primary);
    font-weight: 600;
  }

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
`;
