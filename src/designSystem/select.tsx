"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

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
          <StyledSelect_Value>
            <SelectPrimitive.Value />
          </StyledSelect_Value>
          <SelectPrimitive.Icon asChild>
            <StyledSelect_ChevronWrap>
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </StyledSelect_ChevronWrap>
          </SelectPrimitive.Icon>
        </StyledSelect_Trigger>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          asChild
          position="popper"
          side="bottom"
          sideOffset={2}
          align="start"
          collisionPadding={12}
        >
          <StyledSelect_Content>
            <SelectPrimitive.Viewport asChild>
              <StyledSelect_Viewport>
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
                      <SelectPrimitive.ItemIndicator asChild>
                        <StyledSelect_ItemCheck>
                          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                        </StyledSelect_ItemCheck>
                      </SelectPrimitive.ItemIndicator>
                    </StyledSelect_Item>
                  </SelectPrimitive.Item>
                ))}
              </StyledSelect_Viewport>
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
  gap: 10px;
  width: 100%;
  min-width: 145px;
  min-height: 46px;
  padding: 0 12px 0 16px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-base);
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: border-color var(--dur-base) var(--ease-silk);

  &:hover {
    border-color: var(--color-border-strong);
  }

  &:focus-visible {
    border-color: var(--color-primary);
  }

  &[data-state="open"] {
    border-color: var(--color-primary);
  }

  &[data-placeholder] {
    color: var(--color-text-muted);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledSelect_Value = styled.span`
  overflow: hidden;
  flex: 1;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSelect_ChevronWrap = styled.span`
  display: grid;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  place-items: center;
  color: var(--color-text-muted);
  transition: transform var(--dur-base) var(--ease-silk);

  [data-state="open"] & {
    transform: rotate(180deg);
    color: var(--color-primary);
  }
`;

const StyledSelect_Content = styled.div`
  z-index: 1200;
  min-width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  overflow: hidden;
  padding: 6px;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow:
    0 0 0 1px var(--color-border),
    0 12px 32px rgb(31 36 32 / 14%);
  transform-origin: var(--radix-select-content-transform-origin);
  animation: select-enter 140ms var(--ease-silk);

  @keyframes select-enter {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const StyledSelect_Viewport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledSelect_Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 36px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: var(--text-sm);
  cursor: pointer;
  outline: none;
  user-select: none;
  transition:
    background var(--dur-fast) var(--ease-silk),
    color var(--dur-fast) var(--ease-silk);

  & + & {
    margin-top: 2px;
  }

  &[data-highlighted] {
    background: var(--color-primary-soft);
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

const StyledSelect_ItemCheck = styled.span`
  display: grid;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  place-items: center;
  color: var(--color-primary);
`;
