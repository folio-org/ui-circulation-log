import {
  useMutation,
} from 'react-query';
import {
  useLocation,
} from 'react-router-dom';
import queryString from 'query-string';
import { useIntl } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { buildLogEventsQuery } from '../utils';

const downloadJobExports = ({ files, type, name, endTime }) => {
  files.forEach((file) => {
    const link = document.createElement('a');

    link.href = file;
    link.download = `${type}_${name}_${endTime}`;
    link.target = '_blank';

    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );

    document.body.removeChild(link);
  });
};

export const useCirculationLogExportPolling = () => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();
  const { formatMessage } = useIntl();

  const poll = (id) => {
    setTimeout(async () => {
      const job = await ky.get(`data-export-spring/jobs/${id}`).json();

      if (job.status === 'FAILED') {
        showCallout({
          message: formatMessage({ id: 'ui-circulation-log.logEvents.actions.export.failed' }),
          type: 'error',
        });
      } else if (job.status === 'SUCCESSFUL') {
        showCallout({
          message: formatMessage({ id: 'ui-circulation-log.logEvents.actions.export.successful' }),
        });
        downloadJobExports(job);
      } else {
        poll(job.id);
      }
    }, 10 * 1000);
  };

  return poll;
};

export const useCirculationLogExport = (options) => {
  const location = useLocation();
  const ky = useOkapiKy();

  const poll = useCirculationLogExportPolling();

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () => {
      const json = {
        type: 'CIRCULATION_LOG',
        exportTypeSpecificParameters: {
          query: buildLogEventsQuery(queryString.parse(location.search)),
        },
      };

      return ky.post('data-export-spring/jobs', { json });
    },
    ...options,
    onSuccess: async (response) => {
      const job = await response.json();

      options.onSuccess(job);

      poll(job.id);
    },
  });

  return {
    isLoading,
    requestExport: mutateAsync,
  };
};
