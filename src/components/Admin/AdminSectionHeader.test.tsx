import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AdminSectionHeader from './AdminSectionHeader';
import { AdminPageHeader, AdminPanelProvider, StaffPortalOnly } from './AdminHeaderContext';
import RegionalStaffHeader from './RegionalStaffHeader';

test('regional wrapper preserves assignment behavior and current coverage counts', () => {
  const create = jest.fn();
  render(<RegionalStaffHeader onNewAssignment={create} parishCount={14} regionCount={6} />);
  expect(screen.getByRole('heading', { name: 'Regional Staff Assignment', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('14 Parishes')).toBeInTheDocument();
  expect(screen.getByText('6 Coverage Regions')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'New Assignment' }));
  expect(create).toHaveBeenCalledTimes(1);
});

test('page-owned controls retain their callbacks inside the shared header', () => {
  const change = jest.fn();
  render(<AdminSectionHeader title="Analytics" icon="analytics" contextLabel={null}
    actions={<select aria-label="Time range" onChange={change} defaultValue="1M"><option value="1M">1 Month</option><option value="3M">3 Months</option></select>} />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Time range' }), { target: { value: '3M' } });
  expect(change).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('combobox')).toHaveValue('3M');
});

test('shared staff pages use the new header only in the admin panel without duplicating stats', () => {
  const page = <>
    <StaffPortalOnly><nav>Staff navigation</nav></StaffPortalOnly>
    <AdminPageHeader title="Review Moderation" icon="review-moderation" fallback={<><h1>Staff reviews</h1><p>12 pending</p></>}>
      <p>12 pending</p>
    </AdminPageHeader>
  </>;
  const { rerender } = render(page);
  expect(screen.getByRole('heading', { name: 'Staff reviews' })).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getAllByText('12 pending')).toHaveLength(1);
  rerender(<AdminPanelProvider>{page}</AdminPanelProvider>);
  expect(screen.getByRole('heading', { name: 'Review Moderation', level: 1 })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Staff reviews' })).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  expect(screen.getAllByText('12 pending')).toHaveLength(1);
});
