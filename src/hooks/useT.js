import { useIntl } from 'react-intl';

/**
 * Hook to return translation tag function
 *
 * Usage example:
 *   const t = useT();
 *   return <div>{t`example.key`}</div>
 */
export const useT = () => {
  const { formatMessage } = useIntl();

  return tagged => formatMessage({ id: `ui-circulation-log.${tagged[0]}` });
};
