import {
  useMutation,
} from 'react-query';
import {
  useLocation,
} from 'react-router-dom';
import queryString from 'query-string';
import { useIntl } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';
import { useShowCallout, downloadBase64 } from '@folio/stripes-acq-components';

import { buildLogEventsQuery } from '../utils';
import {
  EXPORT_JOBS_API,
} from '../constants';

const downloadJobExports = async (jobId, ky, showCallout) => {
  await ky.get(`${EXPORT_JOBS_API}/${id}/download`, {
    headers: { accept: 'application/octet-stream' },
  })
    .blob()
    .then(data => {
      downloadBase64(fileName, URL.createObjectURL(data));
    })
    .catch(() => {
      showCallout({
        messageId: 'ui-export-manager.exportJob.details.action.download.error',
        type: 'error',
      });
    });
};

// const secureDownload = (jobId, ky, showCallout) => {
//   const poll = (id) => {
//     console.log('`111111111111`', `111111111111`)
//     setTimeout(async () => {
//       const job = await ky.get(`data-export-spring/jobs/${id}`).json();

//       if (job.status === 'FAILED') {
//         showCallout({
//           message: formatMessage({ id: 'ui-circulation-log.logEvents.actions.export.failed' }),
//           type: 'error',
//         });
//       } else if (job.status === 'SUCCESSFUL') {
//         showCallout({
//           message: formatMessage({ id: 'ui-circulation-log.logEvents.actions.export.successful' }),
//         });
//         await ky.get(`${EXPORT_JOBS_API}/${id}/download`, {
//           headers: { accept: 'application/octet-stream' },
//         })
//           .blob()
//           .then(data => {
//             downloadBase64(fileName, URL.createObjectURL(data));
//           })
//           .catch(() => {
//             showCallout({
//               messageId: 'ui-export-manager.exportJob.details.action.download.error',
//               type: 'error',
//             });
//           });
//       } else {
//         poll(job.id);
//       }
//     }, 10 * 1000);;

//     console.log('111111111111111111111222222222', 111111111111111111111222222222)
//     poll(jobId)
//   };
  // return async (fileName) => {
  //   return ky.get(`${EXPORT_JOBS_API}/${jobId}/download`, {
  //     headers: { accept: 'application/octet-stream' },
  //   })
  //     .blob()
  //     .then(data => {
  //       downloadBase64(fileName, URL.createObjectURL(data));
  //     })
  //     .catch(() => {
  //       showCallout({
  //         messageId: 'ui-export-manager.exportJob.details.action.download.error',
  //         type: 'error',
  //       });
  //     });
  // };
// };

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
        downloadJobExports(job.id, ky, showCallout);
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
