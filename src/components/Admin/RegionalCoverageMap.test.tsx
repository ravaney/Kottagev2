import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RegionalCoverageMap from './RegionalCoverageMap';
import { useAllProperties } from '../../hooks/propertyHooks';
import {
  jamaicaCoverageZones,
  propertyParishId,
  propertyInCoverageZone,
} from './regionalCoverage';
import data from '../BoundaryMap/jamaicaParishes.json';
import type { BoundaryCollection } from '../BoundaryMap';

jest.mock('../../hooks/propertyHooks', () => ({ useAllProperties: jest.fn() }));
const mockedQuery = useAllProperties as jest.Mock;
const properties = [
  'St. James',
  'Saint Hanover',
  'Westmoreland',
  'St. Andrew',
  'Kingston',
  'Unknown',
].map((state, index) => ({
  id: String(index),
  name: `Property ${index}`,
  address: {
    state: state === 'Saint Hanover' ? 'Hanover' : state,
    country: 'Jamaica',
  },
  coordinates:
    state === 'St. Andrew' ? { longitude: -76.79, latitude: 18.02 } : undefined,
}));

beforeEach(() =>
  mockedQuery.mockReturnValue({
    data: properties,
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  })
);

test('regional sidebar shows leader, deduped staff directory, parish properties, and property counts', () => {
  const assignments = [
    {
      id: 1,
      staffName: 'John Smith',
      role: 'Property Manager',
      assignmentType: 'regional' as const,
      assignmentValue: 'Western Jamaica',
    },
    {
      id: 2,
      staffName: 'John Smith',
      role: 'Property Manager',
      assignmentType: 'parish' as const,
      assignmentValue: 'Hanover',
    },
    {
      id: 3,
      staffName: 'Sarah Johnson',
      role: 'Customer Support',
      assignmentType: 'parish' as const,
      assignmentValue: 'Westmoreland',
    },
  ];
  render(
    <RegionalCoverageMap assignments={assignments} onAssign={jest.fn()} />
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Western Jamaica' })
  );
  expect(
    screen.getByRole('complementary', { name: 'Area details' })
  ).toHaveTextContent('Regional operations');
  ['Hanover', 'St. James', 'Westmoreland'].forEach(parish => {
    expect(screen.getByText(parish)).toBeInTheDocument();
  });
  expect(screen.getByText('Regional leader')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Change leader' })
  ).toBeInTheDocument();
  expect(screen.getAllByText('John Smith')).toHaveLength(2);
  expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  expect(screen.getByText('Coverage unknown')).toBeInTheDocument();
  expect(screen.getAllByText(/^Property \d$/)).toHaveLength(3);
  expect(screen.getByText('Data & boundary information')).toBeInTheDocument();
});

test('regional sidebar shows a vacant leader state when no regional assignment exists', () => {
  render(<RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Western Jamaica' })
  );
  expect(screen.getByText('No regional leader assigned.')).toBeInTheDocument();
  expect(screen.getByText('Vacant')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Assign leader' })
  ).toBeInTheDocument();
  expect(screen.getByText('No staff assigned.')).toBeInTheDocument();
});

test('regions stay colored, map clicks show region/parish counts, and assignment uses the selected area', () => {
  const onAssign = jest.fn();
  render(<RegionalCoverageMap assignments={[]} onAssign={onAssign} />);
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('complementary', { name: 'Area details' })
  ).not.toBeInTheDocument();
  const hanover = screen.getByRole('button', {
    name: 'Hanover, Western Jamaica',
  });
  expect(hanover).toHaveAttribute('fill', '#c4a6e8');
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Western Jamaica' })
  );
  expect(
    screen.getByRole('status', { name: 'Western Jamaica property count' })
  ).toHaveTextContent('3');
  expect(hanover).not.toHaveClass('is-dimmed');
  const kingston = screen.getByRole('button', { name: 'Kingston, Capital' });
  expect(kingston).toHaveClass('is-dimmed');
  fireEvent.mouseEnter(kingston);
  expect(kingston).not.toHaveClass('is-dimmed');
  expect(hanover).toHaveClass('is-dimmed');
  fireEvent.mouseLeave(kingston);
  expect(kingston).toHaveClass('is-dimmed');
  expect(hanover).not.toHaveClass('is-dimmed');
  fireEvent.click(screen.getByRole('button', { name: 'Assign staff here' }));
  expect(onAssign).toHaveBeenLastCalledWith('Western Jamaica', 'regional');
  fireEvent.click(hanover);
  expect(
    screen.getByRole('status', { name: 'Hanover property count' })
  ).toHaveTextContent('1');
  expect(
    screen.getByRole('button', { name: 'St. James, Western Jamaica' })
  ).not.toHaveClass('is-dimmed');
  expect(
    screen.getByRole('button', { name: 'Westmoreland, Western Jamaica' })
  ).not.toHaveClass('is-dimmed');
  expect(kingston).toHaveClass('is-dimmed');
  fireEvent.click(screen.getByRole('button', { name: 'Assign staff here' }));
  expect(onAssign).toHaveBeenLastCalledWith('Hanover', 'parish');
  fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(hanover).toHaveAttribute('fill', '#c4a6e8');
  expect(kingston).not.toHaveClass('is-dimmed');
});

