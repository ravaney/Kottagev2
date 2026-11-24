import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BoundaryMap from './BoundaryMap';
import { BoundaryCollection, projectBoundaries } from './geometry';
import parishes from './jamaicaParishes.json';

const data: BoundaryCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'a', label: 'Alpha' }, geometry: { type: 'Polygon', coordinates: [
      [[0, 0], [2, 0], [2, 2], [0, 0]],
      [[0.5, 0.5], [1, 0.5], [1, 1], [0.5, 0.5]],
    ] } },
    { type: 'Feature', properties: { id: 'b', label: 'Beta' }, geometry: { type: 'MultiPolygon', coordinates: [
      [[[3, 0], [4, 0], [4, 1], [3, 0]]],
      [[[5, 0], [6, 0], [6, 1], [5, 0]]],
    ] } },
  ],
};
const getFeatureId = (feature: BoundaryCollection['features'][number]) => String(feature.properties.id);
const getFeatureLabel = (feature: BoundaryCollection['features'][number]) => String(feature.properties.label);

test('preserves polygon holes and multipolygon islands, and fits all 14 supplied parishes', () => {
  const paths = projectBoundaries(data);
  expect(paths[0].match(/M/g)).toHaveLength(2);
  expect(paths[1].match(/M/g)).toHaveLength(2);
  const jamaicaPaths = projectBoundaries(parishes as BoundaryCollection);
  expect(jamaicaPaths).toHaveLength(14);
  for (const path of jamaicaPaths) {
    expect(path).not.toMatch(/NaN|Infinity/);
    for (const pair of Array.from(path.matchAll(/[ML]([\d.]+),([\d.]+)/g))) {
      expect(Number(pair[1])).toBeGreaterThanOrEqual(28);
      expect(Number(pair[1])).toBeLessThanOrEqual(972);
      expect(Number(pair[2])).toBeGreaterThanOrEqual(28);
      expect(Number(pair[2])).toBeLessThanOrEqual(432);
    }
  }
  expect(projectBoundaries({ type: 'FeatureCollection', features: [] })).toEqual([]);
});

test('highlights a configured zone, supports keyboard selection, and clears selection', () => {
  const onSelect = jest.fn();
  render(<BoundaryMap data={data} getFeatureId={getFeatureId} getFeatureLabel={getFeatureLabel}
    zones={[{ id: 'both', label: 'Shared zone', color: '#123456', members: ['a', 'b'] }]} onSelect={onSelect} />);
  const alpha = screen.getByRole('button', { name: 'Alpha, Shared zone' });
  const beta = screen.getByRole('button', { name: 'Beta, Shared zone' });
  fireEvent.mouseEnter(alpha);
  expect(alpha).toHaveClass('is-active');
  expect(beta).toHaveClass('is-active');
  expect(beta).toHaveAttribute('fill', '#123456');
  fireEvent.mouseLeave(alpha);
  expect(beta).not.toHaveClass('is-active');
  fireEvent.keyDown(alpha, { key: 'Enter' });
  expect(onSelect).toHaveBeenLastCalledWith(data.features[0]);
  expect(alpha).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(onSelect).toHaveBeenLastCalledWith(null);
  expect(alpha).toHaveAttribute('aria-pressed', 'false');
});

test('controlled selection follows the parent and first zone wins overlapping membership', () => {
  const onSelect = jest.fn();
  const props = { data, getFeatureId, getFeatureLabel, onSelect,
    zones: [{ id: 'first', label: 'First', color: 'red', members: ['a'] }, { id: 'second', label: 'Second', color: 'blue', members: ['a', 'b'] }] };
  const { rerender } = render(<BoundaryMap {...props} selectedId="b" />);
  const alpha = screen.getByRole('button', { name: 'Alpha, First' });
  fireEvent.click(alpha);
  expect(onSelect).toHaveBeenLastCalledWith(data.features[0]);
  expect(alpha).toHaveAttribute('aria-pressed', 'false');
  expect(alpha).toHaveAttribute('fill', 'red');
  rerender(<BoundaryMap {...props} selectedId="a" />);
  expect(alpha).toHaveAttribute('aria-pressed', 'true');
});
