import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { render, screen, waitFor } from '@testing-library/react';
import { byLabelText, byRole } from 'testing-library-selector';
import userEvent from '@testing-library/user-event';

import { CirculationLogListContainer } from './CirculationLogListContainer';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

const mockData = {
  logRecords: [],
  servicePoints: [],
};

const mockAPI = {
  logs: {
    GET: jest.fn(() => Promise.resolve({
      logRecords: mockData.logRecords,
      totalRecords: mockData.logRecords.length,
    })),
  },
  servicePoints: {
    GET: jest.fn(() => Promise.resolve(mockData.servicePoints)),
  },
};

const setup = async (data = []) => {
  mockData.logRecords = data;

  // To make `useList` load records we need to supply some filter params
  window.history.pushState({}, '', '?userBarcode=%2A');

  const mutator = {
    logEventsListEvents: mockAPI.logs,
    logEventsServicePoints: mockAPI.servicePoints,
  };

  render(<CirculationLogListContainer mutator={mutator} />, { wrapper: Wrapper });

  await waitFor(expect(document.querySelector('[class*=spinner]')).not.toBeInTheDocument);
};


describe('Circulation Log List Container', () => {
  beforeEach(() => {
    mockAPI.logs.GET.mockClear();
    mockAPI.servicePoints.GET.mockClear();
  });

  it('fetches log events', async () => {
    await setup([]);

    const params = {
      limit: 100,
      offset: 0,
      query: '(userBarcode=="***") sortby date/sort.descending',
    };

    expect(mockAPI.logs.GET).toHaveBeenNthCalledWith(1, {
      params: { ...params, limit: 0 },
    });
    expect(mockAPI.logs.GET).toHaveBeenNthCalledWith(2, { params });
  });

  it('fetches service points', async () => {
    await setup([]);

    expect(mockAPI.servicePoints.GET).toHaveBeenCalled();
  });

  it('displays Circulation Log List', async () => {
    await setup([{ id: 1 }, { id: 2 }]);

    expect(screen.getByRole('grid')).toBeVisible();
  });
});


describe('Managing focus', () => {
  const ui = {
    results: byLabelText(/meta\.title/),
    textFilters: {
      fields: {
        user: byRole('textbox', { name: /user/ }),
        item: byRole('textbox', { name: /item/ }),
        description: byRole('textbox', { name: /description/ }),
      },
      apply: byRole('button', { name: /filter\.apply/ }),
    },
    dateRange: {
      fields: {
        from: byRole('textbox', { name: /from/ }),
        to: byRole('textbox', { name: /to/ }),
      },
      apply: byRole('button', { name: /dateRange\.apply/ }),
    },
  };

  beforeEach(() => {
    mockData.logRecords = [];
    mockData.servicePoints = [];
  });

  describe('on page load', () => {
    test('first text field is auto-focused when there is no results', async () => {
      await setup([]);

      const [first, ...rest] = screen.getAllByRole('textbox');

      // if the test fails - we will know who's got the focus
      rest.forEach(field => expect(field).not.toHaveFocus());
      expect(ui.results.get()).not.toHaveFocus();

      expect(first).toHaveFocus();
    });

    test('results pane is auto-focused when there are some results', async () => {
      await setup([{ id: 1 }, { id: 2 }]);

      expect(ui.results.get()).toHaveFocus();
    });
  });

  describe.each(Object.entries(ui.textFilters.fields))('for text filter "%s"', (name, node) => {
    async function checkNoResults() {
      mockData.logRecords = [];

      userEvent.type(node.get(), 'something without results');
      userEvent.click(ui.textFilters.apply.get());

      await (expect(node.get()).toHaveFocus);
    }

    async function checkWithResults() {
      mockData.logRecords = [{ id: 1 }, { id: 2 }];

      userEvent.type(node.get(), 'something with results');
      userEvent.click(ui.textFilters.apply.get());

      await (expect(ui.results.get()).toHaveFocus);
    }

    test(
      'flow: no results - with results - no results',
      () => setup([]).then(checkWithResults).then(checkNoResults),
    );

    test(
      'flow: no results - no results - with results',
      () => setup([]).then(checkNoResults).then(checkWithResults),
    );

    test(
      'flow: initial results - with results - no results',
      () => setup([{ id: 1 }, { id: 2 }]).then(checkWithResults).then(checkNoResults),
    );

    test(
      'flow: initial results - no results - with results',
      () => setup([{ id: 1 }, { id: 2 }]).then(checkNoResults).then(checkWithResults),
    );
  });

  describe('for date range filter', () => {
    test('with no initial results', async () => {
      await setup([]);

      const from = ui.dateRange.fields.from.get();
      const to = ui.dateRange.fields.to.get();

      userEvent.type(from, '01/01/2000');
      userEvent.type(to, '01/01/2001');
      userEvent.click(ui.dateRange.apply.get());

      await (expect(to).toHaveFocus);
    });

    test('with initial results', async () => {
      await setup([{ id: 1 }, { id: 2 }]);

      const from = ui.dateRange.fields.from.get();
      const to = ui.dateRange.fields.to.get();

      userEvent.type(from, '01/01/2000');
      userEvent.type(to, '01/01/2001');
      userEvent.click(ui.dateRange.apply.get());

      await (expect(ui.results.get()).toHaveFocus);
    });
  });

  describe('for mixed filters interaction', () => {
    function fillAndApply() {
      userEvent.type(ui.dateRange.fields.from.get(), '01/01/2000');
      userEvent.type(ui.dateRange.fields.to.get(), '01/01/2001');
      userEvent.type(ui.textFilters.fields.item.get(), 'something');
      userEvent.click(ui.textFilters.apply.get());
    }

    test('with no initial results', async () => {
      await setup([]);

      fillAndApply();

      await (expect(ui.textFilters.fields.item.get()).toHaveFocus);
    });

    test('with initial results', async () => {
      await setup([{ id: 1 }, { id: 2 }]);

      fillAndApply();

      await (expect(ui.results.get()).toHaveFocus);
    });
  });
});