test('query failures and loading do not display a false zero', () => {
  mockedQuery.mockReturnValue({
    data: undefined,
    isPending: true,
    isError: false,
  });
  const { rerender } = render(
    <RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Capital' })
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  mockedQuery.mockReturnValue({
    data: undefined,
    isPending: false,
    isError: true,
    refetch: jest.fn(),
  });
  rerender(<RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />);
  expect(screen.getByRole('status')).toHaveTextContent('Unavailable');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Unable to load property counts.'
  );
});

test('normalizes parish names, uses actual coordinates as fallback, and preserves overlapping region memberships', () => {
  const features = (data as BoundaryCollection).features;
  const address = {
    address1: '',
    city: '',
    state: 'Saint James Parish',
    country: 'Jamaica',
  };
  expect(propertyParishId({ address }, features)).toBe('JM10');
  expect(
    propertyParishId(
      {
        address: { ...address, state: '' },
        coordinates: { latitude: 18.36966435, longitude: -77.85293241 },
      },
      features
    )
  ).toBe('JM10');
  expect(
    propertyParishId({ address: { ...address, country: 'USA' } }, features)
  ).toBeNull();
  expect(
    propertyParishId({ address: { ...address, state: 'Unknown' } }, features)
  ).toBeNull();
  const members = jamaicaCoverageZones.flatMap(zone => zone.members);
  expect(members).toHaveLength(14);
  expect(new Set(members).size).toBe(14);
  expect(new Set(members)).toEqual(
    new Set(features.map(feature => String(feature.properties.adm1_pcode)))
  );
});

test('national park polygon separates Portland properties and retains full parish totals', () => {
  mockedQuery.mockReturnValue({
    data: [
      ...properties,
      {
        id: 'near',
        address: { state: 'Portland', country: 'Jamaica' },
        coordinates: { longitude: -76.676, latitude: 18.14 },
      },
      {
        id: 'far',
        address: { state: 'Portland', country: 'Jamaica' },
        coordinates: { longitude: -76.53746, latitude: 18.12736 },
      },
      { id: 'unknown', address: { state: 'Portland', country: 'Jamaica' } },
    ],
    isPending: false,
    isError: false,
  });
  render(<RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />);
  const portland = screen.getByRole('button', {
    name: 'Portland, Eastern Jamaica',
  });
  const borderBand = screen.getByRole('button', {
    name: 'Portland: Blue Mountains Region portion',
  });
  expect(portland).toHaveAttribute('fill', '#e8a9b7');
  expect(portland.getAttribute('mask')).toContain('exclude');
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Blue Mountains Region' })
  );
  expect(portland).toHaveClass('is-dimmed');
  expect(borderBand).not.toHaveClass('is-dimmed');
  expect(
    screen.getByRole('status', { name: 'Blue Mountains Region property count' })
  ).toHaveTextContent('1');
  expect(screen.getByRole('alert')).toHaveTextContent(
    '1 properties in split parishes need coordinates'
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Eastern Jamaica' })
  );
  expect(portland).not.toHaveClass('is-dimmed');
  expect(borderBand).toHaveClass('is-dimmed');
  expect(
    screen.getByRole('status', { name: 'Eastern Jamaica property count' })
  ).toHaveTextContent('1');
  fireEvent.click(portland);
  expect(
    screen.getByRole('status', { name: 'Portland property count' })
  ).toHaveTextContent('3');
  expect(
    screen.getByRole('button', { name: 'St. Thomas, Eastern Jamaica' })
  ).not.toHaveClass('is-dimmed');
  expect(borderBand).toHaveClass('is-dimmed');
});

test('northwestern St. Thomas is in the mountain band while southeastern St. Thomas stays Eastern', () => {
  const mountains = jamaicaCoverageZones.find(zone => zone.id === 'mountains')!;
  const eastern = jamaicaCoverageZones.find(zone => zone.id === 'eastern')!;
  const near = { coordinates: { longitude: -76.638, latitude: 18.09 } };
  const far = { coordinates: { longitude: -76.35, latitude: 17.96 } };
  expect(propertyInCoverageZone(near, 'JM12', mountains)).toBe(true);
  expect(propertyInCoverageZone(near, 'JM12', eastern)).toBe(false);
  expect(propertyInCoverageZone(far, 'JM12', mountains)).toBe(false);
  expect(propertyInCoverageZone(far, 'JM12', eastern)).toBe(true);
  render(<RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />);
  const overlay = screen.getByRole('button', {
    name: 'St. Thomas: Blue Mountains Region portion',
  });
  expect(overlay).toHaveAttribute('fill-opacity', '0.5');
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Blue Mountains Region' })
  );
  expect(overlay).not.toHaveClass('is-dimmed');
});

