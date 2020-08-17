import React, { useCallback } from 'react';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

export const CirculationLogEventActions = () => {
  const renderTrigger = useCallback(({ triggerRef, onToggle, ariaProps, keyHandler }) => (
    <Button
      ref={triggerRef}
      onClick={onToggle}
      onKeyDown={keyHandler}
      marginBottom0
      {...ariaProps}
    >
      <Icon icon="ellipsis" />
    </Button>
  ), []);

  const renderMenu = useCallback(({ open, onToggle }) => (
    <DropdownMenu
      role="menu"
      open={open}
      onToggle={onToggle}
    >
      <span>Log event actions</span>
    </DropdownMenu>
  ), []);

  return (
    <Dropdown
      renderTrigger={renderTrigger}
      renderMenu={renderMenu}
    />
  );
};