test('Capital includes Kingston and urban St. Andrew while national park properties are classified separately', () => {
  const capital = jamaicaCoverageZones.find(zone => zone.id === 'capital')!;
  const mountains = jamaicaCoverageZones.find(zone => zone.id === 'mountains')!;
  const urban = { coordinates: { longitude: -76.79, latitude: 18.02 } };
  const mountain = { coordinates: { longitude: -76.682, latitude: 18.104 } };
  expect(propertyInCoverageZone({}, 'JM03', capital)).toBe(true);
  expect(propertyInCoverageZone(urban, 'JM06', capital)).toBe(true);
  expect(propertyInCoverageZone(urban, 'JM06', mountains)).toBe(false);
  expect(propertyInCoverageZone(mountain, 'JM06', capital)).toBe(false);
  expect(propertyInCoverageZone(mountain, 'JM06', mountains)).toBe(true);
  expect(propertyInCoverageZone({}, 'JM06', mountains)).toBeNull();
  render(<RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Select region Capital' })
  );
  expect(
    screen.getByRole('status', { name: 'Capital property count' })
  ).toHaveTextContent('2');
});

test('details sidebar appears only after selection and the mountain zone uses green', () => {
  render(<RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />);
  expect(
    screen.queryByRole('complementary', { name: 'Area details' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'UNESCO', exact: true })
  ).not.toBeInTheDocument();
  const mountains = screen.getByRole('button', {
    name: 'Select region Blue Mountains Region',
  });
  expect(mountains).toHaveStyle({ backgroundColor: '#a9cf9b' });
  const portion = screen.getByRole('button', {
    name: 'St. Andrew: Blue Mountains Region portion',
  });
  expect(portion).toHaveAttribute('fill', '#a9cf9b');
  fireEvent.click(mountains);
  expect(
    screen.getByRole('complementary', { name: 'Area details' })
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(
    screen.queryByRole('complementary', { name: 'Area details' })
  ).not.toBeInTheDocument();
});

test('first map click enters a region without selecting the entry parish, then parish hover and selection work', () => {
  const { container } = render(
    <RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />
  );
  const hanover = screen.getByRole('button', {
    name: 'Hanover, Western Jamaica',
  });
  const james = screen.getByRole('button', {
    name: 'St. James, Western Jamaica',
  });
  fireEvent.mouseEnter(hanover);
  fireEvent.click(hanover);
  expect(
    screen.getByRole('status', { name: 'Western Jamaica property count' })
  ).toHaveTextContent('3');
  expect(hanover).toHaveAttribute('aria-pressed', 'false');
  expect(hanover).not.toHaveClass('is-parish-hovered');
  expect(
    container.querySelector('.boundary-map__selection-outline')
  ).toBeNull();
  fireEvent.mouseMove(james);
  expect(james).toHaveClass('is-parish-hovered');
  expect(hanover).not.toHaveClass('is-dimmed');
  fireEvent.click(james);
  expect(james).toHaveAttribute('aria-pressed', 'true');
  expect(
    screen.getByRole('status', { name: 'St. James property count' })
  ).toHaveTextContent('1');
  expect(
    container.querySelector('.boundary-map__selection-outline')
  ).not.toBeNull();
  fireEvent.mouseEnter(hanover);
  expect(hanover).toHaveClass('is-parish-hovered');
});

test('mountain and single-parish zones select directly and do not drill into parishes', () => {
  const { container, unmount } = render(
    <RegionalCoverageMap assignments={[]} onAssign={jest.fn()} />
  );
  const mountains = screen.getByRole('button', {
    name: 'St. Andrew: Blue Mountains Region portion',
  });
  fireEvent.click(mountains);
  fireEvent.click(mountains);
  expect(
    screen.getByRole('status', { name: 'Blue Mountains Region property count' })
  ).toBeInTheDocument();
  expect(
    container.querySelector('.boundary-map__selection-outline')
  ).toBeNull();
  fireEvent.mouseMove(mountains);
  expect(mountains).not.toHaveClass('is-parish-hovered');
  unmount();
  const single = render(
    <RegionalCoverageMap
      assignments={[]}
      onAssign={jest.fn()}
      zones={[
        {
          id: 'one',
          label: 'Hanover zone',
          color: '#c4a6e8',
          members: ['JM02'],
        },
      ]}
    />
  );
  const parish = screen.getByRole('button', { name: 'Hanover, Hanover zone' });
  fireEvent.click(parish);
  fireEvent.click(parish);
  expect(
    screen.getByRole('status', { name: 'Hanover zone property count' })
  ).toBeInTheDocument();
  expect(parish).toHaveAttribute('aria-pressed', 'false');
  expect(
    single.container.querySelector('.boundary-map__selection-outline')
  ).toBeNull();
});
